"use strict";

const mongoose = require("mongoose");

const heygenVideoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  packageInstanceId: { type: mongoose.Schema.Types.ObjectId, ref: "PackageInstance", required: true },
  videoUrl: { type: String, required: true },
  videoId: { type: String, default: null },
  imageUrl: { type: String, default: null },
  audioUrl: { type: String, default: null },
  creditsConsumed: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

heygenVideoSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("HeygenVideo", heygenVideoSchema);
