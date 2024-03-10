const jwt = require("jsonwebtoken");
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, jwtSecret);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
      username:decodedToken.username

    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed!" });
  }
};
