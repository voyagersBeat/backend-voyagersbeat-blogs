const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.jwt_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || req.cookies.token; // Extract token from header or cookies

    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
