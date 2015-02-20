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

// var makeuser = function(username, password) {
//   console.log('new user maker')
//   var newuser = new authUser();
//   newuser.local.username = username;
//   newuser.local.password = password;
//   doner = newuser.save(function(err, user) {
//     console.log('save callback')
//     var donereturn = {};
//     if (err) {
//       console.log('Error saving new user.');
//       donereturn.err = err;
//       donereturn.ret = null;
//       console.log(typeof(donereturn));
//     } else {
//       donereturn.err = null;
//       donereturn.ret = user;
//       console.log(typeof(donereturn));
//     }
//     return donereturn;
//   });
//   return doner;
// };


// userroutes.makeuser = makeuser;

module.exports = userroutes;
