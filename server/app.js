`use strict`;
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const {
	createPage,
	getPages,
	getPage,
	updatePage,
	deletePage,
} = require("./controllers/pages");
const { getWebsiteDetails, updateWebsiteName } = require("./controllers/misc");
const { getAllUsers } = require("./controllers/users");
require("dotenv").config();
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use("/static", express.static("public"));

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	}),
);
app.use(passport.initialize());
app.use(passport.authenticate("session"));

passport.use(
	new LocalStrategy((username, password, callback) => {
		User.find(username, password)
			.then(user => {
				callback(null, user);
			})
			.catch(err => {
				callback(null, false, err);
			});
	}),
);

const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).json({ error: "Unauthorized" });
	}
};
passport.serializeUser((user, callback) => {
	callback(null, {
		id: user.id,
		name: user.name,
		role: user.role,
		email: user.email,
	});
});
passport.deserializeUser((user, callback) => {
	callback(null, user);
});

const authenticate = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		req.logIn(user, err => {
			if (err) {
				return next(err);
			}
			next();
		});
	})(req, res, next);
};

app.post("/session", authenticate, (req, res) => {
	res.status(200).json({ user: req.user });
});
app.get("/session/current", isLoggedIn, (req, res) => {
	res.status(200).json({ user: req.user });
});
app.delete("/logout", (req, res) => {
	req.logout(() => {
		res.status(200).json({ message: "done" });
	});
});

app.get("/site", getWebsiteDetails);

app.get("/pages/:pageSlug", getPage);
app.put("/pages/:pageSlug", isLoggedIn, updatePage);
app.get("/pages", getPages);
app.get("/users", isLoggedIn, getAllUsers);
app.post("/pages", isLoggedIn, createPage);
app.delete("/pages/:id", isLoggedIn, deletePage);
app.put("/site", isLoggedIn, updateWebsiteName);

app.all("*", (req, res) => {
	res.status(404).json({ error: "Not found" });
});
module.exports = app;
