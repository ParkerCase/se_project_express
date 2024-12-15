const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes"); // Use index.js in routes folder for routing
const { NOT_FOUND } = require("./utils/errors");
const { MONGODB_URI, PORT } = require("./utils/config"); // Import config variables

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Use CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// Remove middleware for hardcoding user ID as authorization will handle this

// Use routes from index.js
app.use("/", routes);

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// MongoDB connection
mongoose
  .connect(MONGODB_URI)
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
