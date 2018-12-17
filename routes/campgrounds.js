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

// ADD A CAMPGROUND
router.post("/", isLoggedIn, (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user.id,
		username: req.user.username
	}
	var newCampground = { name: name, image: image, description: desc, author: author };
	Campground.create(newCampground, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			console.log(newlyCreated);
			res.redirect("campgrounds");
		}
	})
});

// SHOW FORM FOR CREATING CAMPGROUNDS
router.get("/new", isLoggedIn, (req, res) => {
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

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", { campground: foundCampground });
	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if (err) {
				res.redirect("back");
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
				// doesthe user own the campground

			}
		});
	} else {
		res.redirect("back");
	}
}

module.exports = router;