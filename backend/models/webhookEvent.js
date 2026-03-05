const mongoose = require("mongoose");

const webhookEventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    kind: { type: String, enum: ["package", "addon"], default: null },
    sessionId: { type: String, default: null },
    processedAt: { type: Date, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    error: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

webhookEventSchema.index({ sessionId: 1, kind: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("WebhookEvent", webhookEventSchema);
