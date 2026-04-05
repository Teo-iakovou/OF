/* eslint-disable no-console */
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");

const TOKENS_PER_LEGACY_CHAT_UNIT = 500;

function toTokenValue(value, fallback = 0) {
  const raw = Number(value);
  if (!Number.isFinite(raw) || raw < 0) return fallback;
  return raw > 5000 ? raw : raw * TOKENS_PER_LEGACY_CHAT_UNIT;
}

async function migrateCollection(Model, name) {
  const cursor = Model.find(
    {},
    { _id: 1, chatMonthlyLimit: 1, chatUsedThisCycle: 1, aiChatLimit: 1, aiChatUsed: 1 }
  ).cursor();
  let scanned = 0;
  let updated = 0;

  for await (const doc of cursor) {
    scanned += 1;
    const legacyLimit = Number(
      doc.chatMonthlyLimit ?? (typeof doc.get === "function" ? doc.get("aiChatLimit") : undefined) ?? 0
    );
    const legacyUsed = Number(
      doc.chatUsedThisCycle ?? (typeof doc.get === "function" ? doc.get("aiChatUsed") : undefined) ?? 0
    );

    const tokensLimit = legacyLimit === 0 ? 0 : toTokenValue(legacyLimit, 0);
    const tokensUsed = toTokenValue(legacyUsed, 0);

    const result = await Model.updateOne(
      { _id: doc._id },
      {
        $set: {
          tokensLimit,
          tokensUsed,
          // Keep legacy fields synchronized for backward safety.
          chatMonthlyLimit: tokensLimit,
          chatUsedThisCycle: tokensUsed,
        },
      }
    );
    if (result.modifiedCount > 0) updated += 1;
  }

  console.log(`[migration:${name}]`, { scanned, updated });
}

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(uri);
  console.log("[migration] connected", {
    db: mongoose.connection.name,
    host: mongoose.connection.host,
  });

  await migrateCollection(User, "users");
  await migrateCollection(PackageInstance, "package_instances");

  console.log("[migration] done");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[migration] failed", err);
  process.exit(1);
});
