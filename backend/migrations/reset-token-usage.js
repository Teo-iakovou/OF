/**
 * One-time migration: reset all active PackageInstance.tokensUsed to 0.
 * Run once after deploying real-token tracking to give all users a clean slate.
 *
 * Usage: node backend/migrations/reset-token-usage.js
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const PackageInstance = require("../models/packageInstance");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("[migration] connected to MongoDB");

    const result = await PackageInstance.updateMany(
      { status: "active" },
      {
        $set: {
          tokensUsed: 0,
          chatUsedThisCycle: 0,
        },
      }
    );

    console.log(`[migration] reset tokensUsed=0 on ${result.modifiedCount} active package instances`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[migration] failed:", err);
    process.exit(1);
  }
})();
