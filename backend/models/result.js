const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  email: { type: String, required: true },
  csl: { type: Number, min: 0, max: 3 },               // Content Safety Level
  niche: { type: String },                              // Detected niche
  hasFace: { type: Boolean, default: false },

  // NEW: pipeline status & stage
  status: { type: String, enum: ["processing", "ready", "error"], default: "ready" },
  stage: { type: String, default: "done" },            // e.g., 'vision', 'blueprint', 'captions', 'done', 'error'

  // NEW: dedup by content hash (sha256 of image bytes after normalization)
  imageHash: { type: String, index: true },

  // NEW: whether captions were generated in this run
  captionsGenerated: { type: Boolean, default: false },

  promotion: { type: mongoose.Schema.Types.Mixed, required: true },  // Full Promotion Blueprint
  meta: { type: mongoose.Schema.Types.Mixed },                       // raw Vision data / extra context
  createdAt: { type: Date, default: Date.now },
});

// Efficient lookups
resultSchema.index({ email: 1, createdAt: -1 });
resultSchema.index({ email: 1, imageHash: 1, createdAt: -1 });

module.exports = mongoose.model("Result", resultSchema);