const express = require("express");

const app = express();

// Import user routes
const usersRouter = require("./users");

app.use(express.json()); // For parsing application/json
app.use("/users", usersRouter); // All user-related routes will start with /users

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
