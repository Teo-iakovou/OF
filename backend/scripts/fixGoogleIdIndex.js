/**
 * One-time migration: replace the plain unique googleId_1 index with a partial
 * index that only enforces uniqueness when googleId is an actual string.
 *
 * Problem: the old index treated null === null as a duplicate, blocking all
 * password-auth signups after the first one.
 *
 * Usage (from repo root):
 *   cd backend && node scripts/fixGoogleIdIndex.js
 *
 * TODO: run this same script against production MongoDB after deploying the
 * schema change to models/user.js.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

async function fixIndex() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is required");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB:", mongoose.connection.name, "@", mongoose.connection.host);

  const collection = mongoose.connection.collection("users");

  const before = await collection.indexes();
  console.log("Current indexes:", before.map((i) => i.name));

  try {
    await collection.dropIndex("googleId_1");
    console.log("Dropped old googleId_1 index");
  } catch (err) {
    if (err.codeName === "IndexNotFound") {
      console.log("Old index already gone — skipping drop");
    } else {
      throw err;
    }
  }

  // Load the model so Mongoose can create the new partial index
  const User = require("../models/user");
  await User.syncIndexes();
  console.log("Synced indexes");

  const after = await collection.indexes();
  console.log("New indexes:", after.map((i) => i.name));

  await mongoose.disconnect();
}

fixIndex().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
