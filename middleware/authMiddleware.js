const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token);
  // Ensure the token exists and is in the correct format

  // Extract the token part from the header (after "Bearer ")
  const bearerToken = token.split(" ")[1];
  console.log(bearerToken);

  try {
    const decoded = jwt.verify(bearerToken.value, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data to the request
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const roleMiddleware = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };
