const mongoose = require("mongoose");
const PackageInstance = require("../models/packageInstance");

const APPLY = process.argv.includes("--apply");
const WINDOW_MS = Number(process.env.DEDUPE_WINDOW_MS || 2 * 60 * 1000);

function toKey(doc) {
  return `${doc.userId.toString()}:${doc.planKey}`;
}

function isWithinWindow(a, b) {
  return Math.abs(a.getTime() - b.getTime()) <= WINDOW_MS;
}

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is required");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const instances = await PackageInstance.find({})
    .select("userId planKey createdAt stripeCheckoutSessionId stripePaymentIntentId status")
    .sort({ userId: 1, planKey: 1, createdAt: 1 })
    .lean();

  const groups = new Map();
  for (const instance of instances) {
    const key = toKey(instance);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(instance);
  }

  const toDelete = new Set();
  for (const group of groups.values()) {
    const withStripe = group.filter((doc) => doc.stripeCheckoutSessionId);
    if (!withStripe.length) continue;
    const withoutStripe = group.filter((doc) => !doc.stripeCheckoutSessionId);
    if (!withoutStripe.length) continue;

    for (const keeper of withStripe) {
      for (const candidate of withoutStripe) {
        if (isWithinWindow(keeper.createdAt, candidate.createdAt)) {
          toDelete.add(candidate._id.toString());
        }
      }
    }
  }

  const ids = Array.from(toDelete);
  if (!ids.length) {
    console.log("[cleanup] no duplicates found");
    await mongoose.disconnect();
    return;
  }

  console.log("[cleanup] candidates", {
    count: ids.length,
    windowMs: WINDOW_MS,
    apply: APPLY,
  });

  for (const id of ids) {
    console.log("[cleanup] candidate", { id });
  }

  if (APPLY) {
    const res = await PackageInstance.deleteMany({
      _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
      stripeCheckoutSessionId: null,
    });
    console.log("[cleanup] deleted", { deletedCount: res.deletedCount });
  } else {
    console.log("[cleanup] dry-run only; re-run with --apply to delete");
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[cleanup] failed", err?.message || err);
  process.exit(1);
});
