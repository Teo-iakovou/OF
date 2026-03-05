#!/usr/bin/env node
const { buildPromotionBlueprint } = require("../utils/buildPromotionBlueprint");
const { isNearDuplicate } = require("../utils/textDiversity");
const { normalizePlatformName, performanceKey } = require("../utils/recommendationKeys");

const ITERATIONS = Number(process.argv[2] || 300);

function buildVisionFixture(i) {
  const niches = [
    ["cosplay", "anime"],
    ["fitness", "gym"],
    ["lingerie", "model"],
    ["bikini", "beach"],
    ["tattoo", "goth"],
    ["nature", "travel"],
    ["food", "dish"],
    ["city", "urban area"],
  ];
  const selected = niches[i % niches.length];
  return {
    hasFace: true,
    emotion: ["Joy", "Neutral", "Surprise", "Sorrow"][i % 4],
    labels: selected.map((description) => ({ description })),
    webEntities: selected.map((description) => ({ description })),
    dominantColors: [
      { r: 180 + (i % 60), g: 90 + (i % 70), b: 100 + (i % 80), score: 0.65 },
      { r: 25 + (i % 40), g: 35 + (i % 35), b: 45 + (i % 35), score: 0.35 },
    ],
    safeSearch: {
      adult: i % 7 === 0 ? "LIKELY" : i % 5 === 0 ? "POSSIBLE" : "UNLIKELY",
      racy: i % 6 === 0 ? "LIKELY" : i % 3 === 0 ? "POSSIBLE" : "UNLIKELY",
    },
  };
}

function getRecentVariants(kind, platform, history, cap = 50) {
  const keySpecific = `${kind}:${platform || "*"}`;
  const keyGlobal = `${kind}:*`;
  return [
    ...(history.variantIdsByKey[keySpecific] || []),
    ...(history.variantIdsByKey[keyGlobal] || []),
  ].slice(0, cap);
}

function trackVariant(kind, platform, variantId, history) {
  if (!variantId) return;
  const keySpecific = `${kind}:${platform || "*"}`;
  const keyGlobal = `${kind}:*`;
  history.variantIdsByKey[keySpecific] = [variantId, ...(history.variantIdsByKey[keySpecific] || [])].slice(0, 80);
  history.variantIdsByKey[keyGlobal] = [variantId, ...(history.variantIdsByKey[keyGlobal] || [])].slice(0, 80);

  history.countsByKey[keySpecific] = history.countsByKey[keySpecific] || {};
  history.countsByKey[keySpecific][variantId] =
    (history.countsByKey[keySpecific][variantId] || 0) + 1;
  history.countsByKey[keyGlobal] = history.countsByKey[keyGlobal] || {};
  history.countsByKey[keyGlobal][variantId] =
    (history.countsByKey[keyGlobal][variantId] || 0) + 1;
}

function pseudoCaptionFromRec(rec, promotion, idx) {
  return [
    rec.platform,
    promotion.niche,
    rec?.selectedIds?.captionStyleId || "caption_default",
    rec?.selectedIds?.ctaId || "cta",
    idx % 5,
  ].join(" ");
}

function passFail(metrics) {
  const checks = {
    hashtagPack: metrics.repeatedHashtagPackRate < 0.15,
    timePack: metrics.repeatedTimePackRate < 0.2,
    platformMix: metrics.repeatedPlatformMixRate < 0.1,
    captionNearDuplicate: metrics.captionNearDuplicateRate < 0.08,
    topPerformerReuse: metrics.topPerformerReuseDelta >= 3,
    exploitPickRate: metrics.exploitPickRate >= 0.55,
  };
  return {
    checks,
    pass: Object.values(checks).every(Boolean),
  };
}

function scoreFormula({ engagements, impressions, recentUsageCount }) {
  const boundedRecentUsage = Math.min(5, Math.max(0, Number(recentUsageCount || 0)));
  return (engagements / Math.max(1, impressions)) * 100 - boundedRecentUsage * 5;
}

function updatePerformance(performanceData, history, { kind, platform, variantId, engagement, impressions }) {
  if (!variantId) return;
  const key = performanceKey(kind, platform, variantId);
  const current = performanceData[key] || {
    impressions: 0,
    engagements: 0,
    posts: 0,
    score: 0,
    lastUsedAt: null,
  };
  current.impressions += impressions;
  current.engagements += engagement;
  current.posts += 1;
  current.lastUsedAt = new Date().toISOString();
  const recentCount = Number(history.countsByKey?.[`${kind}:${platform || "*"}`]?.[variantId] || 0);
  current.score = Number(
    scoreFormula({
      engagements: current.engagements,
      impressions: current.impressions,
      recentUsageCount: recentCount,
    }).toFixed(4)
  );
  performanceData[key] = current;

  if (platform) {
    const globalKey = performanceKey(kind, "*", variantId);
    const gCurrent = performanceData[globalKey] || {
      impressions: 0,
      engagements: 0,
      posts: 0,
      score: 0,
      lastUsedAt: null,
    };
    gCurrent.impressions += impressions;
    gCurrent.engagements += engagement;
    gCurrent.posts += 1;
    gCurrent.lastUsedAt = current.lastUsedAt;
    const globalRecentCount = Number(history.countsByKey?.[`${kind}:*`]?.[variantId] || 0);
    gCurrent.score = Number(
      scoreFormula({
        engagements: gCurrent.engagements,
        impressions: gCurrent.impressions,
        recentUsageCount: globalRecentCount,
      }).toFixed(4)
    );
    performanceData[globalKey] = gCurrent;
  }
}

function sampleEngagement(kind, variantId, i) {
  const seed = `${kind}:${variantId}:${i}`;
  const variantSeed = `${kind}:${variantId}`;
  let h = 0;
  for (let idx = 0; idx < seed.length; idx += 1) h = (h * 31 + seed.charCodeAt(idx)) >>> 0;
  let vh = 0;
  for (let idx = 0; idx < variantSeed.length; idx += 1) vh = (vh * 33 + variantSeed.charCodeAt(idx)) >>> 0;
  const qualityBand = h % 100;
  const variantQuality = vh % 100;
  const impressions = 140 + (h % 620);
  const engagementRate =
    variantQuality >= 90 ? 0.35 :
    variantQuality >= 78 ? 0.22 :
    variantQuality >= 58 ? 0.13 :
    variantQuality >= 35 ? 0.08 :
    0.03;
  const engagements = Math.round(impressions * engagementRate);
  return { impressions, engagements, qualityBand };
}

function run() {
  const history = { variantIdsByKey: {}, countsByKey: {}, captionTextHashes: [] };
  const performanceData = {};
  const selectionStats = {
    totalPicks: 0,
    exploitPicks: 0,
    enoughFeedbackPicks: 0,
    enoughFeedbackExploitPicks: 0,
    byScope: {},
  };

  let repeatedHashtagPacks = 0;
  let repeatedTimePacks = 0;
  let repeatedPlatformMixes = 0;

  let totalHashtagPacks = 0;
  let totalTimePacks = 0;
  let totalPlatformMixes = 0;

  let nearDuplicateCaptions = 0;
  let totalCaptionComparisons = 0;

  const rollingCaptions = [];
  const platformMixSelectionCounts = {};
  const variantSelectionCounts = {};

  for (let i = 0; i < ITERATIONS; i += 1) {
    const visionData = buildVisionFixture(i);
    const ctx = {
      goal: ["subs", "ppv", "customs"][i % 3],
      timezone: "Europe/Athens",
      linkBase: "https://linktr.ee/model",
      imageHash: `sim_hash_${i}`,
    };

    const out = buildPromotionBlueprint(visionData, ctx, {
      recentHistory: history,
      performanceData,
      variantSelection: {
        explorationRate: 0.25,
        minFeedbackPosts: 10,
      },
      selectionStats,
    });
    const promotion = out.promotion || {};

    if (promotion?.selectedIds?.platformMixId) {
      totalPlatformMixes += 1;
      const recentMixIds = getRecentVariants("platformMix", null, history, 8);
      if (recentMixIds.includes(promotion.selectedIds.platformMixId)) repeatedPlatformMixes += 1;
      trackVariant("platformMix", null, promotion.selectedIds.platformMixId, history);
      const mixKey = `platformMix:*:${promotion.selectedIds.platformMixId}`;
      platformMixSelectionCounts[promotion.selectedIds.platformMixId] =
        (platformMixSelectionCounts[promotion.selectedIds.platformMixId] || 0) + 1;
      variantSelectionCounts[mixKey] = (variantSelectionCounts[mixKey] || 0) + 1;

      const metrics = sampleEngagement("platformMix", promotion.selectedIds.platformMixId, i);
      updatePerformance(performanceData, history, {
        kind: "platformMix",
        platform: null,
        variantId: promotion.selectedIds.platformMixId,
        engagement: metrics.engagements,
        impressions: metrics.impressions,
      });
    }

    for (const rec of promotion.recommendedPlatforms || []) {
      if (rec?.selectedIds?.hashtagPackId) {
        const platform = normalizePlatformName(rec.platform);
        totalHashtagPacks += 1;
        const recentHashIds = getRecentVariants("hashtags", platform, history, 8);
        if (recentHashIds.includes(rec.selectedIds.hashtagPackId)) repeatedHashtagPacks += 1;
        trackVariant("hashtags", platform, rec.selectedIds.hashtagPackId, history);
        const hashSelKey = `hashtags:${platform}:${rec.selectedIds.hashtagPackId}`;
        variantSelectionCounts[hashSelKey] = (variantSelectionCounts[hashSelKey] || 0) + 1;
        const metrics = sampleEngagement("hashtags", rec.selectedIds.hashtagPackId, i);
        updatePerformance(performanceData, history, {
          kind: "hashtags",
          platform,
          variantId: rec.selectedIds.hashtagPackId,
          engagement: metrics.engagements,
          impressions: metrics.impressions,
        });
      }

      if (rec?.selectedIds?.timePackId) {
        const platform = normalizePlatformName(rec.platform);
        totalTimePacks += 1;
        const recentTimeIds = getRecentVariants("times", platform, history, 8);
        if (recentTimeIds.includes(rec.selectedIds.timePackId)) repeatedTimePacks += 1;
        trackVariant("times", platform, rec.selectedIds.timePackId, history);
        const timeSelKey = `times:${platform}:${rec.selectedIds.timePackId}`;
        variantSelectionCounts[timeSelKey] = (variantSelectionCounts[timeSelKey] || 0) + 1;
        const metrics = sampleEngagement("times", rec.selectedIds.timePackId, i);
        updatePerformance(performanceData, history, {
          kind: "times",
          platform,
          variantId: rec.selectedIds.timePackId,
          engagement: metrics.engagements,
          impressions: metrics.impressions,
        });
      }

      if (rec?.selectedIds?.captionStyleId) {
        const platform = normalizePlatformName(rec.platform);
        trackVariant("caption", platform, rec.selectedIds.captionStyleId, history);
        const captionSelKey = `caption:${platform}:${rec.selectedIds.captionStyleId}`;
        variantSelectionCounts[captionSelKey] = (variantSelectionCounts[captionSelKey] || 0) + 1;
        const metrics = sampleEngagement("caption", rec.selectedIds.captionStyleId, i);
        updatePerformance(performanceData, history, {
          kind: "caption",
          platform,
          variantId: rec.selectedIds.captionStyleId,
          engagement: metrics.engagements,
          impressions: metrics.impressions,
        });
      }

      if (rec?.selectedIds?.ctaId) {
        const platform = normalizePlatformName(rec.platform);
        trackVariant("cta", platform, rec.selectedIds.ctaId, history);
        const ctaSelKey = `cta:${platform}:${rec.selectedIds.ctaId}`;
        variantSelectionCounts[ctaSelKey] = (variantSelectionCounts[ctaSelKey] || 0) + 1;
        const metrics = sampleEngagement("cta", rec.selectedIds.ctaId, i);
        updatePerformance(performanceData, history, {
          kind: "cta",
          platform,
          variantId: rec.selectedIds.ctaId,
          engagement: metrics.engagements,
          impressions: metrics.impressions,
        });
      }

      const simulatedCaption = pseudoCaptionFromRec(rec, promotion, i);
      const comparisons = rollingCaptions.slice(-50);
      totalCaptionComparisons += 1;
      if (comparisons.some((oldText) => isNearDuplicate(simulatedCaption, oldText))) {
        nearDuplicateCaptions += 1;
      }
      rollingCaptions.push(simulatedCaption);
    }
  }

  const sortedMixes = Object.entries(platformMixSelectionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ id, count }));

  const variantRows = Object.entries(variantSelectionCounts).map(([key, count]) => {
    const [kind, platform, variantId] = key.split(":");
    const perf = performanceData[performanceKey(kind, platform === "*" ? null : platform, variantId)] || {};
    const impressions = Number(perf.impressions || 0);
    const engagements = Number(perf.engagements || 0);
    return {
      key,
      kind,
      platform,
      variantId,
      count,
      score: Number(perf.score || 0),
      rawRate: impressions > 0 ? (engagements / impressions) * 100 : 0,
    };
  });
  const topByRawRate = [...variantRows].sort((a, b) => b.rawRate - a.rawRate).slice(0, 12);
  const bottomByRawRate = [...variantRows].sort((a, b) => a.rawRate - b.rawRate).slice(0, 12);
  const avgSelections = (rows) =>
    rows.length ? rows.reduce((acc, row) => acc + row.count, 0) / rows.length : 0;
  const topPerformerReuseDelta = Number(
    (avgSelections(topByRawRate) - avgSelections(bottomByRawRate)).toFixed(3)
  );
  const exploitPickRate =
    Number(selectionStats.enoughFeedbackPicks || 0) > 0
      ? Number(
          (
            Number(selectionStats.enoughFeedbackExploitPicks || 0) /
            Number(selectionStats.enoughFeedbackPicks || 1)
          ).toFixed(3)
        )
      : 0;
  const totalFeedbackPosts = Object.fromEntries(
    Object.entries(selectionStats.byScope || {}).map(([scope, v]) => [
      scope,
      Number(v?.feedbackPosts || 0),
    ])
  );

  const metrics = {
    iterations: ITERATIONS,
    repeatedHashtagPackRate:
      totalHashtagPacks > 0 ? Number((repeatedHashtagPacks / totalHashtagPacks).toFixed(3)) : 0,
    repeatedTimePackRate:
      totalTimePacks > 0 ? Number((repeatedTimePacks / totalTimePacks).toFixed(3)) : 0,
    repeatedPlatformMixRate:
      totalPlatformMixes > 0 ? Number((repeatedPlatformMixes / totalPlatformMixes).toFixed(3)) : 0,
    captionNearDuplicateRate:
      totalCaptionComparisons > 0
        ? Number((nearDuplicateCaptions / totalCaptionComparisons).toFixed(3))
        : 0,
    topPlatformMixSelections: sortedMixes,
    topPerformerReuseDelta,
    exploitPickRate,
    totalFeedbackPosts,
  };

  const summary = passFail(metrics);
  console.log(JSON.stringify({ ...metrics, ...summary }, null, 2));
}

run();
