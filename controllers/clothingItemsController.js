const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const { isValidObjectId } = require("mongoose");

// Controller to like a clothing item
const likeItem = (req, res) => {
  // Validate the itemId before proceeding
  if (!isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // Add user ID to likes array if it's not already there
    { new: true } // Return the updated document after the operation
  )
    .orFail(() => new Error("ItemNotFound")) // Throw error if item is not found
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err); // Log error for debugging

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
  // Validate the itemId before proceeding
  if (!isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // Remove user ID from likes array
    { new: true } // Return the updated document after the operation
  )
    .orFail(() => new Error("ItemNotFound")) // Throw error if item is not found
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err); // Log error for debugging

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
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err); // Log the error for debugging
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred while fetching clothing items" });
    });
};

// Controller to get a single clothing item by ID
const getClothingItem = (req, res) => {
  // Validate the itemId before proceeding
  if (!isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  ClothingItem.findById(req.params.itemId)
    .orFail(() => new Error("ItemNotFound")) // Use .orFail() to handle missing item
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err); // Log the error for debugging

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
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err); // Log the error for debugging
      res.status(BAD_REQUEST).send({
        message: "Invalid data provided for creating a clothing item",
      });
    });
};

// Controller to delete a clothing item by ID
const deleteClothingItem = (req, res) => {
  // Validate the itemId before proceeding
  if (!isValidObjectId(req.params.itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail(() => new Error("ItemNotFound")) // Throw an error if the item is not found
    .then(() => res.send({ message: "Clothing item deleted" }))
    .catch((err) => {
      console.error(err); // Log the error for debugging

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
  getClothingItem, // Export getClothingItem if you want to use it in routes
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
