/**
 * One-time bootstrap: grant admin privileges to a user by email.
 * Usage: node backend/scripts/grantAdmin.js <email>
 * Example: node backend/scripts/grantAdmin.js thedoros09@gmail.com
 *
 * - Refuses to run in production
 * - Requires direct DB access (no HTTP endpoint)
 */

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const User = require("../models/user");

async function run() {
  if (process.env.NODE_ENV === "production") {
    console.error("This script is for development/testing only. Do not run in production.");
    process.exit(1);
  }

  const email = process.argv[2];
  if (!email || !email.includes("@")) {
    console.error("Usage: node backend/scripts/grantAdmin.js <email>");
    process.exit(1);
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is required");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB:", mongoose.connection.name, "@", mongoose.connection.host);

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { $set: { isAdmin: true } },
    { new: true }
  ).select("+isAdmin");

  if (!user) {
    console.error(`No user found with email: ${normalizedEmail}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`✓ Granted admin to: ${user.email} (id: ${user._id})`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Failed:", err.message || err);
  process.exit(1);
});
