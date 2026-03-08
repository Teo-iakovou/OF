const mongoose = require("mongoose");
const PackageInstance = require("../models/packageInstance");
const {
  cleanupFacesForExternalImageId,
  cleanupFacesForExternalImageIds,
} = require("../utils/rekognition");

function getArg(name) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is required");
    process.exit(1);
  }

  const packageInstanceId = getArg("packageInstanceId");
  if (!packageInstanceId || !mongoose.Types.ObjectId.isValid(packageInstanceId)) {
    console.error("Usage: node backend/scripts/cleanup-rekognition-stale-faces.js --packageInstanceId=<id>");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const instance = await PackageInstance.findById(packageInstanceId).lean();
  if (!instance) {
    console.error("Package instance not found");
    process.exit(1);
  }

  const lineageFilter = {
    userId: instance.userId,
    _id: { $ne: instance._id },
    ...(instance.personaKey
      ? { personaKey: instance.personaKey }
      : {
          $or: [{ personaKey: null }, { personaKey: { $exists: false } }],
          planKey: instance.planKey,
        }),
  };

  const lineage = await PackageInstance.find(lineageFilter).select({ _id: 1 }).lean();
  const staleExternalImageIds = lineage.map((row) => row._id.toString());

  const keepFaceId = instance.rekognitionFaceId || null;
  const currentExternalImageId = instance._id.toString();
  const currentCleanup = await cleanupFacesForExternalImageId(currentExternalImageId, keepFaceId, {
    requestId: "manual-script",
  });
  const lineageCleanup = await cleanupFacesForExternalImageIds(staleExternalImageIds, {
    requestId: "manual-script",
  });

  console.log("[cleanup-rekognition-stale-faces] done", {
    packageInstanceId: currentExternalImageId,
    keepFaceId,
    staleExternalImageIdsCount: staleExternalImageIds.length,
    currentCleanup,
    lineageCleanup,
  });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[cleanup-rekognition-stale-faces] failed", err?.message || err);
  process.exit(1);
});
