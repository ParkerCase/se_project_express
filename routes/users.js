const express = require("express");
const auth = require("../middlewares/auth"); // Import your auth middleware
const {
  getUsers,
  getUser,
  createUser,
  getCurrentUser,
  updateUser,
  login,
} = require("../controllers/users");

const router = express.Router();

// Route to get all users
router.get("/", getUsers);

// Route to get a user by ID
router.get("/:userId", getUser);

// Route to create a new user (signup)
router.post("/", createUser); // Use /signup instead of just /

// Route to log in the user (login)
router.post("/login", login); // Use /login

// Route to get the logged-in user's data
router.get("/me", auth, getCurrentUser);

// Route to update the logged-in user's profile
router.patch("/me", auth, updateUser);

module.exports = router;
