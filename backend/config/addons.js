// External API addonType ↔ internal PackageInstance.addons field name.
// DB field "sadtalkerVideos" retained for backward compat — rename to "videos"
// queued as a separate migration PR.
const TYPE_TO_FIELD = {
  uploads: "uploads",
  chat:    "chat",
  videos:  "sadtalkerVideos",
};

const ADDON_PACKS = {
  videos: {
    pack_3:  { qty: 3,          stripePriceEnv: "STRIPE_PRICE_VIDEOS_PACK_3",   bestValue: false },
    pack_10: { qty: 10,         stripePriceEnv: "STRIPE_PRICE_VIDEOS_PACK_10",  bestValue: false },
    pack_25: { qty: 25,         stripePriceEnv: "STRIPE_PRICE_VIDEOS_PACK_25",  bestValue: true  },
  },
  uploads: {
    pack_25:  { qty: 25,        stripePriceEnv: "STRIPE_PRICE_UPLOADS_PACK_25",  bestValue: false },
    pack_75:  { qty: 75,        stripePriceEnv: "STRIPE_PRICE_UPLOADS_PACK_75",  bestValue: false },
    pack_200: { qty: 200,       stripePriceEnv: "STRIPE_PRICE_UPLOADS_PACK_200", bestValue: true  },
  },
  chat: {
    pack_1m:  { qty: 1_000_000,  stripePriceEnv: "STRIPE_PRICE_CHAT_PACK_1M",   bestValue: false },
    pack_5m:  { qty: 5_000_000,  stripePriceEnv: "STRIPE_PRICE_CHAT_PACK_5M",   bestValue: false },
    pack_15m: { qty: 15_000_000, stripePriceEnv: "STRIPE_PRICE_CHAT_PACK_15M",  bestValue: true  },
  },
};

// Set of externally-valid addon types (used for request validation)
const ALLOWED_ADDON_TYPES = new Set(Object.keys(ADDON_PACKS)); // {"videos","uploads","chat"}

/** Return pack config or null. */
function getAddonPack(type, packKey) {
  const pack = ADDON_PACKS[type]?.[packKey];
  if (!pack) return null;
  return { ...pack };
}

/** Translate external addonType to the internal PackageInstance.addons field name. */
function getDbFieldForType(type) {
  return TYPE_TO_FIELD[type] || null;
}

/** Flatten ADDON_PACKS into a list of {type, packKey, qty, bestValue, stripePriceEnv}. */
function getAllPacks() {
  const result = [];
  for (const [type, packs] of Object.entries(ADDON_PACKS)) {
    for (const [packKey, pack] of Object.entries(packs)) {
      result.push({ type, packKey, ...pack });
    }
  }
  return result;
}

function validateAddonPriceEnv() {
  const missing = [];
  for (const pack of getAllPacks()) {
    if (!process.env[pack.stripePriceEnv]) missing.push(pack.stripePriceEnv);
  }
  if (missing.length === 0) return;
  const message = `[addons] missing Stripe price env vars: ${missing.join(", ")}`;
  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }
  console.warn(message);
}

module.exports = {
  ADDON_PACKS,
  TYPE_TO_FIELD,
  ALLOWED_ADDON_TYPES,
  getAddonPack,
  getDbFieldForType,
  getAllPacks,
  validateAddonPriceEnv,
};
