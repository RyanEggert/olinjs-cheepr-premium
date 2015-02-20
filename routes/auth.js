// Routes related to signing in and signing out.
var path = require("path");
var models = require(path.join(__dirname, "../models/models"));
var authUser = models.authUser;


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    authUser.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, username, password, done) { // callback with email and password from our form
    console.log('passport-method')
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    authUser.findOne({ 'local.username' :  username }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err)
            return done(err);

        // if no user is found, return the message
        if (!user)
            return done(null, false, console.log('Make new user')); // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.validPassword(password))
            return done(null, false, console.log('Wrong password'));

        // all is well, return successful user
        return done(null, user);
    });

}));



var authroutes = {};

var login = function(req, res) {
  res.render('login', {
    currentuser: req.session.user
  });
};

authroutes.login = login;

// login handler @ /users/locauth
var locloginhandler = function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  console.log('topassport')
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
  });
};
authroutes.loclogin = locloginhandler;

// logout
var logout = function(req, res) {
  req.session.user = "";
  res.send(200);
};

authroutes.logout = logout;

module.exports = authroutes;


// var LocalStrategy = require('passport-local').Strategy;
// var User =  require('../models/models');


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    });
  }
));
