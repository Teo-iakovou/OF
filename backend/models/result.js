const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // Example: "OnlyFans"
  hashtags: { type: [String], required: true }, // AI-generated hashtags
  bestPostTime: { type: String, required: true }, // Suggested time for posting
  objects: { type: [String], required: true }, // Detected objects (e.g., person, accessories)
  recommendations: { type: [String], required: true }, // AI-generated tips
  emotion: { type: String, default: "Neutral" }, // Detected emotion from AI
  ageRange: { type: String, required: false }, // Optional: Age range detection
  pose: { type: String, required: false }, // Optional: AI-detected pose
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
