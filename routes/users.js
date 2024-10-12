const express = require("express");
const auth = require("../middlewares/auth"); // Import auth middleware
const {
  createUser,
  getCurrentUser,
  updateUser,
  login,
} = require("../controllers/users");
const router = express.Router();

// Delete unused routes and controllers (getUsers, getUser)

// Route to sign up a new user (changed to /signup)
router.post("/signup", createUser);

// Route to sign in (login)
router.post("/signin", login);

// Route to get the logged-in user's data (protected)
router.get("/me", auth, getCurrentUser);

// Route to update the logged-in user's profile (protected)
router.patch("/me", auth, updateUser);

module.exports = router;
