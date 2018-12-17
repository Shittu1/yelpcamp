const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

// root route
router.get("/", (req, res) => {
	res.render("landing");
});

// show signup from route
router.get("/register", (req, res) => {
	res.render("register");
});

// signup from logic
router.post("/register", (req, res) => {
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
router.get("/login", (req, res) => {
	res.render("login");
});

//Handling login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), (req, res) => {
});

// logout route
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
 if (req.isAuthenticated()) {
	 return next();
 }
 res.redirect("/login");
}

module.exports = router;