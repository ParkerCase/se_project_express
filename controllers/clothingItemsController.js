const { isURL } = require("validator");
const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../utils/errors");

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

// Simplified arrow function without block statement
const getClothingItemById = (req, res) =>
  ClothingItem.findById(req.params.id)
    .orFail(() => new Error("ItemNotFound"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.message === "ItemNotFound") {
        return res.status(BAD_REQUEST).send({ message: "Item not found" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });

module.exports = {
  createClothingItem,
  getClothingItemById,
};
