// Manual expectations:
// - base 5 + addons 2 allows 7 uploads total, blocks at 7
// - base 5 + addons 2 blocks at 7 (uploadsUsed >= 7)
// - unlimited (0) always allows (still increments uploadsUsed)
const mongoose = require("mongoose");
const PackageInstance = require("../models/packageInstance");

async function reserve(instanceId, userId) {
  return PackageInstance.findOneAndUpdate(
    {
      _id: instanceId,
      userId,
      $expr: {
        $or: [
          { $eq: ["$uploadLimit", 0] },
          { $lt: ["$uploadsUsed", "$uploadLimit"] },
        ],
      },
    },
    { $inc: { uploadsUsed: 1 } },
    { new: true }
  );
}

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is required");
    process.exit(1);
  }
  await mongoose.connect(uri);
  const userId = new mongoose.Types.ObjectId();

  const unlimited = await PackageInstance.create({
    userId,
    planKey: "test",
    status: "active",
    uploadLimit: 0,
    uploadsUsed: 5,
  });
  const limited = await PackageInstance.create({
    userId,
    planKey: "test",
    status: "active",
    uploadLimit: 3,
    uploadsUsed: 3,
  });

  const resUnlimited = await reserve(unlimited._id, userId);
  const resLimited = await reserve(limited._id, userId);

  const passUnlimited = resUnlimited && resUnlimited.uploadsUsed === 6;
  const passLimited = resLimited === null;

  console.log("[reserve-check] unlimited", {
    ok: passUnlimited,
    uploadsUsed: resUnlimited ? resUnlimited.uploadsUsed : null,
  });
  console.log("[reserve-check] limited", { ok: passLimited });

  await PackageInstance.deleteMany({ _id: { $in: [unlimited._id, limited._id] } });
  await mongoose.disconnect();
  if (!passUnlimited || !passLimited) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[reserve-check] failed", err?.message || err);
  process.exit(1);
});
