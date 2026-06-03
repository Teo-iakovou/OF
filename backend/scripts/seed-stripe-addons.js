#!/usr/bin/env node
// Idempotent Stripe addon price seeder.
// Uses lookup_key to avoid creating duplicate prices.
// Works in both test and live mode based on STRIPE_SECRET_KEY prefix.
//
// Usage:
//   STRIPE_SECRET_KEY=sk_test_... node scripts/seed-stripe-addons.js
//   STRIPE_SECRET_KEY=sk_live_... node scripts/seed-stripe-addons.js
//
// After running, copy the printed env vars into your .env / hosting config.

/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Pack definitions: [envKey, lookupKey, unitAmountCents, nickname]
const PACKS = [
  // Videos
  ["STRIPE_PRICE_VIDEOS_PACK_3",    "videos_pack_3",    899,  "3 Video Credits"],
  ["STRIPE_PRICE_VIDEOS_PACK_10",   "videos_pack_10",   2499, "10 Video Credits"],
  ["STRIPE_PRICE_VIDEOS_PACK_25",   "videos_pack_25",   5499, "25 Video Credits (Best Value)"],
  // Uploads
  ["STRIPE_PRICE_UPLOADS_PACK_25",  "uploads_pack_25",  999,  "25 Upload Credits"],
  ["STRIPE_PRICE_UPLOADS_PACK_75",  "uploads_pack_75",  2499, "75 Upload Credits"],
  ["STRIPE_PRICE_UPLOADS_PACK_200", "uploads_pack_200", 5499, "200 Upload Credits (Best Value)"],
  // Chat tokens
  ["STRIPE_PRICE_CHAT_PACK_1M",     "chat_pack_1m",     499,  "1M Chat Tokens"],
  ["STRIPE_PRICE_CHAT_PACK_5M",     "chat_pack_5m",     1999, "5M Chat Tokens"],
  ["STRIPE_PRICE_CHAT_PACK_15M",    "chat_pack_15m",    4999, "15M Chat Tokens (Best Value)"],
];

async function findOrCreatePrice(envKey, lookupKey, unitAmount, nickname) {
  // Check if a price with this lookup_key already exists
  try {
    const existing = await stripe.prices.retrieve(lookupKey, { expand: [] });
    if (existing?.id) {
      console.log(`[skip]   ${envKey}=${existing.id}  (lookup_key already exists)`);
      return { envKey, priceId: existing.id, created: false };
    }
  } catch {
    // Not found — fall through to create
  }

  // Create a product + price
  const product = await stripe.products.create({ name: nickname });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: unitAmount,
    currency: "usd",
    lookup_key: lookupKey,
    nickname,
    metadata: { lookupKey },
  });

  console.log(`[created] ${envKey}=${price.id}  (${nickname}, $${(unitAmount / 100).toFixed(2)})`);
  return { envKey, priceId: price.id, created: true };
}

async function main() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  const mode = key.startsWith("sk_live") ? "LIVE" : "TEST";
  console.log(`\nStripe addon seeder — ${mode} mode\n`);

  const results = [];
  for (const [envKey, lookupKey, unitAmount, nickname] of PACKS) {
    const result = await findOrCreatePrice(envKey, lookupKey, unitAmount, nickname);
    results.push(result);
  }

  console.log("\n── Copy these into your .env ──────────────────────────────────────");
  for (const { envKey, priceId } of results) {
    console.log(`${envKey}=${priceId}`);
  }
  console.log("────────────────────────────────────────────────────────────────────\n");
}

main().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
