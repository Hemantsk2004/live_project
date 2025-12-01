const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: String,
    description: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },

    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
      }
    ],

    comments: [
      {
        senderRole: String,
        message: String,
        createdAt: { type: Date, default: Date.now },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
