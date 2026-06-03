// backend/services/stripeAddonService.js
// Fetches addon prices from Stripe and returns a structured response.
// Results are cached in-memory for 5 minutes to avoid hitting Stripe on every request.

const Stripe = require("stripe");
const { getAllPacks } = require("../config/addons");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// In-memory cache (per process)
let priceCache = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function formatCents(amount, currency) {
  if (amount == null || !currency) return null;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  } catch {
    return `${currency.toUpperCase()} ${(amount / 100).toFixed(2)}`;
  }
}

async function fetchPackEntry(pack) {
  const stripePriceId = process.env[pack.stripePriceEnv];
  if (!stripePriceId) {
    console.warn("[stripeAddonService] missing env var:", pack.stripePriceEnv);
    return {
      type:           pack.type,
      packKey:        pack.packKey,
      qty:            pack.qty,
      bestValue:      pack.bestValue,
      priceId:        null,
      unitAmount:     null,
      currency:       null,
      formattedPrice: null,
    };
  }
  try {
    const price = await stripe.prices.retrieve(stripePriceId);
    return {
      type:           pack.type,
      packKey:        pack.packKey,
      qty:            pack.qty,
      bestValue:      pack.bestValue,
      priceId:        stripePriceId,
      unitAmount:     price.unit_amount,
      currency:       price.currency,
      formattedPrice: formatCents(price.unit_amount, price.currency),
    };
  } catch (err) {
    console.error("[stripeAddonService] failed to fetch price", {
      type:     pack.type,
      packKey:  pack.packKey,
      envKey:   pack.stripePriceEnv,
      priceId:  stripePriceId,
      error:    err?.message,
    });
    return {
      type:           pack.type,
      packKey:        pack.packKey,
      qty:            pack.qty,
      bestValue:      pack.bestValue,
      priceId:        null,
      unitAmount:     null,
      currency:       null,
      formattedPrice: null,
    };
  }
}

async function fetchAllAddonPricesFromStripe() {
  const packs = getAllPacks();
  const entries = await Promise.all(packs.map(fetchPackEntry));

  // Group by type: { uploads: [...], chat: [...], videos: [...] }
  const grouped = {};
  for (const entry of entries) {
    if (!grouped[entry.type]) grouped[entry.type] = [];
    grouped[entry.type].push(entry);
  }
  return grouped;
}

async function getAllAddonPrices() {
  if (priceCache && Date.now() < cacheExpiry) {
    return priceCache;
  }

  const fresh = await fetchAllAddonPricesFromStripe();
  priceCache = fresh;
  cacheExpiry = Date.now() + CACHE_TTL_MS;
  return fresh;
}

module.exports = { getAllAddonPrices };
