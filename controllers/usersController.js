const { isURL } = require("validator");
const User = require("../models/user");
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../utils/errors");

// Create a user with validation for avatar URL
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

// Simplified arrow function without block statement
const getUserById = (req, res) =>
  User.findById(req.params.id)
    .orFail(() => new Error("UserNotFound"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === "UserNotFound") {
        return res.status(BAD_REQUEST).send({ message: "User not found" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });

module.exports = {
  createUser,
  getUserById,
};
