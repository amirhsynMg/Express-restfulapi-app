const mongoose = require("mongoose");

// making schema
const userSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
});
// compiling it to a model
const User = mongoose.model("User", userSchema);
module.exports = User;
