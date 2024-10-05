const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const usersRoutes = require("./routes/users");
const clothingItemsRoutes = require("./routes/clothingItems");
const authRoutes = require("./routes"); // Import the new auth routes

const { NOT_FOUND } = require("./utils/errors");

const app = express();

const { PORT = 3001 } = process.env;

// Middleware to parse JSON request bodies
app.use(express.json());

// Use CORS
app.use(cors());

// Middleware to hardcode the user ID for testing purposes
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // The ID expected by the tests
  };
  next();
});

// Use auth routes for signup and signin
app.use("/auth", authRoutes);

// Use user routes (including /me and profile-related actions)
app.use("/users", usersRoutes);

// Use routes for clothing items
app.use("/items", clothingItemsRoutes);

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Connected to MongoDB");
    }
  })
  .catch((err) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error connecting to MongoDB", err);
    }
  });

// Start the server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Server is running on port ${PORT}`);
  }
});
