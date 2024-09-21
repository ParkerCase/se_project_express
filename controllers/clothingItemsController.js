const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const { isValidObjectId } = mongoose;

// Controller to like a clothing item
const likeItem = (req, res) => {
  if (!isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Controller to unlike a clothing item
const dislikeItem = (req, res) => {
  if (!isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Controller to get all clothing items
const getClothingItems = (req, res) => {
  return ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while fetching clothing items" });
    });
};

// Controller to get a single clothing item by ID
const getClothingItem = (req, res) => {
  if (!isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findById(req.params.itemId)
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Controller to create a new clothing item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch(() => {
      res
        .status(BAD_REQUEST)
        .send({
          message: "Invalid data provided for creating a clothing item",
        });
    });
};

// Controller to delete a clothing item by ID
const deleteClothingItem = (req, res) => {
  if (!isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  return ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail(() => new Error("ItemNotFound"))
    .then(() => res.send({ message: "Clothing item deleted" }))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
