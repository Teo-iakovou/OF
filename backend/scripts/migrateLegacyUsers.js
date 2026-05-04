/**
 * One-time migration: set passwords for legacy email-only users.
 * Usage: node backend/scripts/migrateLegacyUsers.js <password>
 * Example: node backend/scripts/migrateLegacyUsers.js TestPass123
 *
 * - Skips Google OAuth users (they don't need passwords)
 * - Refuses to run in production
 * - Requires confirmation before executing
 */

const dotenv = require("dotenv");
const readline = require("readline");
const mongoose = require("mongoose");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const { hashPassword } = require("../utils/password");
const User = require("../models/user");

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function run() {
  if (process.env.NODE_ENV === "production") {
    console.error("This script is for development/testing only. Do not run in production.");
    process.exit(1);
  }

  const defaultPassword = process.argv[2];
  if (!defaultPassword) {
    console.error("Usage: node backend/scripts/migrateLegacyUsers.js <password>");
    process.exit(1);
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is required");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB:", mongoose.connection.name, "@", mongoose.connection.host);

  // Legacy email-only users: no passwordHash AND no googleId
  const legacyUsers = await User.find({
    passwordHash: null,
    $or: [{ googleId: null }, { googleId: { $exists: false } }],
  }).select("_id email googleId").lean();

  const googleOnlyCount = await User.countDocuments({
    $and: [
      { googleId: { $ne: null } },
      { googleId: { $exists: true } },
    ],
  });

  if (legacyUsers.length === 0) {
    console.log("No legacy users to migrate. Skipped", googleOnlyCount, "Google OAuth users.");
    await mongoose.disconnect();
    return;
  }

  console.log(`\nFound ${legacyUsers.length} legacy email-only user(s) to migrate:`);
  legacyUsers.forEach((u) => console.log(" •", u.email));
  console.log(`Skipping ${googleOnlyCount} Google OAuth user(s).`);
  console.log(`\nEach will receive the password: "${defaultPassword}"`);

  const answer = await confirm("\nType 'yes' to proceed: ");
  if (answer !== "yes") {
    console.log("Aborted.");
    await mongoose.disconnect();
    process.exit(0);
  }

  const hash = await hashPassword(defaultPassword);
  let migrated = 0;

  for (const user of legacyUsers) {
    await User.updateOne({ _id: user._id }, { $set: { passwordHash: hash } });
    console.log("Migrated user:", user.email);
    migrated++;
  }

  console.log(`\nDone. Migrated ${migrated} user(s). Skipped ${googleOnlyCount} Google OAuth user(s).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Migration failed:", err.message || err);
  process.exit(1);
});
