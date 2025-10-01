const mongoose = require("mongoose");

const timingsSchema = new mongoose.Schema(
  {
    tts_ms: { type: Number },
    sadtalker_ms: { type: Number },
    upload_ms: { type: Number },
  },
  { _id: false }
);

const renderJobSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    kind: { type: String, enum: ["talking-head"], default: "talking-head" },
    status: {
      type: String,
      enum: ["queued", "running", "succeeded", "failed"],
      default: "queued",
      index: true,
    },
    input: {
      imageKey: { type: String, required: true },
      text: { type: String, required: true },
      voiceId: { type: String },
      // Optional: if API pre-generates TTS and stores to S3
      audioKey: { type: String },
      consent: { type: Boolean, default: false },
    },
    output: {
      videoKey: { type: String },
      durationSec: { type: Number },
    },
    costCredits: { type: Number, default: 0 },
    timings: { type: timingsSchema },
    error: { type: String },
    requestMeta: {
      ip: { type: String },
      userAgent: { type: String },
    },
    leasedAt: { type: Date },
    startedAt: { type: Date },
    finishedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RenderJob", renderJobSchema);
