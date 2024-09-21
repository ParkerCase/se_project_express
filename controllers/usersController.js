const mongoose = require("mongoose");

const { isURL } = require("validator");

const User = require("../models/user");

const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Function to create a user with validation for avatar URL
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  // Ensure avatar is defined and a string before validating the URL
  if (!avatar || typeof avatar !== "string" || !isURL(avatar)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid URL for avatar" });
  }

  return User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid data provided for creating a user",
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

// Function to get all users
const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" })
    );

// Function to get a user by ID
const getUser = (req, res) =>
  User.findById(req.params.userId)
    .orFail(() => new mongoose.Error.DocumentNotFoundError())
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });

module.exports = {
  createUser,
  getUsers,
  getUser,
};
