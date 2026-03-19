const Result = require("../models/result");

async function buildChatContext(email, hint = {}) {
  const results = await Result.find({ email }).sort({ createdAt: -1 }).limit(20).lean();

  // Auto-detect niche from most recent upload if caller didn't supply one
  const detectedNiche = hint.niche || results[0]?.niche || null;

  const scored = results
    .map(r => {
      let score = 0;
      if (detectedNiche && r.niche === detectedNiche) score += 2;
      if (hint.hasFace !== undefined && !!r.hasFace === !!hint.hasFace) score += 1;
      score += Math.max(0, 10 - Math.floor((Date.now() - new Date(r.createdAt)) / (24*3600e3)));
      return { r, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const bullets = scored.map(({ r }) => {
    const plat = r.promotion?.recommendedPlatforms?.[0]?.platform || "Instagram";
    const time = r.promotion?.recommendedPlatforms?.[0]?.bestTimesLocal?.[0] || "18:00-21:00";
    const niche = r.niche || "general";
    const rawCaption = r.caption || r.output?.caption || "";
    const captionSnippet = rawCaption.slice(0, 60).replace(/\n/g, " ") + (rawCaption.length > 60 ? "…" : "");
    const hashtagCount = (r.hashtags?.length ?? r.output?.hashtags?.length) || 0;
    const mood = r.meta?.colorMood?.warmth || "neutral";
    const daysAgo = Math.floor((Date.now() - new Date(r.createdAt)) / (24 * 3600e3));
    return `• ${plat} | niche: ${niche} | best time: ${time} | caption: '${captionSnippet}' | ${hashtagCount} hashtags | mood: ${mood} | ${daysAgo}d ago`;
  });

  return { bullets, ids: scored.map(s => s.r._id.toString()) };
}

module.exports = { buildChatContext };