const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  hashtags: { type: [String], required: true },
  bestPostTime: { type: String, required: true },
  tip: { type: String }, // NEW
  aiCaption: { type: String }, // NEW
  dominantColors: { type: [String] }, // NEW
  objects: { type: [String], required: true },
  recommendations: { type: [String] }, // optional if keeping
  emotion: { type: String, default: "Neutral" },
  ageRange: { type: String },
  createdAt: { type: Date, default: Date.now },
    email: { type: String, required: true }, // Add this line!

});

module.exports = mongoose.model("Result", resultSchema);
