//// CHEEPR ////
// "Like twitter, but cheepr." //

// external requirements
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var session = require('express-session');
var mongoose = require("mongoose");

// internal requirements
var cheeprs = require("./routes/cheepr");
var users = require("./routes/users");
var authrs = require("./routes/auth");
var config = require('./oauth.js');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var models = require("./models/models");
var authUser = models.authUser;

// passport serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// passport config
passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));

passport.use(new LocalStrategy(
  function(username, password, done) {
    authUser.findOrCreate({
      'local.username': username
    }, {
      'local.password': password,
      'name': username,
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        console.log('make new user')
        users.makeuser(username, password);
        return done(donereturn.err, donereturn.ret);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));


// app creation & configuration
var app = express();

var PORT = process.env.PORT || 3000;
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());



// routes
app.get('/', cheeprs.home);

app.get('/login', authrs.login);
app.post('/logout', authrs.logout);

app.post('/users/auth/local',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/');
  });
app.post('/users/new/', users.new);
app.post('/cheep/new/', cheeprs.new);
app.delete('/cheep/delete/', cheeprs.delete);


app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res) {});
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/'
  }),
  function(req, res) {
    res.redirect('/');
  });
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// connections
mongoose.connect(mongoURI);
app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});

// other functions
// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
