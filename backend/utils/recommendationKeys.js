function normalizePlatformName(name) {
  if (!name) return null;
  const raw = String(name).trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower === "instagram") return "Instagram";
  if (lower === "tiktok" || lower === "tik tok") return "TikTok";
  if (lower === "twitter" || lower === "x") return "Twitter";
  if (lower === "reddit") return "Reddit";
  if (lower === "onlyfans" || lower === "only fans") return "OnlyFans";
  return raw;
}

function performanceKey(kind, platform, variantId) {
  return `${kind}:${platform || "*"}:${variantId}`;
}

module.exports = { normalizePlatformName, performanceKey };
