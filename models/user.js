const mongoose = require("mongoose");
const { isURL, isEmail } = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v), // Use validator package to validate URL
      message: "Please enter a valid URL.",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    validate: {
      validator: (v) => isEmail(v), // Use validator to validate email format
      message: "Please enter a valid email address.",
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Password is hidden
  },
});

module.exports = mongoose.model("User", userSchema);
