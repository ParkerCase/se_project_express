const express = require("express");
const auth = require("../middlewares/auth"); // Import auth middleware
const { getCurrentUser, updateUser } = require("../controllers/users");

const router = express.Router();

// Route to get the logged-in user's data (protected)
router.get("/me", auth, getCurrentUser);

// Route to update the logged-in user's profile (protected)
router.patch("/me", auth, updateUser);

module.exports = router;
