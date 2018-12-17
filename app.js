const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const session = require("express-session");

require("dotenv").config();

const User = require("./models/user");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
// const User = require("./models/user");
const seedDB = require("./seed");

seedDB();
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// PASSPORT CONFIGURATION
app.use(session({
	secret: "Shadams",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.get("/", (req, res) => {
	res.render("landing");
});

app.get("/campgrounds", (req, res) => {
	// res.render("campgrounds",{campgrounds: campgrounds});
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {
				campgrounds: allCampgrounds
			});
		}
	});
});

app.post("/campgrounds", (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = { name: name, image: image, description: desc };
	Campground.create(newCampground, function (err, newCampground) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("campgrounds");
		}
	})
});

app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

//Show more info about one campground
app.get("/campgrounds/:id", function (req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", { campground: foundCampground });
		}
	});
});

// Comments routes

//show comment form
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) console.log(err);
		res.render("comments/new", { campground: campground });
	});
});

//post comm
app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
	//Lookup campground with id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if (err) console.log(err);
				campground.comments.push(comment);
				campground.save();
				res.redirect("/campgrounds/" + req.params.id);
			});
		}
	});
});

// Auth Routes
//show register form
app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", (req, res) => {
	let newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect("/campgrounds");
		});
	});
});

//show LOGIN form
app.get("/login", (req, res) => {
	res.render("login");
});

//Handling login logic
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), (req, res) => {
});

// logout route
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
 if (req.isAuthenticated()) {
	 return next();
 }
 res.redirect("/login");
}

app.listen(process.env.PORT || 3000, () => {
	console.log("The YelpCampm Server has started..")
});
