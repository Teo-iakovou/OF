const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../utils/db");
const Result = require("../models/result");
const User = require("../models/user");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

async function run() {
  await connectDB();
  try {
    const missingFilter = { $or: [{ userId: { $exists: false } }, { userId: null }] };
    const emails = await Result.distinct("email", missingFilter);
    if (!emails.length) {
      console.log("[backfill] No results missing userId.");
      return;
    }

    const ops = [];
    for (const rawEmail of emails) {
      const email = String(rawEmail || "").trim().toLowerCase();
      if (!email) continue;
      const user = await User.findOne({ email });
      if (!user) {
        console.warn("[backfill] No user for email:", email);
        continue;
      }
      ops.push({
        updateMany: {
          filter: { email, ...missingFilter },
          update: { $set: { userId: user._id } },
        },
      });
    }

    if (!ops.length) {
      console.log("[backfill] No updates to apply.");
      return;
    }

    const result = await Result.bulkWrite(ops, { ordered: false });
    console.log("[backfill] Updates applied:", result.modifiedCount || 0);
  } catch (err) {
    console.error("[backfill] Failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
