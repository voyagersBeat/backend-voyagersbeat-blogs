const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.jwt_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader &&
      authHeader.startsWith("Bearer ") &&
      authHeader.split(" ")[1];
    const finalToken = token || req.cookies.token;

    console.log("Token being verified:", finalToken);

    if (!finalToken) {
      return res.status(401).send({ message: "No token provided" });
    }

    const decode = jwt.verify(finalToken, JWT_SECRET);
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
