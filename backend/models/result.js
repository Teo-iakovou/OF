const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
<<<<<<< HEAD
  dominantColor: { type: String, required: true },
  platform: { type: String, required: true },
  hashtags: { type: [String], required: true },
  bestPostTime: { type: String, required: true },
  objects: { type: [String], required: true },
  recommendations: { type: [String], required: true },
=======
  platform: { type: String, required: true }, // Example: "OnlyFans"
  hashtags: { type: [String], required: true }, // AI-generated hashtags
  bestPostTime: { type: String, required: true }, // Suggested time for posting
  objects: { type: [String], required: true }, // Detected objects (e.g., person, accessories)
  recommendations: { type: [String], required: true }, // AI-generated tips
  emotion: { type: String, default: "Neutral" }, // Detected emotion from AI
  ageRange: { type: String, required: false }, // Optional: Age range detection
  pose: { type: String, required: false }, // Optional: AI-detected pose
>>>>>>> packages
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
