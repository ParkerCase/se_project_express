const express = require("express");

const router = express.Router();

const {
  getClothingItems,
  getClothingItem,
  createItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Routes
router.get("/", getClothingItems);

router.get("/:itemId", getClothingItem);

router.post("/", createItem);

router.delete("/:itemId", deleteClothingItem);

// Routes for likes
router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
