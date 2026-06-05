/* eslint-disable no-console */
/**
 * Backfill packageInstanceId on Conversation documents that are missing it.
 *
 * Strategy: for each unscoped Conversation, find ApiUsage records for the
 * same conversationId and read off the packageInstanceId stored there.
 * If a unique packageInstanceId is found, stamp it on the Conversation.
 *
 * DRY_RUN mode (default): reports what would change, writes nothing.
 * Set CONFIRM=yes to apply changes.
 *
 * Usage:
 *   node backend/scripts/backfill-conversation-packages.js          # dry-run
 *   CONFIRM=yes node backend/scripts/backfill-conversation-packages.js
 */
"use strict";

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const Conversation = require("../models/conversation");
const ApiUsage = require("../models/apiUsage");

const DRY_RUN = process.env.CONFIRM !== "yes";
const BATCH_SIZE = 100;

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error("ERROR: MONGODB_URI / MONGO_URI not set");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log(`[backfill] Connected. DRY_RUN=${DRY_RUN}`);

  const stats = { scanned: 0, matched: 0, ambiguous: 0, unmatched: 0, updated: 0, errors: 0 };

  let skip = 0;
  while (true) {
    const batch = await Conversation.find(
      { packageInstanceId: null },
      { _id: 1, user: 1 }
    )
      .sort({ _id: 1 })
      .skip(skip)
      .limit(BATCH_SIZE)
      .lean();

    if (batch.length === 0) break;
    skip += batch.length;
    stats.scanned += batch.length;

    for (const conv of batch) {
      try {
        // Find all ApiUsage records for this conversation
        const usages = await ApiUsage.find(
          { conversationId: conv._id, packageInstanceId: { $ne: null } },
          { packageInstanceId: 1 }
        ).lean();

        if (usages.length === 0) {
          stats.unmatched += 1;
          continue;
        }

        // Check if all records agree on the same packageInstanceId
        const ids = [...new Set(usages.map((u) => u.packageInstanceId.toString()))];
        if (ids.length > 1) {
          console.warn(`[backfill] AMBIGUOUS conversationId=${conv._id} ids=${ids.join(",")}`);
          stats.ambiguous += 1;
          continue;
        }

        const packageInstanceId = new mongoose.Types.ObjectId(ids[0]);
        stats.matched += 1;

        if (DRY_RUN) {
          console.log(`[backfill][DRY] Would stamp conv=${conv._id} -> pkg=${packageInstanceId}`);
        } else {
          await Conversation.updateOne(
            { _id: conv._id, packageInstanceId: null },
            { $set: { packageInstanceId } }
          );
          stats.updated += 1;
        }
      } catch (err) {
        console.error(`[backfill] ERROR conv=${conv._id}:`, err.message);
        stats.errors += 1;
      }
    }
  }

  console.log("[backfill] Done.", stats);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("[backfill] Fatal:", err);
  process.exit(1);
});
