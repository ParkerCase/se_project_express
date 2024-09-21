const mongoose = require("mongoose");

const { isURL } = require("validator");

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
});

module.exports = mongoose.model("User", userSchema);
