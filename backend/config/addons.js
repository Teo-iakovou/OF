/** @typedef {"uploads" | "chat" | "sadtalkerVideos"} AddonType */

const ADDONS = {
  uploads: {
    packs: {
      pack_5: { qty: 5, priceEnv: "STRIPE_PRICE_UPLOADS_5" },
      pack_20: { qty: 20, priceEnv: "STRIPE_PRICE_UPLOADS_20" },
    },
  },
  chat: {
    packs: {
      pack_100k: { qty: 100000, priceEnv: "STRIPE_PRICE_CHAT_100K" },
    },
  },
  sadtalkerVideos: {
    packs: {
      pack_5: { qty: 5, priceEnv: "STRIPE_PRICE_VIDEOS_5" },
      pack_15: { qty: 15, priceEnv: "STRIPE_PRICE_VIDEOS_15" },
      pack_30: { qty: 30, priceEnv: "STRIPE_PRICE_VIDEOS_30" },
    },
  },
};

const getAddonPack = (addonType, packKey) => {
  const addon = ADDONS[addonType];
  const pack = addon?.packs?.[packKey];
  if (!pack) return null;
  return { ...pack, priceId: process.env[pack.priceEnv] || null };
};

const validateAddonPriceEnv = () => {
  const missing = [];
  for (const addon of Object.values(ADDONS)) {
    for (const pack of Object.values(addon.packs)) {
      if (!process.env[pack.priceEnv]) missing.push(pack.priceEnv);
    }
  }
  if (missing.length === 0) return;
  const message = `[addons] missing Stripe price env vars: ${missing.join(", ")}`;
  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }
  console.warn(message);
};

const ADDON_PRICES = Object.fromEntries(
  Object.entries(ADDONS).map(([addonType, addon]) => [
    addonType,
    Object.fromEntries(
      Object.entries(addon.packs).map(([packKey, pack]) => [
        packKey,
        { ...pack, priceId: process.env[pack.priceEnv] || null },
      ])
    ),
  ])
);

/** @type {AddonType | null} */
const AddonType = null;

module.exports = {
  ADDONS,
  ADDON_PRICES,
  getAddonPack,
  validateAddonPriceEnv,
  AddonType,
};
