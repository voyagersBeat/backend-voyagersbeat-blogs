const express = require("express");
const router = express.Router();
const User = require("../model/user.model");
const generateToken = require("../middleware/generate.token");
const verifyToken = require("../middleware/verify.token");

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = new User({ email, password, username });
    await user.save();
    res.status(200).send({ message: "Registration Successful", user });
  } catch (err) {
    console.log("Failed to register...", err);
    res.status(500).send({ message: "Registration Failed" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid Password" });
    }

    // Generate token after login
    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict", // Ensures cookies are only sent in a same-site context
      domain: "https://voyagers-backend.onrender.com", // Makes the cookie accessible across subdomains
    });

    res.status(200).send({
      message: "Login Successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("Failed to Login...", err);
    res.status(500).send({ message: "Login Failed!" });
  }
});

// Logout the user
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Logout Successful" });
  } catch (err) {
    console.log("Failed to logout...", err);
    res.status(500).json({ message: "Logout Failed!" });
  }
});

// Fetch current user
router.get("/current-user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ user });
  } catch (err) {
    console.log("Failed to fetch current user...", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role");
    res.status(200).send({ message: "Users Found Successfully", users });
  } catch (err) {
    console.log("Failed to get users...", err);
    res.status(500).json({ message: "Failed to Get Users" });
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    console.log("Failed to delete user...", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Update user's role
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User's role updated successfully", user });
  } catch (err) {
    console.log("Failed to update user's role...", err);
    res.status(500).json({ message: "Failed to update user's role" });
  }
});

module.exports = router;
