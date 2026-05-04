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
    tokensUsed: { type: Number, default: 0 },
    tokensLimit: { type: Number, default: 0 },
    chatUsedThisCycle: { type: Number, default: 0 },
    chatMonthlyLimit: { type: Number, default: 0 },
    chatCycleEndsAt: { type: Date },
    sadtalkerVideosUsed: { type: Number, default: 0 },
    sadtalkerVideoLimit: { type: Number, default: 0 },
    sadtalkerPrimaryImageHash: { type: String, default: null },
    heygenTalkingPhotoId: { type: String, default: null },
    heygenTalkingPhotoHash: { type: String, default: null },
    personaKey: {
      type: String,
      default: null,
      index: true,
      validate: {
        validator: (value) => value === null || (typeof value === "string" && value.trim().length > 0),
        message: "personaKey must be a non-empty string",
      },
    },
    personaBound: { type: Boolean, default: false },
    faceEnrolled: { type: Boolean, default: false },
    rekognitionFaceId: { type: String, default: null },
    faceEnrolledAt: { type: Date, default: null },
    addons: {
      uploads: { type: Number, default: 0 },
      chat: { type: Number, default: 0 },
      sadtalkerVideos: { type: Number, default: 0 },
    },
    lastAddonAppliedAt: { type: Date, default: null },
    lastAddonSessionId: { type: String, default: null },
    stripeCheckoutSessionId: { type: String, default: null },
    stripePaymentIntentId: { type: String, default: null },
  },
  { timestamps: true }
);

packageInstanceSchema.statics.getActiveByUserId = function getActiveByUserId(userId) {
  return this.find({ userId, status: "active" }).sort({ createdAt: -1 });
};

packageInstanceSchema.index({ userId: 1, personaKey: 1 });
packageInstanceSchema.index({ stripeCheckoutSessionId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("PackageInstance", packageInstanceSchema);
