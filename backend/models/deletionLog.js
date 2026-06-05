const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
  step: { type: String, required: true },
  status: { type: String, enum: ["ok", "skipped", "failed"], required: true },
  detail: { type: String, maxlength: 500 },
  duration_ms: { type: Number },
}, { _id: false });

const DeletionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  email: { type: String },
  requestedAt: { type: Date, required: true, default: Date.now },
  completedAt: { type: Date },
  steps: [StepSchema],
  completedCleanup: { type: Boolean, default: false },
  hardDeleted: { type: Boolean, default: false },
}, { collection: "deletionlogs" });

DeletionLogSchema.index({ requestedAt: -1 });
DeletionLogSchema.index({ completedCleanup: 1, requestedAt: -1 });

module.exports = mongoose.model("DeletionLog", DeletionLogSchema);
