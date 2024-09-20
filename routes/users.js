const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
} = require("../controllers/usersController");

// Route to get all users
router.get("/", getUsers);

// Route to get a user by ID
router.get("/:userId", getUser);

// Route to create a new user
router.post("/", createUser);

module.exports = router;
