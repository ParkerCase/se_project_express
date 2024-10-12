const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth"); // Import auth middleware
const {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Routes
router.get("/", getClothingItems); // No auth required for getting all items

// Protect all other routes with authorization middleware
router.get("/:itemId", auth, getClothingItem);
router.post("/", auth, createClothingItem);
router.delete("/:itemId", auth, deleteClothingItem);

// Routes for likes (protected)
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
