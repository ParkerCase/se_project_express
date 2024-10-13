const express = require("express");

const usersRoutes = require("./users"); // Import user routes
const clothingItemsRoutes = require("./clothingItems"); // Import clothing items routes

const { createUser, login } = require("../controllers/users"); // Import the signup and signin controllers

const router = express.Router();

// Routes for signing up and signing in (no /users prefix)
router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", usersRoutes); // All user-related routes will start with /users
router.use("/items", clothingItemsRoutes); // All clothing items-related routes will start with /items

module.exports = router;
