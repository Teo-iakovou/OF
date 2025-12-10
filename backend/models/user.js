/* eslint-disable @typescript-eslint/no-require-imports */
// models/user.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  purchasedPackage: {
    type: String,
    enum: ["lite", "pro", "ultimate", null],
    default: null,
  },
  uploadLimit: {
    type: Number,
    default: 10, // default for lite
  },
  uploadsUsed: {
    type: Number,
    default: 0,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  chatUsedThisCycle: { type: Number, default: 0 },
  chatMonthlyLimit: { type: Number, default: 20 }, // will be overwritten per plan
  chatCycleEndsAt: { type: Date },
  // SadTalker / talking-head quotas
  sadtalkerVideosUsed: { type: Number, default: 0 },
  // 0 or null = unlimited for the current plan
  sadtalkerVideoLimit: { type: Number, default: 0 },
  // Optional: remember the first face image hash for non-ultimate plans
  sadtalkerPrimaryImageHash: { type: String, default: null },
});

module.exports = mongoose.model("User", userSchema);
