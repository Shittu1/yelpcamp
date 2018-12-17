const express = require("express");
const router = express.Router({mergeParams: true});
const Comment = require("../models/comment");
const Campground = require("../models/campground");

router.get("/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) console.log(err);
		res.render("comments/new", { campground: campground });
	});
});

//post comm
router.post("/", isLoggedIn, (req, res) => {
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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
   }

module.exports = router;