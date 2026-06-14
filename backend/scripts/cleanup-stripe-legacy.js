#!/usr/bin/env node
// Archives legacy USD add-on prices (and their parent products when safe) so
// the seed script can recreate them fresh in EUR with correct metadata.
//
// Usage:
//   STRIPE_SECRET_KEY=sk_test_... node scripts/cleanup-stripe-legacy.js [--dry-run]
//   STRIPE_SECRET_KEY=rk_test_... node scripts/cleanup-stripe-legacy.js [--dry-run]  (restricted key)
//   STRIPE_SECRET_KEY=sk_live_... node scripts/cleanup-stripe-legacy.js --confirm
//   STRIPE_SECRET_KEY=rk_live_... node scripts/cleanup-stripe-legacy.js --confirm     (restricted key)

/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const Stripe = require("stripe");
const { ADDON_PACKS } = require("../config/addons");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function flattenPacks() {
  const packs = [];
  for (const [, entries] of Object.entries(ADDON_PACKS)) {
    for (const [, pack] of Object.entries(entries)) {
      if (pack.lookupKey) packs.push(pack);
    }
  }
  return packs;
}

async function archivePack(pack, isDryRun, stats) {
  const { lookupKey, nickname } = pack;

  const prices = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 10,
  });

  if (prices.data.length === 0) {
    console.log(`[skip]    no active prices for lookup_key=${lookupKey}`);
    return;
  }

  for (const price of prices.data) {
    const productId = typeof price.product === "string" ? price.product : price.product?.id;

    if (isDryRun) {
      console.log(`[dry-run] would archive price ${price.id} (lookup_key=${lookupKey}, currency=${price.currency})`);
      if (productId) {
        console.log(`[dry-run] would check product ${productId} for remaining active prices`);
      }
      stats.pricesWouldArchive++;
      continue;
    }

    // Archive price and clear lookup_key to free it for the EUR price
    await stripe.prices.update(price.id, { active: false });
    await stripe.prices.update(price.id, { lookup_key: "" });
    console.log(`[archived] ${price.id} (lookup_key=${lookupKey}, currency=${price.currency})`);
    stats.pricesArchived++;
    stats.lookupKeysFreed++;

    // Archive parent product only when it has no remaining active prices
    if (productId) {
      const remainingPrices = await stripe.prices.list({
        product: productId,
        active: true,
        limit: 10,
      });

      if (remainingPrices.data.length === 0) {
        await stripe.products.update(productId, { active: false });
        console.log(`[archived] ${productId} (${nickname})`);
        stats.productsArchived++;
      } else {
        console.log(`[partial]  product ${productId} still has ${remainingPrices.data.length} active price(s) — not archiving`);
      }
    }
  }
}

async function main() {
  const key = process.env.STRIPE_SECRET_KEY || "";
  const isLive = key.startsWith("sk_live") || key.startsWith("rk_live");
  const mode = isLive ? "LIVE" : "TEST";
  const hasConfirmFlag = process.argv.includes("--confirm");
  const isDryRun = process.argv.includes("--dry-run");

  if (isLive && !hasConfirmFlag) {
    console.error("\n🚨 LIVE MODE DETECTED 🚨\n");
    console.error("You are about to ARCHIVE products in your live Stripe account.");
    console.error("This will hide them from customers and break any active subscriptions using them.\n");
    console.error("To proceed, re-run with the --confirm flag:");
    console.error(`  STRIPE_SECRET_KEY=sk_live_... node ${path.relative(process.cwd(), __filename)} --confirm`);
    console.error(`  STRIPE_SECRET_KEY=rk_live_... node ${path.relative(process.cwd(), __filename)} --confirm  (restricted key)\n`);
    process.exit(1);
  }

  const validPrefixes = ["sk_test", "sk_live", "rk_test", "rk_live"];
  if (!key || !validPrefixes.some((prefix) => key.startsWith(prefix))) {
    console.error("Error: STRIPE_SECRET_KEY is missing or invalid.");
    console.error("Expected one of: sk_test_*, sk_live_*, rk_test_*, rk_live_*");
    process.exit(1);
  }

  console.log(`\nStripe legacy cleanup — ${mode} mode${isDryRun ? " (DRY RUN)" : ""}\n`);

  const packs = flattenPacks();
  const stats = {
    pricesArchived: 0,
    productsArchived: 0,
    lookupKeysFreed: 0,
    pricesWouldArchive: 0,
    errors: [],
  };

  for (const pack of packs) {
    try {
      await archivePack(pack, isDryRun, stats);
    } catch (err) {
      const msg = `Failed to process lookup_key=${pack.lookupKey}: ${err.message}`;
      console.error(`[error]   ${msg}`);
      stats.errors.push(msg);
    }
  }

  console.log(`\nCleanup summary:`);
  if (isDryRun) {
    console.log(`  Prices that would be archived: ${stats.pricesWouldArchive}`);
  } else {
    console.log(`  Prices archived:   ${stats.pricesArchived}`);
    console.log(`  Products archived: ${stats.productsArchived}`);
    console.log(`  Lookup keys freed: ${stats.lookupKeysFreed}`);
  }

  if (stats.errors.length > 0) {
    console.log(`\n  Errors (${stats.errors.length}):`);
    for (const e of stats.errors) console.log(`    - ${e}`);
  }

  if (!isDryRun && stats.pricesArchived > 0) {
    console.log(`\nNext step: Run 'node scripts/seed-stripe-addons.js' to create fresh EUR prices.\n`);
  } else if (!isDryRun) {
    console.log(`\n✓ Nothing archived — run the seed script if EUR prices are still missing.\n`);
  }
}

main().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
