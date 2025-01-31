const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  dominantColor: { type: String, required: true },
  platform: { type: String, required: true },
  hashtags: { type: [String], required: true },
  bestPostTime: { type: String, required: true },
  objects: { type: [String], required: true },
  recommendations: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
