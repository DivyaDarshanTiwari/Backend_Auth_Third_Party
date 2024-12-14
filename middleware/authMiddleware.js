const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = (req, res, next) => {
  let token;
  if (req.query.token) {
    // Checking for token in the query parameters
    token = req.query.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("auth middleware: ", token);

  if (!token) {
    return res.status(401).send("Access Denied: No Token Provided");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

const roleMiddleware = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };
