// Routes relating to users & authentication
var path = require("path");
var models = require(path.join(__dirname, "../models/models"));
var authUser = models.authUser;


var userroutes = {};
// new user
var newuser = function(req, res) {
  res.render("home");
};
userroutes.new = newuser;

// login page
var login = function(req, res) {
  res.render("login");
};
userroutes.login = newuser;


// userroutes.makeuser = makeuser;

module.exports = userroutes;
