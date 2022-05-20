var express = require('express');
var app = express();
const mongoose = require("mongoose");

/* Requiring body-parser package
to fetch the data that is entered
by the user in the HTML form.*/
const bodyParser = require("body-parser");

// Telling our Node app to include all these modules
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose =
	require("passport-local-mongoose");

// Allowing app to use body parser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	secret: "long secret key",
	resave: false,
	saveUninitialized: false
}));

// Initializing Passport
app.use(passport.initialize());

// Starting the session
app.use(passport.session());

// Connecting mongoose to our database
mongoose.connect(
'mongodb://localhost:27017/userDatabase', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

/* Creating the schema of user which now
include only email and password for
simplicity.*/
const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

/* Just after the creation of userSchema,
we add passportLocalMongoose plugin
to our Schema */
userSchema.plugin(passportLocalMongoose);

// Creating the User model
const User = new mongoose.model("User", userSchema);

/* After the creation of mongoose model,
we have to write the following code */
passport.use(User.createStrategy());

// Serializing and deserializing
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Handling get request on the home route
app.get("/", function (req, res) {

	/* req.isAuthentcated() returns true or
	false depending upon whether a session is
	already running or not. */
	if (req.isAuthenticated()) {

		/* if request is already authenticated,
		i.e. user has already logged in and
		there is no need to login again or
		we can say, session is running.*/
		res.send(
"You have already logged in. No need to login again");
	}

	else {

		// If the user is new and
		// no session is Running already
		res.sendFile(__dirname + "/index.html");
	}
})


// Handling get request on login route
app.get("/login", function (req, res) {
    console.log('-initial login@2-------');
	if (req.isAuthenticated()) {

		/* If request is already authenticated,
		i.e. user has already logged in and
		there is no need to login again. */
		res.send("You have already logged in. No need to login again");
	}
	else {

		/* if session has expired, then user
		need to login back again and
		we will send the Login.html */
		res.sendFile(__dirname + "/login.html");
	}
})

/* Registering the user for the first time
handling the post request on /register route.*/
app.post("/register", function (req, res) {
	console.log(req.body);
	var email = req.body.username;
	var password = req.body.password;
	User.register({ username: email },
		req.body.password, function (err, user) {
			if (err) {
				console.log(err);
			}
			else {
				passport.authenticate("local")
				(req, res, function () {
					res.send("successfully saved!");
				})
			}
		})
})

// Handling the post request on /login route
app.post("/login", function (req, res) {
    console.log('-initial login-------');
	console.log(req.body);

	const userToBeChecked = new User({
		username: req.body.username,
		password: req.body.password
	});

	// Checking if user if correct or not
	req.login(userToBeChecked, function (err) {
		if (err) {
			console.log(err);
			res.redirect("/login");
		}
		else {
			passport.authenticate("local")
				(req, res,function () {
				User.find({ email: req.user.username },
					function (err, docs) {
					if (err) {
						console.log(err);
					}
					else {

					//login is successful
					console.log("credentials are correct");
					res.send("login successful");
						}
					});
			});
		}
	})
})

// Allowing app to listen on port 3000
app.listen(3000, function () {
	console.log("server started successfully");
})
