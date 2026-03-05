const mongoose = require("mongoose");

const recommendationHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    packageInstanceId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    source: {
      type: String,
      enum: ["recommended", "posted"],
      default: "recommended",
      index: true,
    },
    kind: {
      type: String,
      required: false,
      enum: ["caption", "hashtags", "cta", "times", "platformMix"],
      index: true,
    },
    platform: { type: String, default: null, index: true },
    variantId: { type: String, required: false },
    variantIdsByKey: { type: mongoose.Schema.Types.Mixed, default: null },
    countsByKey: { type: mongoose.Schema.Types.Mixed, default: null },
    captionTextHashes: { type: [String], default: undefined },
    textHash: { type: String, default: null },
    niche: { type: String, default: null },
    csl: { type: Number, default: null },
    imageHash: { type: String, default: null },
    resultId: { type: mongoose.Schema.Types.ObjectId, default: null, index: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { minimize: true, versionKey: false }
);

recommendationHistorySchema.index({
  userId: 1,
  packageInstanceId: 1,
  kind: 1,
  platform: 1,
  createdAt: -1,
});

module.exports = mongoose.model("RecommendationHistory", recommendationHistorySchema);
