/**
 * Migration: add TTL indexes for automatic document expiry.
 *
 *   apiUsage          → expires after 180 days  (6 months)
 *   recommendationHistory → expires after 365 days (1 year)
 *
 * The existing plain `createdAt_1` B-tree index must be dropped first;
 * MongoDB does not allow two indexes on the same field.
 *
 * USAGE
 *   # Dry-run (counts + oldest timestamps only, no changes):
 *   node backend/migrations/add-ttl-indexes.js
 *
 *   # Actually create the TTL indexes (only after reviewing dry-run):
 *   CONFIRM=yes node backend/migrations/add-ttl-indexes.js
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");

const CONFIRM = process.env.CONFIRM === "yes";

const TTL_API_USAGE_DAYS      = 180;
const TTL_REC_HISTORY_DAYS    = 365;

const toSeconds = (days) => days * 24 * 60 * 60;

async function getStats(collection, cutoffDays) {
  const cutoff = new Date(Date.now() - toSeconds(cutoffDays) * 1000);
  const [total, wouldExpire, oldest] = await Promise.all([
    collection.countDocuments({}),
    collection.countDocuments({ createdAt: { $lt: cutoff } }),
    collection.find({}, { projection: { createdAt: 1 } }).sort({ createdAt: 1 }).limit(1).toArray(),
  ]);
  return {
    total,
    wouldExpire,
    pct: total > 0 ? ((wouldExpire / total) * 100).toFixed(1) : "0.0",
    oldestDate: oldest[0]?.createdAt ?? null,
  };
}

async function existingIndexNames(collection) {
  const indexes = await collection.indexes();
  return indexes.map((i) => i.name);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[ttl-migration] connected to MongoDB");

    const db = mongoose.connection.db;
    const apiUsageColl      = db.collection("apiusages");
    const recHistoryColl    = db.collection("recommendationhistories");

    // ── Dry-run stats ────────────────────────────────────────────────────────
    const [auStats, rhStats] = await Promise.all([
      getStats(apiUsageColl,   TTL_API_USAGE_DAYS),
      getStats(recHistoryColl, TTL_REC_HISTORY_DAYS),
    ]);

    console.log("\n[ttl-migration] DRY-RUN REPORT");
    console.log("─".repeat(60));
    console.log(`apiUsage (TTL ${TTL_API_USAGE_DAYS}d)`);
    console.log(`  total docs   : ${auStats.total}`);
    console.log(`  would expire : ${auStats.wouldExpire} (${auStats.pct}%)`);
    console.log(`  oldest doc   : ${auStats.oldestDate ? auStats.oldestDate.toISOString() : "n/a"}`);
    console.log(`recommendationHistory (TTL ${TTL_REC_HISTORY_DAYS}d)`);
    console.log(`  total docs   : ${rhStats.total}`);
    console.log(`  would expire : ${rhStats.wouldExpire} (${rhStats.pct}%)`);
    console.log(`  oldest doc   : ${rhStats.oldestDate ? rhStats.oldestDate.toISOString() : "n/a"}`);
    console.log("─".repeat(60));

    const highImpact = parseFloat(auStats.pct) > 50 || parseFloat(rhStats.pct) > 50;
    if (highImpact) {
      console.warn("\n[ttl-migration] WARNING: >50% of documents in at least one collection would be deleted.");
      console.warn("[ttl-migration] Review the numbers above before proceeding.");
    }

    if (!CONFIRM) {
      console.log("\n[ttl-migration] Dry-run complete. No indexes were created or dropped.");
      console.log('[ttl-migration] To apply changes: CONFIRM=yes node backend/migrations/add-ttl-indexes.js');
      await mongoose.disconnect();
      process.exit(0);
    }

    // ── Live run ─────────────────────────────────────────────────────────────
    console.log("\n[ttl-migration] CONFIRM=yes — applying TTL indexes...");

    // apiUsage: drop plain createdAt_1, create TTL index
    const auIndexes = await existingIndexNames(apiUsageColl);
    if (auIndexes.includes("createdAt_1")) {
      await apiUsageColl.dropIndex("createdAt_1");
      console.log("[ttl-migration] apiUsage: dropped createdAt_1");
    } else {
      console.log("[ttl-migration] apiUsage: createdAt_1 not found — skipping drop");
    }
    await apiUsageColl.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: toSeconds(TTL_API_USAGE_DAYS), background: true, name: "createdAt_1_ttl" }
    );
    console.log(`[ttl-migration] apiUsage: TTL index created (expireAfterSeconds=${toSeconds(TTL_API_USAGE_DAYS)})`);

    // recommendationHistory: drop plain createdAt_1, create TTL index
    const rhIndexes = await existingIndexNames(recHistoryColl);
    if (rhIndexes.includes("createdAt_1")) {
      await recHistoryColl.dropIndex("createdAt_1");
      console.log("[ttl-migration] recommendationHistory: dropped createdAt_1");
    } else {
      console.log("[ttl-migration] recommendationHistory: createdAt_1 not found — skipping drop");
    }
    await recHistoryColl.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: toSeconds(TTL_REC_HISTORY_DAYS), background: true, name: "createdAt_1_ttl" }
    );
    console.log(`[ttl-migration] recommendationHistory: TTL index created (expireAfterSeconds=${toSeconds(TTL_REC_HISTORY_DAYS)})`);

    console.log("\n[ttl-migration] Done.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[ttl-migration] failed:", err);
    process.exit(1);
  }
})();
