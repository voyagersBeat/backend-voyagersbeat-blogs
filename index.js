const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 8080;
const contactRoutes = require("./src/routes/contactForm");
const session = require("express-session");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: "https://frontend-voyagersbeat-blogs.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

//console.log(process.env.MongoDB_URL);

// All voyagers blog route

const blogRoutes = require("./src/routes/blog.route");
const commentsRoutes = require("./src/routes/comment.route");
const userRoutes = require("./src/routes/auth.user.route");
const chatbotRoutes = require("./src/routes/chatbot.route");

app.use("/api/auth", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api", contactRoutes);
app.use("/api/chatbot", chatbotRoutes);

async function main() {
  await mongoose.connect(process.env.MongoDB_URL);
}

main()
  .then(() => {
    console.log("Database is connected Successfully...");
  })
  .catch((err) => {
    console.log("error to connect database...", err);
  });

app.use(express.json()); 
app.use(
  session({
    secret: "jdkndkndjdndskndjkdnoihffefncieowvnuwp",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hey Developer ✔");
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}...`);
});
