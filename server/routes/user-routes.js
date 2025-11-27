const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const User = require("../models/User");

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  // ...
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  // ...
});

// GET LOGGED-IN USER INFO
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
