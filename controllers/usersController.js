const mongoose = require("mongoose");

const User = require("../models/user");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Create a user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name || name.length < 2 || name.length > 30) {
    return res.status(BAD_REQUEST).json({ message: "Invalid name length" });
  }

  if (!avatar || typeof avatar !== "string" || !isURL(avatar)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid URL for avatar" });
  }

  User.create({ name, avatar })
    .then((user) => res.status(201).json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({
          message: "Invalid data provided for creating a user",
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "An error has occurred on the server",
      });
    });
};

// Get a user by ID
const getUserById = (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid user ID" });
  }

  User.findById(userId)
    .orFail(() => new Error("UserNotFound"))
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.message === "UserNotFound") {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "An error occurred on the server",
      });
    });
};

// Get all users
const getUsers = (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server" })
    );
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
