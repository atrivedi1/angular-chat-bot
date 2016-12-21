var mongoose = require('mongoose');
var mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost/test';
mongoose.connect(mongodbUri);


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