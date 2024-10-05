const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jwt for token creation
const { JWT_SECRET } = require("../utils/config"); // Import the secret
const User = require("../models/user");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} = require("../utils/errors");

// Get all users
const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" }),
    );

// Get a user by ID
const getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user ID format" });
  }

  return User.findById(userId)
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
// Create a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Check for missing fields
  if (!name || !avatar || !email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name, avatar, email, and password are required" });
  }

  // Validate name length
  if (typeof name !== "string" || name.length < 2 || name.length > 30) {
    return res.status(BAD_REQUEST).send({ message: "Invalid name length" });
  }

  // Validate the avatar URL (optional step if it's not handled elsewhere)
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  if (!isValidUrl(avatar)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid avatar URL" });
  }

  // Hash the password before saving
  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword }),
    )
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        // Duplicate email error
        return res.status(409).send({ message: "Email already exists" });
      }
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

// Login controller
const login = (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  // Find the user by email and select the password field
  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Invalid email or password" });
      }

      // Compare passwords
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res
            .status(UNAUTHORIZED)
            .send({ message: "Invalid email or password" });
        }

        // Generate a JWT
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.send({ token }); // Ensure a return here
      });
    })
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" }),
    );
};

// Update the current user's profile (Step 7)
const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  // Check for missing fields
  if (!name || !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name and avatar are required" });
  }

  // Validate name length
  if (typeof name !== "string" || name.length < 2 || name.length > 30) {
    return res.status(BAD_REQUEST).send({ message: "Invalid name length" });
  }

  // Update the user in the database
  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }, // Ensure the updated document is returned and validators are run
  )
    .then((user) => res.status(200).send(user))
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

module.exports = {
  getUsers,
  getUser,
  getCurrentUser, // Export the getCurrentUser function
  createUser,
  login, // Export the login function
  updateUser, // Export the updateUser function
};
