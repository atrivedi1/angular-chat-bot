var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  user_name:  String,
  first_name: String,
  last_name:   String,
  work_experience: String,
  highest_education: String,
  degree: String,
  school: String,
  address: String,
  linkedIn_URL: String
});

var userModel = mongoose.model("User", userSchema);

module.exports = userModel;