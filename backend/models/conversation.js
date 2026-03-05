const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "Untitled conversation" },
  messages: [messageSchema],
  tokensUsed: { type: Number, default: 0 },
  tokensLimit: { type: Number, default: 128000 },
  nearLimit: { type: Boolean, default: false },
  continuedFromConversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", default: null },
  continuedToConversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Conversation", conversationSchema);
