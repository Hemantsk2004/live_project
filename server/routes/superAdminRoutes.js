const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");

router.get(
  "/pending-admin-requests",
  verifyToken,
  superAdminMiddleware,
  async (req, res) => {
    const users = await User.find({ adminRequested: true, role: "user" })
      .select("_id fullname email");
    res.json(users);
  }
);

router.post(
  "/approve-admin/:id",
  verifyToken,
  superAdminMiddleware,
  async (req, res) => {
    const user = await User.findById(req.params.id);
    user.role = "admin";
    user.adminRequested = false;
    await user.save();
    res.json({ message: "User promoted to admin" });
  }
);

module.exports = router;
