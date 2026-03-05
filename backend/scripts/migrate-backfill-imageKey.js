const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Result = require("../models/result");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const dryRun = process.argv.includes("--dry-run");

const toIdString = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value.toString === "function") return value.toString().trim();
  return "";
};

const extractImageExt = (result) => {
  if (!result || typeof result !== "object") return "";
  if (typeof result.imageExt === "string" && result.imageExt.trim()) {
    return result.imageExt.trim().replace(/^\./, "").toLowerCase();
  }
  if (result.meta && typeof result.meta === "object") {
    if (typeof result.meta.imageExt === "string" && result.meta.imageExt.trim()) {
      return result.meta.imageExt.trim().replace(/^\./, "").toLowerCase();
    }
    if (typeof result.meta.uploadExt === "string" && result.meta.uploadExt.trim()) {
      return result.meta.uploadExt.trim().replace(/^\./, "").toLowerCase();
    }
  }
  return "";
};

const deriveImageKey = (result, ext = "jpg") => {
  const userId = toIdString(result.userId);
  const packageInstanceId = toIdString(result.packageInstanceId);
  const imageHash = typeof result.imageHash === "string" ? result.imageHash.trim() : "";
  if (!userId || !packageInstanceId || !imageHash) return "";
  const safeExt = (ext || "jpg").replace(/^\./, "").toLowerCase() || "jpg";
  return `uploads/${userId}/${packageInstanceId}/${imageHash}.${safeExt}`;
};

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is required");

  await mongoose.connect(uri);
  try {
    const query = {
      $and: [
        {
          $or: [
            { "meta.imageKey": { $exists: false } },
            { "meta.imageKey": null },
            { "meta.imageKey": "" },
          ],
        },
        { userId: { $exists: true, $ne: null } },
        { packageInstanceId: { $exists: true, $ne: null } },
        { imageHash: { $exists: true, $type: "string", $ne: "" } },
      ],
    };

    const docs = await Result.find(query)
      .select({ _id: 1, userId: 1, packageInstanceId: 1, imageHash: 1, imageExt: 1, meta: 1 })
      .lean();

    const ops = docs
      .map((doc) => {
        const ext = extractImageExt(doc) || "jpg";
        const imageKey = deriveImageKey(doc, ext);
        if (!imageKey) return null;
        return {
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { "meta.imageKey": imageKey } },
          },
        };
      })
      .filter(Boolean);

    let modifiedCount = 0;
    if (!dryRun && ops.length) {
      const out = await Result.bulkWrite(ops, { ordered: false });
      modifiedCount = out.modifiedCount || 0;
    }

    console.log(
      JSON.stringify(
        {
          dryRun,
          matchedCount: docs.length,
          modifiedCount,
          sampleIds: docs.slice(0, 10).map((d) => String(d._id)),
        },
        null,
        2
      )
    );
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((err) => {
  console.error("[migrate-backfill-imageKey] failed:", err?.message || err);
  process.exitCode = 1;
});
