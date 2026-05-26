const mongoose = require("mongoose");

const outputFeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["upload_report", "video"],
    required: true,
  },
  referenceId: {
    type: String,
    required: true,
    trim: true,
  },
  vote: {
    type: String,
    enum: ["up", "down"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// One vote per user per output — upsert on re-vote rather than duplicate
outputFeedbackSchema.index(
  { userId: 1, type: 1, referenceId: 1 },
  { unique: true }
);

module.exports = mongoose.model("OutputFeedback", outputFeedbackSchema);
