const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { isEmail } = require("validator");

const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} = require("../utils/errors");

// Helper function to validate URLs without using 'new'
const isValidUrl = (url) => {
  try {
    return Boolean(new URL(url));
  } catch (error) {
    return false;
  }
};

// Get all users
const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" }),
    );

// Get user by ID
const getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user ID format" });
  }

  return User.findById(userId)
    .orFail(() => new Error("UserNotFound"))
    .then((user) => res.status(200).send(user))
    .catch((err) =>
      err.message === "UserNotFound"
        ? res.status(NOT_FOUND).send({ message: "User not found" })
        : res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: "An error has occurred on the server" }),
    );
};

// Get the current user's data
const getCurrentUser = (req, res) =>
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" }),
    );

// Create a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name, avatar, email, and password are required" });
  }

  if (typeof name !== "string" || name.length < 2 || name.length > 30) {
    return res.status(BAD_REQUEST).send({ message: "Invalid name length" });
  }

  if (!isValidUrl(avatar)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid URL for avatar" });
  }

  if (!isEmail(email)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid email format" });
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword }),
    )
    .then((user) =>
      res
        .status(201)
        .send({ _id: user._id, name: user.name, avatar: user.avatar }),
    )
    .catch((err) =>
      err.code === 11000
        ? res.status(409).send({ message: "Email already exists" })
        : err.name === "ValidationError"
          ? res.status(BAD_REQUEST).send({ message: "Invalid data provided" })
          : res
              .status(INTERNAL_SERVER_ERROR)
              .send({ message: "An error has occurred on the server" }),
    );
};

// Login controller
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findOne({ email })
    .select("+password")
    .then((user) =>
      !user
        ? res
            .status(UNAUTHORIZED)
            .send({ message: "Invalid email or password" })
        : bcrypt.compare(password, user.password).then((matched) =>
            !matched
              ? res
                  .status(UNAUTHORIZED)
                  .send({ message: "Invalid email or password" })
              : res.send({
                  token: jwt.sign({ _id: user._id }, JWT_SECRET, {
                    expiresIn: "7d",
                  }),
                }),
          ),
    )
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      }),
    );
};

// Update the current user's profile
const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name and avatar are required" });
  }

  if (typeof name !== "string" || name.length < 2 || name.length > 30) {
    return res.status(BAD_REQUEST).send({ message: "Invalid name length" });
  }

  if (!isValidUrl(avatar)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid URL for avatar" });
  }

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) =>
      err.name === "ValidationError"
        ? res.status(BAD_REQUEST).send({ message: "Invalid data provided" })
        : res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: "An error has occurred on the server" }),
    );
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
