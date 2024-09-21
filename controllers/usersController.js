// const { isURL } = require("validator"); // Add this line to fix the 'isURL' undefined issue

const User = require("../models/user");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Get all users
const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" })
    );

// Get a user by ID
const getUser = (req, res) =>
  User.findById(req.params.userId)
    .orFail(() => new Error("UserNotFound"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === "UserNotFound") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });

// Create a new user
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name and avatar are required" });
  }

  return User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Create a user with validation for avatar URL
// const createUser = (req, res) => {
//   const { name, avatar } = req.body;

//   if (!avatar || typeof avatar !== "string" || !isURL(avatar)) {
//     return res.status(BAD_REQUEST).send({ message: "Invalid URL for avatar" });
//   }

//   return User.create({ name, avatar })
//     .then((user) => res.status(201).send(user))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST).send({
//           message: "Invalid data provided for creating a user",
//         });
//       }
//       return res.status(INTERNAL_SERVER_ERROR).send({
//         message: "An error has occurred on the server",
//       });
//     });
// };

// // Get all users
// const getUsers = (req, res) =>
//   User.find({})
//     .then((users) => res.send(users))
//     .catch(() =>
//       res.status(INTERNAL_SERVER_ERROR).send({
//         message: "An error has occurred on the server",
//       })
//     );

// // Get user by ID
// const getUser = (req, res) =>
//   User.findById(req.params.id)
//     .orFail(() => new Error("UserNotFound"))
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.message === "UserNotFound") {
//         return res.status(NOT_FOUND).send({ message: "User not found" });
//       }
//       return res.status(INTERNAL_SERVER_ERROR).send({
//         message: "An error has occurred on the server",
//       });
//     });

module.exports = {
  getUsers,
  getUser,
  createUser,
};
