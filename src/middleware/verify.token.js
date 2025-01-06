const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.jwt_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    // Extract token from Authorization header or cookies
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

    // Verify the token
    const decode = jwt.verify(finalToken, JWT_SECRET);
    console.log("Decoded token:", decode);

    if (!decode.userId) {
      return res.status(401).send({ message: "Invalid token payload" });
    }

    // Attach user details to the request
    req.userId = decode.userId;
    req.role = decode.role;

    // Optional: Log token expiry
    if (decode.exp) {
      const remainingTime = decode.exp * 1000 - Date.now();
      console.log(`Token expires in: ${remainingTime / 1000}s`);
    }

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Malformed token" });
    }
    console.error("Token verification error:", err);
    return res.status(401).send({ message: "Token verification failed" });
  }
};

module.exports = verifyToken;
