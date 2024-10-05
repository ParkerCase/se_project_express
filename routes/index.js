const express = require("express");

const usersRoutes = require("./users"); // Import user routes
const clothingItemsRoutes = require("./clothingItems"); // Import clothing items routes

const router = express.Router();

router.use("/users", usersRoutes); // All user-related routes will start with /users
router.use("/items", clothingItemsRoutes); // All clothing items-related routes will start with /items

module.exports = router;
