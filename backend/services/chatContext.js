const Result = require("../models/result");

async function buildChatContext(email, hint = {}) {
  const results = await Result.find({ email }).sort({ createdAt: -1 }).limit(20).lean();
  const scored = results
    .map(r => {
      let score = 0;
      if (hint.niche && r.niche === hint.niche) score += 2;
      if (hint.hasFace !== undefined && !!r.hasFace === !!hint.hasFace) score += 1;
      score += Math.max(0, 10 - Math.floor((Date.now() - new Date(r.createdAt)) / (24*3600e3)));
      return { r, score };
    })
    .sort((a,b)=>b.score-a.score)
    .slice(0,5);

  const bullets = scored.map(({r}) => {
    const plat = r.promotion?.recommendedPlatforms?.[0]?.platform || "Instagram";
    const time = r.promotion?.recommendedPlatforms?.[0]?.bestTimesLocal?.[0] || "18:00-21:00";
    const mood = r.meta?.colorMood?.warmth || "neutral";
    return `• ${plat} | best time ${time} | color ${mood}`;
  });

  return { bullets, ids: scored.map(s => s.r._id.toString()) };
}

module.exports = { buildChatContext };