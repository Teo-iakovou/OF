const mongoose = require("mongoose");

const recommendationPerformanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    packageInstanceId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    kind: {
      type: String,
      required: true,
      enum: ["platformMix", "hashtags", "times", "cta", "caption"],
      index: true,
    },
    platform: { type: String, default: null, index: true },
    variantId: { type: String, required: true, index: true },
    impressions: { type: Number, default: 0, min: 0 },
    engagements: { type: Number, default: 0, min: 0 },
    posts: { type: Number, default: 0, min: 0 },
    lastUsedAt: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
  },
  { minimize: true, versionKey: false, timestamps: true }
);

recommendationPerformanceSchema.index(
  { userId: 1, packageInstanceId: 1, kind: 1, platform: 1, variantId: 1 },
  { unique: true }
);

module.exports = mongoose.model("RecommendationPerformance", recommendationPerformanceSchema);
