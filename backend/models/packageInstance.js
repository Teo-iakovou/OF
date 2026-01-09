/* eslint-disable @typescript-eslint/no-require-imports */
// models/packageInstance.js
const mongoose = require("mongoose");

const packageInstanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    planKey: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "paused", "expired"],
      default: "active",
      index: true,
    },
    uploadsUsed: { type: Number, default: 0 },
    uploadLimit: { type: Number, default: 0 },
    chatUsedThisCycle: { type: Number, default: 0 },
    chatMonthlyLimit: { type: Number, default: 0 },
    chatCycleEndsAt: { type: Date },
    sadtalkerVideosUsed: { type: Number, default: 0 },
    sadtalkerVideoLimit: { type: Number, default: 0 },
    sadtalkerPrimaryImageHash: { type: String, default: null },
    personaBound: { type: Boolean, default: false },
    rekognitionFaceId: { type: String, default: null },
  },
  { timestamps: true }
);

packageInstanceSchema.statics.getActiveByUserId = function getActiveByUserId(userId) {
  return this.find({ userId, status: "active" }).sort({ createdAt: -1 });
};

module.exports = mongoose.model("PackageInstance", packageInstanceSchema);
