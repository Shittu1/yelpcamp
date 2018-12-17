const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

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
			})
		}
	})
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
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// Comments routes

app.get("/campgrounds/:id/comments/new", (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) console.log(err);
		res.render("comments/new", {campground: campground});
	});	
});

app.post("/campgrounds/:id/comments", (req, res) => {
	//Lookup campground with id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
	//create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if(err) console.log(err);
				campground.comments.push(comment);
				campground.save();
				res.redirect("/campgrounds/" + req.params.id);
			});
	//connect new comment to campground
	//redirect to campground show page
		}
	});

});

app.listen(process.env.PORT || 3000, () => {
	console.log("The YelpCampm Server has started..")
});
