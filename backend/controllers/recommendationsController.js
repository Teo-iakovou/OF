const mongoose = require("mongoose");
const { sendErr } = require("../utils/sendErr");
const Result = require("../models/result");
const RecommendationPerformance = require("../models/recommendationPerformance");
const RecommendationHistory = require("../models/recommendationHistory");
const { normalizePlatformName } = require("../utils/recommendationKeys");

function buildResultScope(user) {
  const userId = user?.id || user?._id || null;
  const email = user?.email || null;
  if (userId && email) {
    return {
      $or: [
        { userId },
        { userId: { $exists: false }, email },
        { userId: null, email },
      ],
    };
  }
  if (userId) return { userId };
  if (email) return { email };
  return {};
}

function normalizeNumber(value, fallback = 0) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return fallback;
  return num;
}

function computeScore({ engagements, impressions, recentUsageCount }) {
  const rate = engagements / Math.max(1, impressions);
  const boundedRecentUsage = Math.min(5, Math.max(0, Number(recentUsageCount || 0)));
  return rate * 100 - boundedRecentUsage * 5;
}

async function postRecommendationFeedback(req, res) {
  const { resultId, platform, variantIds, engagement, impressions } = req.body || {};

  if (!req.user?.id) return sendErr(req, res, 401, "Unauthorized");
  if (!resultId || !mongoose.Types.ObjectId.isValid(resultId)) {
    return sendErr(req, res, 400, "Invalid resultId", { errorCode: "INVALID_RESULT_ID" });
  }
  if (!variantIds || typeof variantIds !== "object") {
    return sendErr(req, res, 400, "variantIds is required", {
      errorCode: "INVALID_VARIANT_IDS",
    });
  }

  try {
    const result = await Result.findOne({ _id: resultId, ...buildResultScope(req.user) });
    if (!result) {
      return sendErr(req, res, 404, "Result not found", { errorCode: "RESULT_NOT_FOUND" });
    }

    const userId = result.userId || req.user.id;
    const packageInstanceId = result.packageInstanceId || null;
    if (!packageInstanceId) {
      return sendErr(req, res, 400, "Result missing package instance", {
        errorCode: "MISSING_PACKAGE_INSTANCE",
      });
    }

    const metrics = {
      impressions: normalizeNumber(impressions, 0),
      engagements: normalizeNumber(engagement, 0),
    };

    const normalizedPlatform = normalizePlatformName(platform || null);
    const rows = [
      { kind: "platformMix", platform: null, variantId: variantIds.platformMixId || null },
      { kind: "hashtags", platform: normalizedPlatform, variantId: variantIds.hashtagPackId || null },
      { kind: "times", platform: normalizedPlatform, variantId: variantIds.timePackId || null },
      { kind: "caption", platform: normalizedPlatform, variantId: variantIds.captionStyleId || null },
      { kind: "cta", platform: null, variantId: variantIds.ctaId || null },
    ].filter((row) => typeof row.variantId === "string" && row.variantId.trim());

    if (rows.length === 0) {
      return res.status(200).json({
        ok: true,
        skipped: true,
        reason: "NO_VARIANT_IDS",
        requestId: req.requestId || null,
      });
    }

    const ops = rows.map((row) => {
      const filter = {
        userId,
        packageInstanceId,
        kind: row.kind,
        platform: row.platform || null,
        variantId: row.variantId,
      };

      return RecommendationPerformance.findOneAndUpdate(
        filter,
        {
          $inc: {
            impressions: metrics.impressions,
            engagements: metrics.engagements,
            posts: 1,
          },
          $set: {
            lastUsedAt: new Date(),
          },
          $setOnInsert: {
            score: 0,
          },
        },
        { new: true, upsert: true }
      ).then(async (doc) => {
        const recentUsageCount = Math.min(5, Math.max(1, Number(doc?.posts || 0)));
        const nextScore = computeScore({
          engagements: Number(doc?.engagements || 0),
          impressions: Number(doc?.impressions || 0),
          recentUsageCount,
        });
        doc.score = Number(nextScore.toFixed(4));
        await doc.save();
        return doc;
      });
    });

    const updated = await Promise.all(ops);

    const variantIdsByKey = {};
    const countsByKey = {};
    const addVariant = (kind, platformName, variantId) => {
      if (typeof variantId !== "string" || !variantId.trim()) return;
      const normalizedId = variantId.trim();
      const normalized = normalizePlatformName(platformName || null);
      const key = `${kind}:${normalized || "*"}`;
      if (!variantIdsByKey[key]) variantIdsByKey[key] = [];
      if (!variantIdsByKey[key].includes(normalizedId)) {
        variantIdsByKey[key].push(normalizedId);
      }
      if (!countsByKey[key]) countsByKey[key] = {};
      countsByKey[key][normalizedId] = (countsByKey[key][normalizedId] || 0) + 1;
    };

    addVariant("platformMix", null, variantIds.platformMixId);
    addVariant("hashtags", normalizedPlatform, variantIds.hashtagPackId);
    addVariant("times", normalizedPlatform, variantIds.timePackId);
    addVariant("caption", normalizedPlatform, variantIds.captionStyleId);
    addVariant("cta", null, variantIds.ctaId);

    if (Object.keys(variantIdsByKey).length > 0) {
      const historyEntries = rows.map((row) => ({
        userId,
        packageInstanceId,
        source: "posted",
        kind: row.kind,
        platform: row.platform || null,
        variantId: row.variantId,
        niche: result?.promotion?.niche || null,
        csl:
          typeof result?.promotion?.contentSafety?.csl === "number"
            ? result.promotion.contentSafety.csl
            : null,
        imageHash: result?.imageHash || null,
        resultId: result._id,
      }));
      historyEntries.push({
        userId,
        packageInstanceId,
        source: "posted",
        variantIdsByKey,
        countsByKey,
        captionTextHashes: [],
        createdAt: new Date(),
        resultId: result._id,
      });
      await RecommendationHistory.insertMany(historyEntries, { ordered: false });
    }

    return res.json({
      ok: true,
      requestId: req.requestId || null,
      updated: updated.map((doc) => ({
        kind: doc.kind,
        platform: doc.platform,
        variantId: doc.variantId,
        impressions: doc.impressions,
        engagements: doc.engagements,
        posts: doc.posts,
        score: doc.score,
      })),
    });
  } catch (err) {
    return sendErr(req, res, 500, "Failed to store recommendation feedback", {
      errorCode: "RECOMMENDATION_FEEDBACK_FAILED",
      message: err?.message,
    });
  }
}

module.exports = { postRecommendationFeedback };
