const { isURL } = require("validator");

const mongoose = require("mongoose");

const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Create a clothing item with validation for imageUrl
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || name.length < 2 || name.length > 30) {
    return res.status(BAD_REQUEST).json({ message: "Invalid name length" });
  }

  if (!imageUrl || typeof imageUrl !== "string" || !isURL(imageUrl)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid URL for image" });
  }

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).json({
          message: "Invalid data provided for creating a clothing item",
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "An error has occurred on the server",
      });
    });
};

// Get a clothing item by ID
const getClothingItemById = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  ClothingItem.findById(itemId)
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "An error has occurred on the server",
      });
    });
};

// Delete a clothing item by ID
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      return res.status(200).json({ message: "Item deleted successfully" });
    })
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error occurred on the server" })
    );
};

// Like a clothing item
const likeItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      return res.status(200).json(item);
    })
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server" })
    );
};

// Dislike a clothing item
const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).json({ message: "Item not found" });
      }
      return res.status(200).json(item);
    })
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "An error has occurred on the server" })
    );
};

module.exports = {
  createClothingItem,
  getClothingItemById,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
