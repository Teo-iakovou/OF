const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Result = require("../models/result");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is required");
  }

  const r2Pattern = /r2\.cloudflarestorage\.com|\/aiplatform\/uploads\//i;
  const query = {
    $or: [
      { "meta.imageUrl": { $type: "string", $regex: r2Pattern } },
      { "meta.thumbnailUrl": { $type: "string", $regex: r2Pattern } },
    ],
  };

  await mongoose.connect(uri);
  try {
    const matched = await Result.countDocuments(query);
    const sample = await Result.find(query).select({ _id: 1 }).sort({ createdAt: -1 }).limit(10).lean();
    const update = await Result.updateMany(query, {
      $unset: {
        "meta.imageUrl": "",
        "meta.thumbnailUrl": "",
      },
    });

    console.log(
      JSON.stringify(
        {
          matchedCount: matched,
          modifiedCount: update.modifiedCount || 0,
          sampleIds: sample.map((doc) => String(doc._id)),
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
  console.error("[migrate-remove-raw-r2-urls] failed:", err?.message || err);
  process.exitCode = 1;
});
