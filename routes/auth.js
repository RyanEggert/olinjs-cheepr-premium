// Routes related to signing in and signing out.
// Given more time, I could put most Passport stuff here.
var authroutes = {};

var login = function(req, res) {
  res.render('login', {
    currentuser: {
      name: "",
      _id: ""
    }
  });
};

authroutes.login = login;

module.exports = authroutes;
