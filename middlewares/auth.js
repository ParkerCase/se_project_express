const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

// Define constants for status codes
const UNAUTHORIZED = 401;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;

    // Ensure user has an _id (without hard-coding the ID)
    if (!req.user._id) {
      return res.status(UNAUTHORIZED).send({ message: "User ID missing" });
    }

    return next();
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
  }
};

module.exports = auth;
