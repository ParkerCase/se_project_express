const express = require("express");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users");
const clothingItemsRoutes = require("./routes/clothingItems");

const { NOT_FOUND } = require("./utils/errors");

const app = express();

const { PORT = 3001 } = process.env;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to attach a hardcoded user ID to each request
app.use((req, res, next) => {
  req.user = {
    _id: "66edfbf0fb0984ff3b0fdc16",
  };
  next();
});

// Use routes
app.use("/users", usersRoutes);
app.use("/items", clothingItemsRoutes);

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      // Only log this message in development mode
      console.log("Connected to MongoDB");
    }
  })
  .catch((err) => {
    if (process.env.NODE_ENV !== "production") {
      // Only log this message in development mode
      console.error("Error connecting to MongoDB", err);
    }
  });

// Start the server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    // Only log this message in development mode
    console.log(`Server is running on port ${PORT}`);
  }
});
