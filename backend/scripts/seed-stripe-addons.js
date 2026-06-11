#!/usr/bin/env node
// Idempotent Stripe addon price seeder.
// Reads all pack definitions from backend/config/addons.js (canonical source).
// Requires --confirm flag when running against a live Stripe account.
//
// Usage:
//   STRIPE_SECRET_KEY=sk_test_... node scripts/seed-stripe-addons.js
//   STRIPE_SECRET_KEY=sk_live_... node scripts/seed-stripe-addons.js --confirm

/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const path = require("path");
const Stripe = require("stripe");
const { getAllPacks } = require("../config/addons");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function findExistingPrice(lookupKey) {
  const result = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  return result.data[0] || null;
}

async function findExistingProduct(lookupKey) {
  try {
    const result = await stripe.products.search({
      query: `metadata['lookupKey']:'${lookupKey}' AND active:'true'`,
      limit: 1,
    });
    return result.data[0] || null;
  } catch {
    const all = await stripe.products.list({ active: true, limit: 100 });
    return all.data.find((p) => p.metadata?.lookupKey === lookupKey) || null;
  }
}

async function seedPack(pack) {
  const { lookupKey, amountCents, currency, nickname, addonType, stripePriceEnv } = pack;

  const existingPrice = await findExistingPrice(lookupKey);
  if (existingPrice) {
    console.log(`[skip]    ${stripePriceEnv}=${existingPrice.id}  (${nickname})`);
    return { envKey: stripePriceEnv, priceId: existingPrice.id, priceCreated: false, productCreated: false };
  }

  let product = await findExistingProduct(lookupKey);
  let productCreated = false;
  if (product) {
    console.log(`[reuse]   product ${product.id}  (${nickname})`);
  } else {
    product = await stripe.products.create({ name: nickname, metadata: { addonType, lookupKey } });
    productCreated = true;
    console.log(`[created] product ${product.id}  (${nickname})`);
  }

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: amountCents,
    currency,
    lookup_key: lookupKey,
    nickname,
    metadata: { addonType, lookupKey },
  });
  console.log(`[created] price   ${stripePriceEnv}=${price.id}  (${nickname}, €${(amountCents / 100).toFixed(2)})`);
  return { envKey: stripePriceEnv, priceId: price.id, priceCreated: true, productCreated };
}

async function main() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  const isLive = key.startsWith("sk_live");
  const mode = isLive ? "LIVE" : "TEST";
  const hasConfirmFlag = process.argv.includes("--confirm");

  if (isLive && !hasConfirmFlag) {
    console.error("\n🚨  LIVE MODE DETECTED  🚨\n");
    console.error("You are about to seed REAL products in your live Stripe account.");
    console.error("This will create products visible to real customers.\n");
    console.error("To proceed, re-run with the --confirm flag:");
    console.error(`  STRIPE_SECRET_KEY=sk_live_... node ${path.relative(process.cwd(), __filename)} --confirm\n`);
    process.exit(1);
  }

  if (!key || (!key.startsWith("sk_test") && !key.startsWith("sk_live"))) {
    console.error("Error: STRIPE_SECRET_KEY is missing or invalid.");
    process.exit(1);
  }

  console.log(`\nStripe addon seeder — ${mode} mode\n`);

  const packs = getAllPacks().filter((p) => p.lookupKey);
  const results = [];
  for (const pack of packs) {
    results.push(await seedPack(pack));
  }

  const pricesCreated = results.filter((r) => r.priceCreated).length;
  const productsCreated = results.filter((r) => r.productCreated).length;
  const reused = results.filter((r) => !r.priceCreated).length;

  console.log(`\nSummary:`);
  console.log(`  Created:  ${productsCreated} product${productsCreated !== 1 ? "s" : ""}, ${pricesCreated} price${pricesCreated !== 1 ? "s" : ""}`);
  console.log(`  Reused:   ${reused} price${reused !== 1 ? "s" : ""}`);

  if (pricesCreated > 0) {
    console.log(`\nEnv vars to set:`);
    for (const { envKey, priceId, priceCreated } of results) {
      if (priceCreated) console.log(`  ${envKey}=${priceId}`);
    }
    console.log(`\nCopy the env vars above into your .env / Railway environment.\n`);
  } else {
    console.log("\n✓ All prices already exist — nothing created. Your .env is already correct.\n");
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
