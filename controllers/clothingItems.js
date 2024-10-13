const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

// Create a clothing item with validation for imageUrl
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  // Create the item, assigning the owner from the logged-in user
  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid data provided for creating a clothing item",
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Get all clothing items
const getClothingItems = (req, res) => ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      }));

// Get clothing item by ID
const getClothingItem = (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }
  return ClothingItem.findById(id)
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Like a clothing item
const likeItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Dislike (remove like) from a clothing item
const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Delete clothing item
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.isValidObjectId(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
  }
  return ClothingItem.findById(itemId)
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You are not authorized to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() => res.status(200).send({ message: "Item deleted" }));
    })
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createClothingItem,
  getClothingItems,
  getClothingItem,
  likeItem,
  dislikeItem,
  deleteClothingItem,
};
