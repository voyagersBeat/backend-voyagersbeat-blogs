const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.jwt_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    // Extract token only from Authorization header
    const authHeader = req.headers.authorization;
    const token =
      authHeader &&
      authHeader.startsWith("Bearer ") &&
      authHeader.split(" ")[1];

    console.log("Token being verified:", token);

    if (!token) {
      return res.status(401).send({ message: "No token provided" });
    }

    const decode = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decode);

    req.userId = decode.userId;
    req.role = decode.role;

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
