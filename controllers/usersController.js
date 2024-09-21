const User = require("../models/user");
const { NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../utils/errors");

// Controller to get all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while fetching users" })
    );
};

// Controller to get a user by ID
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error("UserNotFound"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === "UserNotFound") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while fetching the user" });
    });
};

// Controller to create a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        // Handle validation errors (e.g., invalid data format)
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for creating a user" });
      }

      // Handle any other error as a server error
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
