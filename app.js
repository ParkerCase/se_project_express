const express = require("express");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/users");
const clothingItemsRoutes = require("./routes/clothingItems");

const { NOT_FOUND } = require("./utils/errors");

const app = express();

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

const { PORT = 3001 } = process.env;

app.use(express.json());
// Middleware to attach a hardcoded user ID to each request
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

app.use((req, res, next) => {
  req.user = {
    _id: "66edfbf0fb0984ff3b0fdc16",
  };
  next();
});

// Use routes
app.use("/users", usersRoutes);
app.use("/items", clothingItemsRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
