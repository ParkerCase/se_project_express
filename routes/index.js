const express = require("express");
const { createUser, login } = require("../controllers/users"); // Import the necessary controllers

const router = express.Router();

// Route for signing up
router.post("/signup", createUser);

// Route for signing in
router.post("/signin", login);

module.exports = router;
