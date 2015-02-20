var mongoose = require("mongoose");
var supergoose = require("supergoose");
// var bcrypt   = require('bcrypt-nodejs');
var models = {};

// user

var userSchema = mongoose.Schema({
  name: String,
  local: {
    username: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});
userSchema.methods.verifyPassword = function(password) {
  return true;
};
userSchema.plugin(supergoose);

models.authUser = mongoose.model("authUser", userSchema);

// cheep

var cheepSchema = mongoose.Schema({
  username: String,
  words: String,
  date: {
    type: Date,
    default: Date.now
  }
});
models.Cheep = mongoose.model("Cheep", cheepSchema);


module.exports = models;
