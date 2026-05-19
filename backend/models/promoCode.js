/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    planKey: {
      type: String,
      required: true,
      enum: ["lite", "pro", "ultimate"],
    },
    maxUses: { type: Number, default: 1 },     // null = unlimited; 1 = one-time; N = multi
    usedCount: { type: Number, default: 0 },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    expiresAt: { type: Date, default: null },   // null = no expiry
    active: { type: Boolean, default: true },   // kill switch
    note: { type: String, default: "" },        // admin memo
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PromoCode", promoCodeSchema);
