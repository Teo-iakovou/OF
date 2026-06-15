const mongoose = require("mongoose");

const ConsentLogSchema = new mongoose.Schema({
  // Optional — anonymous visitors give consent before signup
  userId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },

  // The consent payload itself
  categories: {
    necessary: { type: Boolean, default: true },
    analytics: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
  },
  version: { type: String, required: true },          // e.g. "1.0" — bumped on policy change

  // Context
  locale: { type: String },
  gpc: { type: Boolean, default: false },             // Global Privacy Control header

  // Forensics — required for Art. 7(1) demonstrability
  ipHash: { type: String },                           // SHA-256 of IP, NOT raw IP (privacy-preserving)
  userAgent: { type: String, maxlength: 500 },

  // Lifecycle
  action: { type: String, enum: ["granted", "updated", "withdrawn"], required: true, default: "granted" },
  createdAt: { type: Date, default: Date.now, index: true },
}, { collection: "consentlogs" });

// Compound index for ops queries: "all consent events for this user, newest first"
ConsentLogSchema.index({ userId: 1, createdAt: -1 });

// For aggregate analytics: "consent rate for analytics category over time"
ConsentLogSchema.index({ "categories.analytics": 1, createdAt: -1 });

module.exports = mongoose.model("ConsentLog", ConsentLogSchema);
