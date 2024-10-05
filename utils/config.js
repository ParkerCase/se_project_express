require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "66edfbf0fb0984ff3b0fdc16", // Fallback to hardcoded secret in development
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wtwr_db", // MongoDB connection string
  PORT: process.env.PORT || 3001, // Port number, fallback to 3001
};
