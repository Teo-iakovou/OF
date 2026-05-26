const mongoose = require("mongoose");

const moderationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  email: { type: String, lowercase: true, trim: true, index: true },

  // What was flagged
  inputText: { type: String, required: true },
  inputLength: { type: Number },

  // Moderation result
  flagged: { type: Boolean, required: true, index: true },
  blocked: { type: Boolean, required: true, default: false, index: true },

  // Which categories triggered
  categories: { type: mongoose.Schema.Types.Mixed },
  categoryScores: { type: mongoose.Schema.Types.Mixed },

  // Which blocking categories specifically fired
  blockedCategories: [{ type: String }],

  // Context
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  requestId: { type: String },
  locale: { type: String },

  createdAt: { type: Date, default: Date.now, index: true },
});

// Compound index for admin queries: "show me all blocked messages last 7 days"
moderationLogSchema.index({ blocked: 1, createdAt: -1 });

module.exports = mongoose.model("ModerationLog", moderationLogSchema);
