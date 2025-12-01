// server/routes/complaintRoutes.js
const express = require("express");
const router = express.Router(); // ✅ THIS WAS MISSING
const Complaint = require("../models/Complaint");
const upload = require("../middleware/upload");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// ===============================
// USER → CREATE COMPLAINT
// ===============================
router.post("/", verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user.id,
      status: "open",
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create complaint" });
  }
});

// ===============================
// USER → GET OWN COMPLAINTS
// ===============================
router.get("/my", verifyToken, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// ===============================
// ADMIN → GET ALL COMPLAINTS
// ===============================
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});

// ===============================
// ADMIN → UPDATE STATUS ✅
// ===============================
router.patch("/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["open", "in_progress", "resolved", "closed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "fullname email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// GET SINGLE COMPLAINT (USER / ADMIN)
// ===============================
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "fullname email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // ✅ User can see only own complaint
    if (
      req.user.role === "user" &&
      complaint.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/comment", verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    complaint.comments.push({
      senderRole: req.user.role,
      message: req.body.message,
    });

    await complaint.save();
    res.json({ message: "Comment added" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// USER → create complaint with attachments
router.post(
  "/",
  verifyToken,
  upload.array("attachments", 5),
  async (req, res) => {
    try {
      const attachments = req.files.map((file) => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
      }));

      const complaint = await Complaint.create({
        title: req.body.title,
        description: req.body.description,
        user: req.user.id,
        attachments,
      });

      res.status(201).json(complaint);
    } catch (err) {
      res.status(500).json({ message: "Failed to create complaint" });
    }
  }
);

module.exports = router;
