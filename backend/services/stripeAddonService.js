// backend/services/stripeAddonService.js
// Fetches addon prices from Stripe and returns a structured response.
// Results are cached in-memory for 5 minutes to avoid hitting Stripe on every request.

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ADDON_DEFINITIONS = {
  uploads: [
    { id: "upload_5",  envKey: "STRIPE_PRICE_UPLOADS_5",  credits: 5,      label: "+5 uploads" },
    { id: "upload_20", envKey: "STRIPE_PRICE_UPLOADS_20", credits: 20,     label: "+20 uploads" },
  ],
  ai: [
    { id: "ai_100k",   envKey: "STRIPE_PRICE_CHAT_100K",  credits: 100000, label: "+100k tokens" },
  ],
  videos: [
    { id: "video_5",   envKey: "STRIPE_PRICE_VIDEOS_5",   credits: 5,      label: "+5 videos" },
    { id: "video_15",  envKey: "STRIPE_PRICE_VIDEOS_15",  credits: 15,     label: "+15 videos" },
    { id: "video_30",  envKey: "STRIPE_PRICE_VIDEOS_30",  credits: 30,     label: "+30 videos" },
  ],
};

// In-memory cache (per process)
let priceCache = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchPriceEntry(def) {
  const stripePriceId = process.env[def.envKey];
  if (!stripePriceId) {
    console.warn("[stripeAddonService] missing env var:", def.envKey);
    return null;
  }
  try {
    const price = await stripe.prices.retrieve(stripePriceId);
    return {
      id: def.id,
      label: def.label,
      credits: def.credits,
      priceCents: price.unit_amount,
      currency: price.currency,
      stripePriceId,
    };
  } catch (err) {
    console.error("[stripeAddonService] failed to fetch price", {
      id: def.id,
      envKey: def.envKey,
      stripePriceId,
      error: err?.message,
    });
    return null;
  }
}

async function fetchAllAddonPricesFromStripe() {
  const results = {};

  for (const [group, defs] of Object.entries(ADDON_DEFINITIONS)) {
    const entries = await Promise.all(defs.map(fetchPriceEntry));
    results[group] = entries.filter(Boolean);
  }

  return results;
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
