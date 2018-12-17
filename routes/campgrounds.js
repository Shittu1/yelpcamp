const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");

router.get("/", (req, res) => {
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

router.post("/", (req, res) => {
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


router.get("/new", (req, res) => {
	res.render("campgrounds/new");
});

//Show more info about one campground
router.get("/:id", function (req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", { campground: foundCampground });
		}
	});
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
   }

module.exports = router;