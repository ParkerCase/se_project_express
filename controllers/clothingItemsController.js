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

  if (!imageUrl || typeof imageUrl !== "string" || !isURL(imageUrl)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid URL for image" });
  }

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Invalid data provided for creating a clothing item",
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

// Get all clothing items
const getClothingItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      })
    );

// Get clothing item by ID
const getClothingItemById = (req, res) =>
  ClothingItem.findById(req.params.id)
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });

// Delete clothing item
const deleteClothingItem = (req, res) =>
  ClothingItem.findByIdAndRemove(req.params.id)
    .orFail(() => new Error("ItemNotFound"))
    .then(() => res.status(200).send({ message: "Item deleted" }))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });

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
  getClothingItems,
  getClothingItemById,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
