const express = require("express");
const { getOptions, getAnswer } = require("../data/chatbotLogic");

const router = express.Router();

router.post("/options", (req, res) => {
  res.json(getOptions());
});

router.post("/answer", (req, res) => {
  const { choice } = req.body;

  // Ensure session is initialized
  if (!req.session) {
    req.session = {};
  }

  req.session.step = req.session.step || 1; // Safely initialize session step
  console.log("Session before processing:", req.session);

  if (choice === undefined) {
    return res.status(400).json({ error: "Invalid choice" });
  }

  // Process user input and respond
  const response = getAnswer(choice, req.session);
  console.log("Session after processing:", req.session);
  res.json(response);
});

module.exports = router;
