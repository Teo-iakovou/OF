// utils/buildPromotionBlueprint.js
const { getPolicies } = require("../policies/loader");
const { bestTimesV1 } = require("./bestTimes");
const { normalizePlatformName, performanceKey } = require("./recommendationKeys");

const scoreOf = (likelihood) =>
  ({ VERY_UNLIKELY: 0, UNLIKELY: 1, POSSIBLE: 2, LIKELY: 3, VERY_LIKELY: 4 }[
    likelihood
  ] ?? 0);

function cslFromSafeSearch(safe = {}) {
  const a = scoreOf(safe.adult);
  const r = scoreOf(safe.racy);
  const max = Math.max(a, r);
  return max >= 4 ? 3 : max === 3 ? 2 : max === 2 ? 1 : 0;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h *= 60;
  }
  return { h, s, l };
}

function colorMood(dominantColors = []) {
  if (!dominantColors.length) {
    return { mood: "neutral", brightness: "mid", warmth: "neutral" };
  }
  let wSum = 0;
  let H = 0;
  let S = 0;
  let L = 0;
  for (const c of dominantColors) {
    const w = c.pixelFraction || c.score || 1;
    const { h, s, l } = rgbToHsl(c.r || 0, c.g || 0, c.b || 0);
    H += h * w;
    S += s * w;
    L += l * w;
    wSum += w;
  }
  if (!wSum) return { mood: "neutral", brightness: "mid", warmth: "neutral" };
  H /= wSum;
  S /= wSum;
  L /= wSum;
  const brightness = L > 0.7 ? "bright" : L < 0.3 ? "dark" : "mid";
  const warmth = H < 60 || H > 300 ? "warm" : H > 180 && H < 300 ? "cool" : "neutral";
  const mood = S > 0.5 ? "vivid" : "muted";
  return { mood, brightness, warmth };
}

function pickNiche(labels = [], webEntities = []) {
  const bag = new Set([
    ...labels.map((l) => (l.description || "").toLowerCase()),
    ...webEntities.map((w) => (w.description || "").toLowerCase()),
  ]);
  const has = (...k) => k.some((x) => bag.has(x));
  if (has("cosplay", "anime", "costume", "character")) return "cosplay";
  if (has("fitness", "bodybuilding", "gym", "workout", "athlete")) return "fitness";
  if (has("lingerie", "glamour", "fashion", "model")) return "glamour";
  if (has("bikini", "swimwear", "beach")) return "bikini";
  if (has("tattoo", "piercing", "goth", "punk", "alternative")) return "alt";
  if (has("food", "cuisine", "dish")) return "food";
  if (has("city", "urban area", "skyline", "night")) return "city";
  if (has("landscape", "nature", "outdoor", "beach")) return "travel";
  return "general";
}

const clampHashtags = (platform, list) => {
  const limit = platform === "Instagram" ? 10 : platform === "TikTok" ? 5 : 8;
  const uniq = Array.from(new Set((list || []).filter(Boolean).map((s) => s.trim())));
  return uniq.slice(0, limit);
};

function stableHash(input) {
  const str = String(input || "");
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h +=
      (h << 1) +
      (h << 4) +
      (h << 7) +
      (h << 8) +
      (h << 24);
  }
  return Math.abs(h >>> 0);
}

function getPerformanceEntry(performanceData = {}, kind, platform, variantId) {
  if (!variantId) return null;
  const normalizedPlatform = normalizePlatformName(platform || null);
  const keySpecific = performanceKey(kind, normalizedPlatform, variantId);
  const keyGlobal = performanceKey(kind, null, variantId);
  return performanceData[keySpecific] || performanceData[keyGlobal] || null;
}

function scoreWithPenalty(perfEntry, recentUsageCount) {
  const engagements = Number(perfEntry?.engagements || 0);
  const impressions = Number(perfEntry?.impressions || 0);
  const base = (engagements / Math.max(1, impressions)) * 100;
  const boundedRecentUsage = Math.min(5, Math.max(0, Number(recentUsageCount || 0)));
  return base - boundedRecentUsage * 5;
}

function pickVariant(candidates = [], recentVariantIds = [], seed = "", options = {}) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  const recent = Array.isArray(recentVariantIds) ? recentVariantIds.filter(Boolean) : [];
  const performanceData = options.performanceData || {};
  const kind = options.kind || "unknown";
  const platform = normalizePlatformName(options.platform || null);
  const recentCounts = options.recentCounts || {};
  const explorationRate = Number.isFinite(Number(options.explorationRate))
    ? Math.max(0, Math.min(1, Number(options.explorationRate)))
    : 0.25;
  const minFeedbackPosts = Number.isFinite(Number(options.minFeedbackPosts))
    ? Math.max(1, Number(options.minFeedbackPosts))
    : 10;
  const selectionStats = options.selectionStats && typeof options.selectionStats === "object"
    ? options.selectionStats
    : null;

  const recentSet = new Set(recent);
  const scored = candidates
    .filter((variant) => variant?.id)
    .map((variant) => {
      const perf = getPerformanceEntry(performanceData, kind, platform, variant.id);
      const posts = Number(perf?.posts || 0);
      const recentUsageCount = Number(recentCounts?.[variant.id] || 0);
      const score = scoreWithPenalty(perf, recentUsageCount);
      return { variant, perf, posts, recentUsageCount, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return stableHash(`${seed}:score:${a.variant.id}`) - stableHash(`${seed}:score:${b.variant.id}`);
    });
  const feedbackPostsTotal = scored.reduce((acc, item) => acc + item.posts, 0);
  const enoughFeedback = feedbackPostsTotal >= minFeedbackPosts;
  const topScore = scored[0]?.score ?? -Infinity;
  const secondScore = scored[1]?.score ?? -Infinity;
  const clearLeader = Number.isFinite(topScore) && Number.isFinite(secondScore)
    ? topScore - secondScore >= 10
    : Number.isFinite(topScore) && topScore > -Infinity;
  const recentBlockingSet = new Set(recent.slice(0, 8));

  const scope = `${kind}:${platform || "*"}`;
  if (selectionStats) {
    selectionStats.totalPicks = (selectionStats.totalPicks || 0) + 1;
    selectionStats.byScope = selectionStats.byScope || {};
    selectionStats.byScope[scope] = selectionStats.byScope[scope] || {
      picks: 0,
      exploitPicks: 0,
      feedbackPosts: 0,
    };
    selectionStats.byScope[scope].picks += 1;
    selectionStats.byScope[scope].feedbackPosts += feedbackPostsTotal;
    if (enoughFeedback) {
      selectionStats.enoughFeedbackPicks = (selectionStats.enoughFeedbackPicks || 0) + 1;
    }
  }

  const shouldExploit = enoughFeedback
    ? Math.random() < 1 - explorationRate
    : clearLeader && scored.length > 0;

  if (shouldExploit && scored.length > 0) {
    const nonVeryRecent = scored.filter((item) => !recentBlockingSet.has(item.variant.id));
    const pool = nonVeryRecent.length > 0 ? nonVeryRecent : scored;
    const topScoreInPool = pool[0]?.score ?? -Infinity;
    const elitePool = pool.filter((item) => Number(item.score) >= topScoreInPool - 6);
    const source = elitePool.length > 0 ? elitePool : pool;
    const idx = stableHash(`${seed}:exploit:${source.map((x) => x.variant.id).join("|")}:${recent.length}`) % source.length;
    const picked = source[idx]?.variant || source[0]?.variant || null;
    if (picked && selectionStats) {
      selectionStats.exploitPicks = (selectionStats.exploitPicks || 0) + 1;
      selectionStats.byScope[scope].exploitPicks += 1;
      if (enoughFeedback) {
        selectionStats.enoughFeedbackExploitPicks =
          (selectionStats.enoughFeedbackExploitPicks || 0) + 1;
      }
    }
    return picked;
  }

  // Explore path:
  // 1) unseen variants
  const unseen = scored.filter((item) => !item.perf);
  if (unseen.length > 0) {
    const unseenNonRecent = unseen.filter((item) => !recentSet.has(item.variant.id));
    const source = unseenNonRecent.length > 0 ? unseenNonRecent : unseen;
    const idx = stableHash(`${seed}:unseen:${source.map((x) => x.variant.id).join("|")}`) % source.length;
    return source[idx]?.variant || null;
  }

  // 2) least recently used
  const lastSeenIndex = new Map();
  recent.forEach((id, idx) => {
    if (!lastSeenIndex.has(id)) lastSeenIndex.set(id, idx); // recent is newest-first
  });
  let best = candidates[0] || null;
  let bestAge = -1;
  for (const candidate of candidates) {
    const idx = lastSeenIndex.has(candidate.id) ? lastSeenIndex.get(candidate.id) : Number.MAX_SAFE_INTEGER;
    if (idx > bestAge) {
      best = candidate;
      bestAge = idx;
    }
  }

  // Priority 4: deterministic fallback.
  if (best) return best;
  const idx = stableHash(`${seed}:fallback:${candidates.map((x) => x?.id || "").join("|")}`) % candidates.length;
  return candidates[idx] || null;
}

function normalizeRecentHistory(recentHistory = {}) {
  const byKey = recentHistory?.variantIdsByKey || {};
  const countsByKey = recentHistory?.countsByKey || {};
  return {
    get(kind, platform) {
      const a = byKey[`${kind}:${platform || "*"}`] || [];
      const b = platform ? byKey[`${kind}:*`] || [] : [];
      return [...a, ...b].filter(Boolean);
    },
    counts(kind, platform) {
      const a = countsByKey[`${kind}:${platform || "*"}`] || {};
      const b = platform ? countsByKey[`${kind}:*`] || {} : {};
      const out = {};
      for (const [id, count] of Object.entries(a)) out[id] = Number(count || 0);
      for (const [id, count] of Object.entries(b)) out[id] = (out[id] || 0) + Number(count || 0);
      return out;
    },
  };
}

function getSeedHashtags(niches, nicheName, emotionName, moodObj) {
  const emoSeed = {
    Joy: ["#happy", "#goodvibes"],
    Sorrow: ["#moody", "#aesthetic"],
    Anger: ["#bold", "#power"],
    Surprise: ["#unexpected", "#reaction"],
    Neutral: ["#daily", "#creator"],
  }[emotionName] || ["#creator"];
  const nicheSeeds = niches[nicheName]?.seeds || niches.general?.seeds || [];
  const colorSeeds =
    moodObj.warmth === "warm"
      ? ["#goldenhour", "#warmtones"]
      : moodObj.brightness === "dark"
        ? ["#nightvibes", "#lowlight"]
        : ["#cleanlook"];
  return [...nicheSeeds, ...emoSeed, ...colorSeeds];
}

function getTimeWindowStrings(platform, timezone, dateNow, selectedTimePack) {
  if (selectedTimePack) {
    const day = dateNow.getDay();
    const isWeekend = day === 0 || day === 6;
    const windows = isWeekend
      ? selectedTimePack.weekend || selectedTimePack.weekday || []
      : selectedTimePack.weekday || selectedTimePack.weekend || [];
    if (Array.isArray(windows) && windows.length > 0) {
      return windows.slice(0, 3);
    }
  }
  return bestTimesV1(platform, timezone, dateNow).map(([s, e]) => `${s}-${e}`);
}

function findSourcePolicy(platformName, sources = {}) {
  const all = Array.isArray(sources?.platforms) ? sources.platforms : [];
  const normalized = String(platformName || "").toLowerCase();
  return (
    all.find((p) => String(p.platform || "").toLowerCase() === normalized) ||
    all.find((p) => normalized === "twitter" && String(p.platform || "").toLowerCase().includes("twitter")) ||
    null
  );
}

function buildPolicyHints(platformName, sources) {
  const policy = findSourcePolicy(platformName, sources);
  if (!policy) return { hints: [], why: null };
  const doHint = Array.isArray(policy.do) ? policy.do[0] : null;
  const dontHint = Array.isArray(policy.dont) ? policy.dont[0] : null;
  const ruleHint = Array.isArray(policy.rules) ? policy.rules[0] : null;
  const hints = [doHint, dontHint, ruleHint].filter(Boolean).slice(0, 3);
  return { hints, why: policy.why || null };
}

function buildPromotionBlueprint(visionData = {}, ctx = {}, options = {}) {
  const {
    platforms,
    niches,
    recommendationPools = {},
    sources = {},
    version: policiesVersion,
  } = getPolicies();

  const {
    hasFace = false,
    emotion = "Neutral",
    labels = [],
    objects = [],
    webEntities = [],
    dominantColors = [],
    safeSearch = {},
  } = visionData;

  const timezone = ctx.timezone || "Europe/Athens";
  const goal = ctx.goal || "subs";
  const linkBase = ctx.linkBase || "https://linktr.ee/model";
  const seed = ctx.imageHash || `${goal}:${timezone}`;
  const now = options.now instanceof Date ? options.now : new Date();
  const recent = normalizeRecentHistory(options.recentHistory || {});
  const performanceData = options.performanceData || {};
  const selectionOptions = {
    explorationRate: options?.variantSelection?.explorationRate ?? 0.25,
    minFeedbackPosts: options?.variantSelection?.minFeedbackPosts ?? 10,
    selectionStats: options?.selectionStats || null,
  };
  const engineVersion = "promo-blueprint-v2";

  const csl = cslFromSafeSearch(safeSearch);
  const niche = pickNiche(labels, webEntities);
  const cmood = colorMood(dominantColors);
  const riskBucket = csl >= 2 ? "spicy" : "safe";

  const platformMixPool = recommendationPools?.platformMixes?.[riskBucket] || [];
  const selectedMix = pickVariant(
    platformMixPool,
    recent.get("platformMix", null),
    `${seed}:${riskBucket}:mix`,
    {
      kind: "platformMix",
      platform: null,
      performanceData,
      recentCounts: recent.counts("platformMix", null),
      ...selectionOptions,
    }
  );

  const fallbackPlatforms = csl >= 2
    ? ["Twitter", "Reddit", "Instagram", "TikTok"]
    : ["Instagram", "TikTok", "Twitter"];

  const platformOrder =
    selectedMix?.platforms && selectedMix.platforms.length
      ? selectedMix.platforms
      : fallbackPlatforms;

  const withUtm = (platformName) =>
    `${linkBase}?utm_source=${encodeURIComponent(platformName.toLowerCase())}&utm_medium=post&utm_campaign=${encodeURIComponent(
      niche || "general"
    )}_${goal}`;

  const baseSeedHashtags = getSeedHashtags(niches, niche, emotion, cmood);
  const ctaPool = recommendationPools?.ctaVariants?.[goal] || [];
  const selectedCta = pickVariant(ctaPool, recent.get("cta", null), `${seed}:${goal}:cta`, {
    kind: "cta",
    platform: null,
      performanceData,
      recentCounts: recent.counts("cta", null),
      ...selectionOptions,
  });

  const recs = platformOrder.map((platformNameRaw) => {
    const platformName = normalizePlatformName(platformNameRaw);
    const hashtagPoolForNiche =
      recommendationPools?.hashtagPacks?.[niche] || recommendationPools?.hashtagPacks?.general || [];
    const hashtagPack = pickVariant(
      hashtagPoolForNiche,
      recent.get("hashtags", platformName),
      `${seed}:${platformName}:hashtags`,
      {
        kind: "hashtags",
        platform: platformName,
        performanceData,
        recentCounts: recent.counts("hashtags", platformName),
        ...selectionOptions,
      }
    );

    const timePool = recommendationPools?.timeWindowPacks?.[platformName] || [];
    const timePack = pickVariant(
      timePool,
      recent.get("times", platformName),
      `${seed}:${platformName}:times`,
      {
        kind: "times",
        platform: platformName,
        performanceData,
        recentCounts: recent.counts("times", platformName),
        ...selectionOptions,
      }
    );

    const stylePool =
      recommendationPools?.captionStyles?.[platformName] || recommendationPools?.captionStyles?.default || [];
    const captionStyle = pickVariant(
      stylePool,
      recent.get("caption", platformName),
      `${seed}:${platformName}:captionStyle`,
      {
        kind: "caption",
        platform: platformName,
        performanceData,
        recentCounts: recent.counts("caption", platformName),
        ...selectionOptions,
      }
    );
    const policyHints = buildPolicyHints(platformName, sources);

    const seededHashtags = clampHashtags(
      platformName,
      (hashtagPack?.tags && hashtagPack.tags.length ? hashtagPack.tags : baseSeedHashtags).concat(
        platformName === "Instagram" ? ["#linkinbio"] : []
      )
    );

    const notes = [];
    if (platformName === "Instagram") {
      notes.push("Lead with a one-line hook.");
      if (csl >= 2) notes.push("Keep preview SFW and move explicit intent to profile funnel.");
    }
    if (platformName === "TikTok") {
      notes.push("Use motion or quick cuts in the first 2 seconds.");
      if (csl >= 2) notes.push("Avoid direct adult platform mentions in caption.");
    }
    if (platformName === "Twitter") {
      notes.push("Pin the top performer for 24 hours.");
    }
    if (platformName === "Reddit") {
      notes.push("Follow subreddit-specific posting rules.");
    }

    return {
      platform: platformName,
      preview: {
        type: csl >= 2 && ["Instagram", "TikTok"].includes(platformName) ? "SFW" : "contextual",
        crop:
          platformName === "TikTok"
            ? "9:16"
            : platformName === "Instagram"
              ? "4:5"
              : "4:5",
        watermark: true,
      },
      caption: "",
      hashtags: seededHashtags,
      link: {
        url: withUtm(platformName),
        placement: platformName === "Instagram" || platformName === "TikTok" ? "bio" : "caption",
      },
      bestTimesLocal: getTimeWindowStrings(platformName, timezone, now, timePack),
      notes,
      selectedIds: {
        timePackId: timePack?.id || null,
        hashtagPackId: hashtagPack?.id || null,
        captionStyleId: captionStyle?.id || null,
        ctaId: selectedCta?.id || null,
      },
      policyHints: policyHints.hints,
      policyWhy: policyHints.why,
    };
  });

  const reasons = [];
  if (safeSearch?.adult) reasons.push(`adult:${safeSearch.adult}`);
  if (safeSearch?.racy) reasons.push(`racy:${safeSearch.racy}`);
  if (hasFace) reasons.push("hasFace:true");
  reasons.push(`niche:${niche}`);

  const ctaVariants = selectedCta?.text
    ? [selectedCta.text]
    : goal === "ppv"
      ? ["Tonight’s PPV is live. DM \"PPV\"."]
      : goal === "customs"
        ? ["DM \"CUSTOM\" for a personalized video."]
        : ["Full set just dropped. Link in bio."];

  const riskFlags = [];
  if (csl >= 2) riskFlags.push("IG/TikTok: use SFW previews only");
  riskFlags.push("Avoid explicit links in IG/TikTok captions");
  riskFlags.push("Watermark all previews");
  riskFlags.push("Strip EXIF before posting");

  const promotion = {
    version: "v2",
    contentSafety: { csl, reasons },
    niche,
    hasFace,
    recommendedPlatforms: recs,
    ctaVariants,
    riskFlags,
    selectedIds: {
      platformMixId: selectedMix?.id || null,
      ctaId: selectedCta?.id || null,
    },
  };
  if (process.env.NODE_ENV !== "production") {
    promotion.debug = {
      riskBucket,
      poolsVersion: recommendationPools?.version || null,
    };
  }

  const meta = {
    vision: { safeSearch, labels, objects, webEntities, dominantColors, hasFace },
    colorMood: cmood,
    goal,
    timezone,
    policiesVersion,
    poolsVersion: recommendationPools?.version || null,
    sourcesVersion: sources?.version || sources?.lastUpdated || null,
    engineVersion,
  };

  return { promotion, meta };
}

module.exports = { buildPromotionBlueprint };
