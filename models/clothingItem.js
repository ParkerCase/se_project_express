const mongoose = require("mongoose");

const { isURL } = require("validator");

const { Schema } = mongoose;

const clothingItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"], // Restrict to specific values
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v), // Use validator package to validate URL
      message: "Please enter a valid URL.",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClothingItem", clothingItemSchema);
