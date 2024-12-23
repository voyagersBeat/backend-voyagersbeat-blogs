const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.jwt_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const finalToken = token || req.cookies.token;

    if (!finalToken) {
      return res.status(401).send({ message: "No token provided" });
    }

    const decode = jwt.verify(finalToken, JWT_SECRET);

    if (!decode.userId) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.userId = decode.userId;
    req.role = decode.role;
    next();
  } catch (err) {
    res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
