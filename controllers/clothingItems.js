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

  if (
    !imageUrl ||
    typeof imageUrl !== "string" ||
    !isURL(imageUrl, { protocols: ["http", "https"], require_protocol: true })
  ) {
    res.status(BAD_REQUEST).send({ message: "Invalid URL for image" });
    return;
  }

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: "Invalid data provided for creating a clothing item",
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: "An error has occurred on the server",
        });
      }
    });
};

// Get all clothing items
const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() =>
      res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      }),
    );
};

// Get clothing item by ID
const getClothingItem = (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    return;
  }

  ClothingItem.findById(id)
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        res.status(NOT_FOUND).send({ message: "Item not found" });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: "An error has occurred on the server",
        });
      }
    });
};

// Like a clothing item
const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.isValidObjectId(itemId)) {
    res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    return;
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        res.status(NOT_FOUND).send({ message: "Item not found" });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: "An error has occurred on the server",
        });
      }
    });
};

// Dislike (remove like) from a clothing item
const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.isValidObjectId(itemId)) {
    res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    return;
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        res.status(NOT_FOUND).send({ message: "Item not found" });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: "An error has occurred on the server",
        });
      }
    });
};

// Delete clothing item
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.isValidObjectId(itemId)) {
    res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    return;
  }

  ClothingItem.findById(itemId)
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        res
          .status(403)
          .send({ message: "You are not authorized to delete this item" });
        return;
      }

      ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item deleted" }),
      );
    })
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        res.status(NOT_FOUND).send({ message: "Item not found" });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({
          message: "An error has occurred on the server",
        });
      }
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
