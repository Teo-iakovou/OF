// backend/scripts/fixTokenLimits.js
// One-time migration: fix PackageInstance tokensLimit/chatMonthlyLimit for existing records.
// Run with: node backend/scripts/fixTokenLimits.js

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const PackageInstance = require("../models/packageInstance");

const CORRECT_LIMITS = {
  lite: 10000,
  pro: 100000,
  ultimate: 500000,
};

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGODB_URI or MONGO_URI not set in environment.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const instances = await PackageInstance.find({ status: "active" }).lean();
  console.log(`Found ${instances.length} active PackageInstance records.`);

  let fixed = 0;

  for (const doc of instances) {
    const correctLimit = CORRECT_LIMITS[doc.planKey];
    if (correctLimit === undefined) {
      console.warn(`Unknown planKey "${doc.planKey}" for instance ${doc._id} — skipping.`);
      continue;
    }

    const limitIsWrong =
      doc.tokensLimit !== correctLimit || doc.chatMonthlyLimit !== correctLimit;

    if (!limitIsWrong) continue;

    await PackageInstance.updateOne(
      { _id: doc._id },
      {
        $set: {
          tokensLimit: correctLimit,
          chatMonthlyLimit: correctLimit,
          tokensUsed: 0,
          chatUsedThisCycle: 0,
        },
      }
    );

    console.log(
      `Fixed ${doc._id} (plan=${doc.planKey}): ` +
      `tokensLimit ${doc.tokensLimit} → ${correctLimit}, ` +
      `chatMonthlyLimit ${doc.chatMonthlyLimit} → ${correctLimit}, ` +
      `usage reset to 0`
    );
    fixed++;
  }

  console.log(`\nDone. Fixed ${fixed} of ${instances.length} records.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
