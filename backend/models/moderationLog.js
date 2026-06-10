const mongoose = require("mongoose");

const moderationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  email: { type: String, lowercase: true, trim: true, index: true },

  // "text" for chat messages, "image" for uploaded images
  inputType: {
    type: String,
    enum: ["text", "image"],
    default: "text",
    index: true,
  },

  // Text payload (empty string for image events)
  inputText: { type: String, default: "" },
  inputLength: { type: Number },

  // Short identifier for the image (e.g. first 16 chars of SHA-256) — ops correlation
  imageRef: { type: String, default: null },

  // Moderation result
  flagged: { type: Boolean, required: true, index: true },
  blocked: { type: Boolean, required: true, default: false, index: true },

  // Which categories triggered
  categories: { type: mongoose.Schema.Types.Mixed },
  categoryScores: { type: mongoose.Schema.Types.Mixed },

  // Which blocking categories specifically fired
  blockedCategories: [{ type: String }],

  // System-failure reason ("API_ERROR" | "MALFORMED_RESPONSE" | "TIMEOUT" | null)
  reason: { type: String, default: null },
  // Error message from a system failure, truncated to 500 chars
  errorMessage: { type: String, default: null },

  // Context
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  requestId: { type: String },
  locale: { type: String },

  createdAt: { type: Date, default: Date.now, index: true },
});

// Admin query: "show me all blocked messages last 7 days"
moderationLogSchema.index({ blocked: 1, createdAt: -1 });
// Ops query: "show me all system failures"
moderationLogSchema.index({ reason: 1, createdAt: -1 }, { sparse: true });
// Cross-type query: "show me all blocked images / blocked text"
moderationLogSchema.index({ inputType: 1, blocked: 1, createdAt: -1 });

module.exports = mongoose.model("ModerationLog", moderationLogSchema);
