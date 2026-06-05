const mongoose = require("mongoose");

const apiUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  email: { type: String, lowercase: true, trim: true, index: true },
  packageInstanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PackageInstance",
    index: true,
  },

  // Which API
  provider: { type: String, enum: ["openai", "google_vision"], required: true },
  endpoint: { type: String, required: true }, // "chat", "caption", "summarization", "title", "vision"
  model: { type: String }, // "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo", "google-vision"

  // Token breakdown (OpenAI)
  promptTokens: { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },

  // Cost estimate in USD
  costUsd: { type: Number, default: 0 },

  // Context
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  requestId: { type: String },

  // Outcome
  success: { type: Boolean, default: true },
  errorMessage: { type: String },
  latencyMs: { type: Number },

  createdAt: { type: Date, default: Date.now },
});

// TTL: auto-delete after 180 days
apiUsageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60, name: "createdAt_1_ttl" });

// Compound indexes for cost analysis queries
apiUsageSchema.index({ userId: 1, createdAt: -1 });
apiUsageSchema.index({ provider: 1, createdAt: -1 });
apiUsageSchema.index({ packageInstanceId: 1, createdAt: -1 });

module.exports = mongoose.model("ApiUsage", apiUsageSchema);
