// backend/controllers/analyzeController.js
const path = require("path");
const fs = require("fs/promises");
const sharp = require("sharp");
const crypto = require("crypto");
const { z } = require("zod");
mongoose = require("mongoose");
const Result = require("../models/result");
const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");
const RecommendationHistory = require("../models/recommendationHistory");
const RecommendationPerformance = require("../models/recommendationPerformance");

const { analyzeImageBufferWithGoogleVision } = require("../utils/analyzeImageWithGoogleVision");
const { buildPromotionBlueprint } = require("../utils/buildPromotionBlueprint");
const { generateCaptionWithOpenAI } = require("../utils/generateCaptionWithOpenAI");
const { isNearDuplicate } = require("../utils/textDiversity");
const { sendQuotaError } = require("../utils/quotaError");
const { sendErr } = require("../utils/sendErr");
const { verifyFaceMatches } = require("../utils/rekognition");
const { putObject, buildPublicUrl } = require("../utils/s3");
const { getPolicies } = require("../policies/loader");
const { normalizePlatformName, performanceKey } = require("../utils/recommendationKeys");
// --- helpers ---
const log = (requestId, stage, extra = {}) =>
  console.log(JSON.stringify({ requestId, stage, ...extra }));

function extensionFromMime(mimeType) {
  const mime = String(mimeType || "").toLowerCase();
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

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

async function resolveActivePackageInstance(user) {
  if (!user) return null;
  if (!user.activePackageInstanceId) return null;
  return PackageInstance.findOne({
    _id: user.activePackageInstanceId,
    userId: user._id,
    status: "active",
  });
}

async function resolvePackageInstanceForAnalyze(user, requestedPackageInstanceId) {
  if (!user) return null;
  if (requestedPackageInstanceId && mongoose.Types.ObjectId.isValid(requestedPackageInstanceId)) {
    const requested = await PackageInstance.findOne({
      _id: requestedPackageInstanceId,
      userId: user._id,
      status: "active",
    });
    if (requested) return requested;
  }
  return resolveActivePackageInstance(user);
}

function normalizeCaptionText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function textHash(value) {
  const normalized = normalizeCaptionText(value);
  if (!normalized) return null;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

async function fetchRecentRecommendationHistory(userId, packageInstanceId, limit = 120) {
  const rows = await RecommendationHistory.find({
    userId,
    packageInstanceId,
  })
    .sort({ createdAt: -1 })
    .limit(Math.max(10, limit))
    .lean();

  const variantIdsByKey = {};
  const countsByKey = {};
  const captionTextHashes = [];

  for (const row of rows) {
    const keySpecific = `${row.kind}:${row.platform || "*"}`;
    if (!variantIdsByKey[keySpecific]) variantIdsByKey[keySpecific] = [];
    if (!countsByKey[keySpecific]) countsByKey[keySpecific] = {};
    if (row.variantId && variantIdsByKey[keySpecific].length < 25) {
      variantIdsByKey[keySpecific].push(row.variantId);
      countsByKey[keySpecific][row.variantId] =
        (countsByKey[keySpecific][row.variantId] || 0) + 1;
    }

    if (row.platform) {
      const keyGlobal = `${row.kind}:*`;
      if (!variantIdsByKey[keyGlobal]) variantIdsByKey[keyGlobal] = [];
      if (!countsByKey[keyGlobal]) countsByKey[keyGlobal] = {};
      if (row.variantId && variantIdsByKey[keyGlobal].length < 25) {
        variantIdsByKey[keyGlobal].push(row.variantId);
        countsByKey[keyGlobal][row.variantId] =
          (countsByKey[keyGlobal][row.variantId] || 0) + 1;
      }
    }

    if (row.kind === "caption" && row.textHash && captionTextHashes.length < 80) {
      captionTextHashes.push(row.textHash);
    }
  }

  return { variantIdsByKey, countsByKey, captionTextHashes };
}

async function fetchRecommendationPerformance(userId, packageInstanceId) {
  const rows = await RecommendationPerformance.find({
    userId,
    packageInstanceId,
  })
    .sort({ score: -1, lastUsedAt: -1 })
    .limit(1200)
    .lean();

  const performanceData = {};
  for (const row of rows) {
    const normalizedPlatform = normalizePlatformName(row.platform || null);
    const keySpecific = performanceKey(row.kind, normalizedPlatform, row.variantId);
    performanceData[keySpecific] = {
      score: Number(row.score || 0),
      impressions: Number(row.impressions || 0),
      engagements: Number(row.engagements || 0),
      posts: Number(row.posts || 0),
      lastUsedAt: row.lastUsedAt ? new Date(row.lastUsedAt).toISOString() : null,
    };
    if (normalizedPlatform) {
      const keyGlobal = performanceKey(row.kind, null, row.variantId);
      if (!performanceData[keyGlobal]) {
        performanceData[keyGlobal] = performanceData[keySpecific];
      }
    }
  }
  return performanceData;
}

function selectCaptionStyleCandidates(pool = [], preferredId = null, limit = 3) {
  if (!Array.isArray(pool) || pool.length === 0) return [];
  const uniq = [];
  const seen = new Set();
  const preferred = pool.find((s) => s?.id && s.id === preferredId) || null;
  if (preferred && !seen.has(preferred.id)) {
    uniq.push(preferred);
    seen.add(preferred.id);
  }
  for (const style of pool) {
    if (!style?.id || seen.has(style.id)) continue;
    uniq.push(style);
    seen.add(style.id);
    if (uniq.length >= limit) break;
  }
  return uniq.slice(0, limit);
}

function findSourcePolicy(sources, platformName) {
  const list = Array.isArray(sources?.platforms) ? sources.platforms : [];
  const normalized = String(platformName || "").toLowerCase();
  return (
    list.find((s) => String(s.platform || "").toLowerCase() === normalized) ||
    list.find((s) => normalized === "twitter" && String(s.platform || "").toLowerCase().includes("twitter")) ||
    null
  );
}

const analyzeReqSchema = z.object({
  email: z.string().email(),
  goal: z.enum(["subs", "ppv", "customs"]).optional(),
  linkBase: z.string().url().optional(),
  timezone: z.string().optional(),
  captions: z.string().optional(), // from query (?captions=false)
});

// --- controller: POST /api/analyze ---
const analyzeImage = async (req, res) => {
  const requestId = req.requestId || null;
  const t0 = Date.now();
  let stage = "start";
  const respondErr = (status, msg, detail) => {
    const payload = { error: msg, requestId };
    if (process.env.DEBUG_ERRORS === "true" && detail) payload.detail = detail;
    return res.status(status).json(payload);
  };

  const { file } = req;
    const email = req.user?.email;
  const captionsParam = String(req.query?.captions ?? "").toLowerCase();
  const skipCaptions = captionsParam === "false";

  // Validate body/query
  const parsed = analyzeReqSchema.safeParse({
    email,
    goal: req.body?.goal,
    linkBase: req.body?.linkBase,
    timezone: req.body?.timezone,
    captions: captionsParam || undefined,
  });
  if (!parsed.success) {
    return respondErr(400, "Invalid input.", parsed.error?.flatten?.());
  }

  if (!file || !email) return respondErr(400, "Image and email are required.");
  if (typeof file.size === "number" && file.size > 7 * 1024 * 1024) {
    return respondErr(400, "File too large (max 7MB).");
  }

  const filePath = path.resolve(__dirname, "../", file.path);

  let user;
  let selectedInstance;
  let quotaReserved = false;
  let reservedInstanceId = null;
  const releaseReservedQuota = async () => {
    if (!quotaReserved) return;
    if (!reservedInstanceId) {
      quotaReserved = false;
      return;
    }
    try {
      await PackageInstance.updateOne(
        { _id: reservedInstanceId },
        { $inc: { uploadsUsed: -1 } }
      );
      quotaReserved = false;
      reservedInstanceId = null;
    } catch (relErr) {
      log(requestId, "quota_release_error", { message: relErr?.message });
    } finally {
      quotaReserved = false;
    }
  };

  try {
    // 0) User checks
    try {
      const requestedPackageInstanceId =
        typeof req.body?.packageInstanceId === "string" ? req.body.packageInstanceId : null;
      if (!req.user || !req.user.id) return respondErr(401, "Unauthorized");
      user = await User.findById(req.user.id);
      if (!user) return respondErr(403, "User not found.");
      selectedInstance = await resolvePackageInstanceForAnalyze(user, requestedPackageInstanceId);
      if (!selectedInstance) {
        log(requestId, "face_verify_resolution", {
          requestedPackageInstanceId: requestedPackageInstanceId || null,
          activePackageInstanceId: user?.activePackageInstanceId?.toString?.() || null,
          resolvedPackageInstanceId: null,
        });
        return sendErr(req, res, 409, "No active package instance.", {
          errorCode: "ACTIVE_INSTANCE_REQUIRED",
          message: "No active package instance.",
        });
      }
      log(requestId, "face_verify_resolution", {
        requestedPackageInstanceId: requestedPackageInstanceId || null,
        activePackageInstanceId: user?.activePackageInstanceId?.toString?.() || null,
        resolvedPackageInstanceId: selectedInstance?._id?.toString?.() || null,
      });
      if (!selectedInstance.faceEnrolled || !selectedInstance.rekognitionFaceId) {
        log(requestId, "enroll_gate_blocked", {
          packageInstanceId: selectedInstance?._id?.toString?.() || null,
          faceEnrolled: !!selectedInstance?.faceEnrolled,
          rekognitionFaceId: selectedInstance?.rekognitionFaceId || null,
        });
        return res.status(409).json({
          errorCode: "FACE_NOT_ENROLLED",
          code: "FACE_NOT_ENROLLED",
          message: "Face enrollment required.",
          requestId,
        });
      }
      if (!user.isAdmin) {
        if (process.env.NODE_ENV !== "production") {
          const addonsUploads =
            typeof selectedInstance?.addons?.uploads === "number" ? selectedInstance.addons.uploads : 0;
          const baseLimit =
            typeof selectedInstance?.uploadLimit === "number" ? selectedInstance.uploadLimit : null;
          const effectiveLimit =
            baseLimit === null ? null : baseLimit === 0 ? 0 : baseLimit + addonsUploads;
          const uploadsUsedBefore =
            typeof selectedInstance?.uploadsUsed === "number" ? selectedInstance.uploadsUsed : null;
          const remainingBefore =
            effectiveLimit === null ? null : effectiveLimit === 0 ? null : Math.max(0, effectiveLimit - (uploadsUsedBefore || 0));
          log(requestId, "upload_quota_before", {
            packageInstanceId: selectedInstance?._id?.toString() || null,
            uploadsUsedBefore,
            limit: effectiveLimit,
            remainingBefore,
          });
        }
        const reserved = await PackageInstance.findOneAndUpdate(
          {
            _id: selectedInstance._id,
            userId: user._id,
            $expr: {
              $or: [
                { $eq: ["$uploadLimit", 0] },
                // Include upload add-ons in the effective limit.
                {
                  $lt: [
                    "$uploadsUsed",
                    { $add: ["$uploadLimit", { $ifNull: ["$addons.uploads", 0] }] },
                  ],
                },
              ],
            },
          },
          { $inc: { uploadsUsed: 1 } },
          { new: true }
        );
        if (!reserved) {
          const limit =
            typeof selectedInstance.uploadLimit === "number" ? selectedInstance.uploadLimit : null;
          return sendQuotaError(res, 403, {
            message: "Upload limit reached.",
            feature: "analyze_upload",
            plan: selectedInstance.planKey || null,
            remaining: 0,
            limit,
            requestId,
          });
        }
        quotaReserved = true;
        reservedInstanceId = reserved._id;
        selectedInstance = reserved;
        if (process.env.NODE_ENV !== "production") {
          const addonsUploads =
            typeof reserved?.addons?.uploads === "number" ? reserved.addons.uploads : 0;
          const baseLimit = typeof reserved?.uploadLimit === "number" ? reserved.uploadLimit : null;
          const effectiveLimit =
            baseLimit === null ? null : baseLimit === 0 ? 0 : baseLimit + addonsUploads;
          const uploadsUsedAfter =
            typeof reserved?.uploadsUsed === "number" ? reserved.uploadsUsed : null;
          const remainingAfter =
            effectiveLimit === null ? null : effectiveLimit === 0 ? null : Math.max(0, effectiveLimit - (uploadsUsedAfter || 0));
          log(requestId, "upload_quota_after", {
            packageInstanceId: reserved?._id?.toString() || null,
            uploadsUsedAfter,
            remainingAfter,
          });
        }
      }
    } catch (e) {
      log(requestId, "user_lookup_error", { message: e?.message });
      return respondErr(500, "Failed to analyze image", { stage: "user_lookup", message: e?.message });
    }

    // 1) Read bytes & detect/convert format
    let inputBuffer;
    let detected = null;
    let uploadMime = file?.mimetype || "image/jpeg";
    let uploadExt = extensionFromMime(uploadMime);
    try {
      inputBuffer = await fs.readFile(filePath);

      // dynamic import for ESM
      const { fileTypeFromBuffer } = await import("file-type");
      detected = await fileTypeFromBuffer(inputBuffer);

      if (!detected) {
        try {
          const meta = await sharp(inputBuffer).metadata();
          if (meta?.format) {
            const map = {
              jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
              webp: "image/webp", heic: "image/heic", heif: "image/heif",
              tiff: "image/tiff", gif: "image/gif", bmp: "image/bmp",
              avif: "image/avif"
            };
            detected = { ext: meta.format.toLowerCase(), mime: map[meta.format.toLowerCase()] || "" };
          }
        } catch {}
      }

      const ext = (detected?.ext || "").toLowerCase();
      const allowed = new Set(["png", "jpg", "jpeg", "webp"]);
      const convertible = new Set(["heic", "heif", "gif", "tiff", "bmp", "avif"]);

      if (!allowed.has(ext) && !convertible.has(ext)) {
        return respondErr(
          400,
          "Unsupported file type. Use PNG, JPG/JPEG, WEBP (HEIC/HEIF/AVIF/GIF/TIFF/BMP are auto-converted).",
          { stage: "type_check", detected }
        );
      }

      if (!allowed.has(ext)) {
        try {
          inputBuffer = await sharp(inputBuffer).jpeg({ quality: 85 }).toBuffer();
          uploadMime = "image/jpeg";
          uploadExt = "jpg";
        } catch (convErr) {
          log(requestId, "convert_error", { message: convErr?.message });
          return respondErr(
            415,
            "Could not convert image (decoder not available). Please upload JPG/PNG/WEBP.",
            { stage: "convert", detected, message: convErr?.message }
          );
        }
      } else if (ext) {
        uploadExt = ext === "jpeg" ? "jpg" : ext;
        if (uploadExt === "jpg") uploadMime = "image/jpeg";
      }
    } catch (e) {
      log(requestId, "read_detect_error", { message: e?.message });
      return respondErr(500, "Failed to analyze image", { stage: "read_detect", message: e?.message });
    }

    // 1b) Dedup via SHA-256 (on normalized bytes)
    let imageHash = "";
    try {
      imageHash = crypto.createHash("sha256").update(inputBuffer).digest("hex");
      const existing = await Result.findOne({
        ...buildResultScope(user),
        packageInstanceId: selectedInstance?._id || null,
        imageHash,
      }).sort({ createdAt: -1 });
      if (existing) {
        log(requestId, "dedup_hit", {
          imageHash,
          dedupeScope: "instance",
          resultId: existing._id.toString(),
        });
        await releaseReservedQuota();
        return res.json({
          message: "Duplicate image detected — returning existing analysis.",
          insights: existing.toObject(),
          duplicate: true,
          requestId,
        });
      }
    } catch (e) {
      log(requestId, "hash_error", { message: e?.message });
      // continue without dedup if hashing fails
    }

    // 2) Vision
    stage = "vision_start";
    console.log(
      JSON.stringify({
        requestId,
        stage,
        packageInstanceId: selectedInstance?._id?.toString?.() || null,
        activeInstanceId: selectedInstance?._id?.toString?.() || null,
      })
    );
    const tVision0 = Date.now();
    let visionData;
    try {
      visionData = await analyzeImageBufferWithGoogleVision(inputBuffer, { requestId });
      if (!visionData) {
        return respondErr(502, "Vision analysis failed.", { stage: "vision_null" });
      }
    } catch (e) {
      log(requestId, "vision_throw", { message: e?.message });
      return respondErr(502, "Vision analysis failed.", { stage: "vision_throw", message: e?.message });
    }
    stage = "vision_done";
    log(requestId, "vision_done", {
      duration_ms: Date.now() - tVision0,
      packageInstanceId: selectedInstance?._id?.toString?.() || null,
      activeInstanceId: selectedInstance?._id?.toString?.() || null,
    });
    const detectedFaceCount =
      typeof visionData?.faceCount === "number"
        ? visionData.faceCount
        : Array.isArray(visionData?.faces)
          ? visionData.faces.length
          : visionData?.hasFace
            ? 1
            : 0;
    if (selectedInstance?.faceEnrolled === true && detectedFaceCount <= 0) {
      console.log(
        JSON.stringify({
          requestId,
          stage: "face_gate_no_face",
          packageInstanceId: selectedInstance?._id?.toString?.() || null,
          activeInstanceId: selectedInstance?._id?.toString?.() || null,
          faceEnrolled: true,
          hasFace: false,
          faceCount: detectedFaceCount,
        })
      );
      await releaseReservedQuota();
      return sendErr(req, res, 403, "No face found in image.", { code: "NO_FACE_FOUND" });
    }
    if (detectedFaceCount > 1) {
      log(requestId, "face_gate_multiple_faces", {
        packageInstanceId: selectedInstance?._id?.toString?.() || null,
        faceCount: detectedFaceCount,
      });
      await releaseReservedQuota();
      return sendErr(req, res, 403, "Multiple faces are not allowed.", {
        code: "MULTIPLE_FACES_NOT_ALLOWED",
      });
    }

    if (selectedInstance?.rekognitionFaceId && visionData.hasFace) {
      try {
        stage = "face_verify_call";
        const envThreshold = Number(process.env.REKOGNITION_MATCH_THRESHOLD || 90);
        const expectedFaceId = selectedInstance.rekognitionFaceId || null;
        const configuredRegion =
          process.env.REKOGNITION_REGION || process.env.AWS_REGION || process.env.S3_REGION || "us-east-1";
        console.log(
          JSON.stringify({
            requestId,
            stage: "face_verify_call",
            packageInstanceId: selectedInstance?._id?.toString?.() || null,
            activeInstanceId: selectedInstance?._id?.toString?.() || null,
            faceEnrolled: !!selectedInstance?.faceEnrolled,
            expectedFaceId,
            matchedFaceId: null,
            similarity: null,
            threshold: Number.isFinite(envThreshold) ? envThreshold : null,
            matched: null,
            REKOGNITION_MATCH_THRESHOLD: Number.isFinite(envThreshold) ? envThreshold : null,
            REKOGNITION_COLLECTION_ID: process.env.REKOGNITION_COLLECTION_ID || null,
            AWS_REGION: configuredRegion,
            inputBufferByteLength:
              typeof inputBuffer?.byteLength === "number" ? inputBuffer.byteLength : null,
          })
        );
        const {
          similarity,
          matchedFaceId,
          threshold,
          matched,
          reason,
          topSimilarity,
          topFaceId,
          topExternalImageId,
          matchCount,
          acceptedBy,
          foreignTopSkipped,
          allMatchExternalImageIdsSample,
        } = await verifyFaceMatches(
          inputBuffer,
          expectedFaceId,
          { requestId, expectedExternalImageId: selectedInstance._id?.toString?.() || null }
        );
        stage = "face_verify_return";
        const exactSimilarity = typeof similarity === "number" ? similarity : null;
        console.log(
          JSON.stringify({
            requestId,
            stage: "face_verify_return",
            packageInstanceId: selectedInstance?._id?.toString?.() || null,
            activeInstanceId: selectedInstance?._id?.toString?.() || null,
            similarity: exactSimilarity,
            matchedFaceId: matchedFaceId || null,
            topFaceId: topFaceId || null,
            topSimilarity: typeof topSimilarity === "number" ? topSimilarity : null,
            topExternalImageId: topExternalImageId || null,
            expectedExternalImageId: selectedInstance?._id?.toString?.() || null,
            matchCount: typeof matchCount === "number" ? matchCount : null,
            allMatchExternalImageIdsSample: allMatchExternalImageIdsSample || [],
            threshold: typeof threshold === "number" ? threshold : null,
            expectedFaceId,
            matched,
            acceptedBy: acceptedBy || null,
            foreignTopSkipped: !!foreignTopSkipped,
            reason: reason || null,
            faceEnrolled: !!selectedInstance?.faceEnrolled,
            rekognitionFaceId: selectedInstance?.rekognitionFaceId || null,
            collection: process.env.REKOGNITION_COLLECTION_ID || null,
          })
        );
        const shouldBlock = matched !== true;
        console.log(
          JSON.stringify({
            requestId,
            stage: "face_verify_decision",
            packageInstanceId: selectedInstance?._id?.toString?.() || null,
            activeInstanceId: selectedInstance?._id?.toString?.() || null,
            expectedFaceId,
            matchedFaceId: matchedFaceId || null,
            similarity: exactSimilarity,
            threshold: typeof threshold === "number" ? threshold : null,
            matched: matched === true,
            decision: shouldBlock ? "BLOCK" : "ALLOW",
          })
        );
        stage = "face_verify_decision";
        if (shouldBlock) {
          console.log(
            JSON.stringify({
              requestId,
              stage: "face_verify_mismatch",
              similarity: exactSimilarity,
              matchedFaceId: matchedFaceId || null,
              topFaceId: topFaceId || null,
              topSimilarity: typeof topSimilarity === "number" ? topSimilarity : null,
              topExternalImageId: topExternalImageId || null,
              expectedExternalImageId: selectedInstance?._id?.toString?.() || null,
              matchCount: typeof matchCount === "number" ? matchCount : null,
              allMatchExternalImageIdsSample: allMatchExternalImageIdsSample || [],
              foreignTopSkipped: !!foreignTopSkipped,
              expectedFaceId,
              threshold: typeof threshold === "number" ? threshold : null,
              reason: reason || "FACE_MATCH_NOT_FOUND",
            })
          );
          await releaseReservedQuota();
          const errorCode =
            reason === "NO_FACE_FOUND"
              ? "NO_FACE_FOUND"
              : reason === "FACE_MISMATCH_BELOW_THRESHOLD"
                ? "FACE_MISMATCH_BELOW_THRESHOLD"
                : "FACE_MATCH_NOT_FOUND";
          const message =
            errorCode === "NO_FACE_FOUND"
              ? "No face found in image."
              : errorCode === "FACE_MISMATCH_BELOW_THRESHOLD"
                ? "Face mismatch (below threshold)."
                : "No matching enrolled face found.";
          return sendErr(req, res, 403, message, {
            code: errorCode,
            similarity:
              errorCode === "FACE_MISMATCH_BELOW_THRESHOLD"
                ? exactSimilarity
                : typeof topSimilarity === "number"
                  ? topSimilarity
                  : null,
            ...(process.env.NODE_ENV !== "production"
              ? {
                  debug: {
                    expectedFaceId,
                    matchedFaceId: matchedFaceId || null,
                    topFaceId: topFaceId || null,
                    similarity: exactSimilarity,
                    topSimilarity: typeof topSimilarity === "number" ? topSimilarity : null,
                    topExternalImageId: topExternalImageId || null,
                    expectedExternalImageId: selectedInstance?._id?.toString?.() || null,
                    acceptedBy: acceptedBy || null,
                    matchCount: typeof matchCount === "number" ? matchCount : null,
                    allMatchExternalImageIdsSample: allMatchExternalImageIdsSample || [],
                    foreignTopSkipped: !!foreignTopSkipped,
                    threshold: typeof threshold === "number" ? threshold : null,
                    reason: reason || null,
                  },
                }
              : {}),
          });
        }
      } catch (e) {
        throw e;
      }
    }

    // 3) Build blueprint with recent-memory diversity
    stage = "blueprint_start";
    console.log(
      JSON.stringify({
        requestId,
        stage,
        packageInstanceId: selectedInstance?._id?.toString?.() || null,
        activeInstanceId: selectedInstance?._id?.toString?.() || null,
      })
    );
    const ctx = {
      goal: req.body?.goal || "subs",
      timezone: typeof user?.timezone === "string" && user.timezone ? user.timezone : "Europe/Athens",
      linkBase: req.body?.linkBase,
      imageHash,
    };
    const explorationRate = Number.isFinite(Number(process.env.RECO_EXPLORATION_RATE))
      ? Math.max(0, Math.min(1, Number(process.env.RECO_EXPLORATION_RATE)))
      : 0.25;
    const minFeedbackPosts = Number.isFinite(Number(process.env.RECO_MIN_FEEDBACK_POSTS))
      ? Math.max(1, Number(process.env.RECO_MIN_FEEDBACK_POSTS))
      : 10;

    let recentRecommendationHistory = {
      variantIdsByKey: {},
      countsByKey: {},
      captionTextHashes: [],
    };
    let recommendationPerformanceData = {};
    try {
      const [historyData, performanceData] = await Promise.all([
        fetchRecentRecommendationHistory(user._id, selectedInstance._id, 120),
        fetchRecommendationPerformance(user._id, selectedInstance._id),
      ]);
      recentRecommendationHistory = historyData;
      recommendationPerformanceData = performanceData;
    } catch (historyErr) {
      log(requestId, "recommendation_history_fetch_failed", { message: historyErr?.message });
    }

    let promotion;
    let meta;
    try {
      const out = buildPromotionBlueprint(visionData, ctx, {
        recentHistory: recentRecommendationHistory,
        performanceData: recommendationPerformanceData,
        variantSelection: {
          explorationRate,
          minFeedbackPosts,
        },
      });
      promotion = out.promotion;
      meta = out.meta;
      if (!promotion) {
        return respondErr(500, "Failed to build promotion plan.", { stage: "blueprint", out });
      }
      log(requestId, "blueprint_done", {
        packageInstanceId: selectedInstance?._id?.toString?.() || null,
        activeInstanceId: selectedInstance?._id?.toString?.() || null,
        niche: promotion?.niche,
        csl: promotion?.contentSafety?.csl,
        policiesVersion: meta?.policiesVersion,
        poolsVersion: meta?.poolsVersion,
        sourcesVersion: meta?.sourcesVersion,
        engineVersion: meta?.engineVersion,
        platforms: (promotion?.recommendedPlatforms || []).map((r) => r.platform),
      });
    } catch (e) {
      log(requestId, "blueprint_error", { message: e?.message });
      return respondErr(500, "Failed to build promotion plan.", {
        stage: "blueprint_throw",
        message: e?.message,
      });
    }
    stage = "blueprint_done";

    // 4) Captions (optional): multi-style candidates + recency scoring
    const tCap0 = Date.now();
    const selectedCaptionHistoryEntries = [];
    try {
      if (!skipCaptions && Array.isArray(promotion.recommendedPlatforms)) {
        stage = "openai_start";
        console.log(
          JSON.stringify({
            requestId,
            stage,
            packageInstanceId: selectedInstance?._id?.toString?.() || null,
            activeInstanceId: selectedInstance?._id?.toString?.() || null,
          })
        );
        log(requestId, "openai_start");
        const recentResults = await Result.find({
          ...buildResultScope(user),
          packageInstanceId: selectedInstance._id,
        })
          .sort({ createdAt: -1 })
          .limit(60);

        const recentCaps = recentResults
          .flatMap((r) => (r.promotion?.recommendedPlatforms || []).map((x) => x.caption).filter(Boolean))
          .map(normalizeCaptionText)
          .filter(Boolean);
        const recentCapHashes = new Set(
          recentCaps.map((caption) => textHash(caption)).filter(Boolean)
        );
        for (const hash of recentRecommendationHistory.captionTextHashes || []) {
          if (hash) recentCapHashes.add(hash);
        }

        const { recommendationPools, sources } = getPolicies();
        const withCaptions = await Promise.all(
          promotion.recommendedPlatforms.map(async (rec) => {
            try {
              const stylePool =
                recommendationPools?.captionStyles?.[rec.platform] ||
                recommendationPools?.captionStyles?.default ||
                [];
              const styleCandidates = selectCaptionStyleCandidates(
                stylePool,
                rec?.selectedIds?.captionStyleId || null,
                3
              );

              const dynamicForPlatform = {
                platform: rec.platform,
                bestPostTime: (rec.bestTimesLocal && rec.bestTimesLocal[0]) || "18:00",
                tip: (promotion.ctaVariants && promotion.ctaVariants[0]) || "",
                hashtags: rec.hashtags || [],
              };
              const sourcePolicy = findSourcePolicy(sources, rec.platform);
              const sourceBannedPhrases = Array.isArray(sourcePolicy?.bannedPhrases)
                ? sourcePolicy.bannedPhrases
                : [];

              let bestCaption = "";
              let bestStyleId = rec?.selectedIds?.captionStyleId || null;
              let bestScore = Number.POSITIVE_INFINITY;

              for (const style of styleCandidates) {
                const avoidPhrases = [
                  ...recentCaps.slice(0, 14),
                  ...sourceBannedPhrases,
                  ...(Array.isArray(style?.avoidTerms) ? style.avoidTerms : []),
                ];
                const candidate = await generateCaptionWithOpenAI(visionData, dynamicForPlatform, {
                  requestId,
                  styleDirective: style?.promptAddon || "",
                  avoidPhrases,
                });
                const normalizedCandidate = normalizeCaptionText(candidate);
                if (!normalizedCandidate) continue;

                let duplicateHits = 0;
                for (const prior of recentCaps) {
                  if (isNearDuplicate(normalizedCandidate, prior)) duplicateHits += 1;
                }
                const hash = textHash(normalizedCandidate);
                if (hash && recentCapHashes.has(hash)) duplicateHits += 2;

                const score = duplicateHits * 1000 + normalizedCandidate.length;
                if (score < bestScore) {
                  bestScore = score;
                  bestCaption = candidate;
                  bestStyleId = style?.id || bestStyleId;
                }
              }

              if (!bestCaption) {
                const avoidPhrases = [
                  ...recentCaps.slice(0, 14),
                  ...sourceBannedPhrases,
                ];
                bestCaption = await generateCaptionWithOpenAI(visionData, dynamicForPlatform, {
                  requestId,
                  styleDirective: "Use a different structure and hook than previous posts.",
                  avoidPhrases,
                });
              }

              const normalizedBestCaption = normalizeCaptionText(bestCaption);
              const bestCaptionHash = textHash(normalizedBestCaption);
              if (bestCaptionHash) {
                recentCapHashes.add(bestCaptionHash);
                selectedCaptionHistoryEntries.push({
                  kind: "caption",
                  platform: rec.platform,
                  variantId: bestStyleId || "caption_style_fallback",
                  textHash: bestCaptionHash,
                });
              }

              return {
                ...rec,
                caption: bestCaption || rec.caption || "",
                selectedIds: {
                  ...(rec.selectedIds || {}),
                  captionStyleId: bestStyleId || rec?.selectedIds?.captionStyleId || null,
                },
              };
            } catch (e) {
              log(requestId, "caption_error", { platform: rec.platform, message: e?.message });
              return rec;
            }
          })
        );
        promotion.recommendedPlatforms = withCaptions;
        log(requestId, "openai_done", { duration_ms: Date.now() - tCap0 });
        stage = "openai_done";
        console.log(
          JSON.stringify({
            requestId,
            stage,
            packageInstanceId: selectedInstance?._id?.toString?.() || null,
            activeInstanceId: selectedInstance?._id?.toString?.() || null,
          })
        );
      }
    } catch (e) {
      log(requestId, "openai_error", { message: e?.message, code: e?.code || null });
      log(requestId, "caption_loop_error", { message: e?.message });
    }
    log(requestId, "captions_done", { skipped: !!skipCaptions, duration_ms: Date.now() - tCap0 });

    const primaryRec = Array.isArray(promotion?.recommendedPlatforms)
      ? promotion.recommendedPlatforms[0] || null
      : null;
    promotion.selectedIds = {
      platformMixId: promotion?.selectedIds?.platformMixId || null,
      hashtagPackId: primaryRec?.selectedIds?.hashtagPackId || null,
      timePackId: primaryRec?.selectedIds?.timePackId || null,
      captionStyleId: primaryRec?.selectedIds?.captionStyleId || null,
      ctaId:
        promotion?.selectedIds?.ctaId ||
        primaryRec?.selectedIds?.ctaId ||
        null,
    };

    let uploadKey = null;
    let uploadSucceeded = false;
    let imageUrl = null;
    try {
      stage = "r2_upload_start";
      console.log(
        JSON.stringify({
          requestId,
          stage,
          packageInstanceId: selectedInstance?._id?.toString?.() || null,
          activeInstanceId: selectedInstance?._id?.toString?.() || null,
        })
      );
      const userId = user?._id?.toString?.() || user?.id || "unknown-user";
      const packageInstanceId = selectedInstance?._id?.toString?.() || "unknown-instance";
      uploadKey = `uploads/${userId}/${packageInstanceId}/${imageHash}.${uploadExt}`;
      await putObject(uploadKey, inputBuffer, uploadMime);
      uploadSucceeded = true;
      imageUrl = buildPublicUrl(uploadKey) || null;
      stage = "r2_upload_done";
      console.log(
        JSON.stringify({
          requestId,
          stage,
          packageInstanceId: selectedInstance?._id?.toString?.() || null,
          activeInstanceId: selectedInstance?._id?.toString?.() || null,
        })
      );
      if (process.env.NODE_ENV !== "production") {
        log(requestId, "image_upload_succeeded", { key: uploadKey });
      }
    } catch (uploadErr) {
      uploadKey = null;
      uploadSucceeded = false;
      imageUrl = null;
      log(requestId, "image_upload_failed", {
        key: uploadKey || null,
        message: uploadErr?.message || String(uploadErr),
      });
    }

    // 5) Save
    let newResult;
    try {
      stage = "result_save_start";
      console.log(
        JSON.stringify({
          requestId,
          stage,
          packageInstanceId: selectedInstance?._id?.toString?.() || null,
          activeInstanceId: selectedInstance?._id?.toString?.() || null,
        })
      );
      const metaWithImage = {
        ...(meta && typeof meta === "object" ? meta : {}),
        ...(uploadSucceeded && uploadKey ? { imageKey: uploadKey } : {}),
        ...(imageUrl ? { imageUrl, thumbnailUrl: imageUrl } : {}),
      };
      newResult = await Result.create({
        userId: user?._id || null,
        email,
        packageInstanceId: selectedInstance ? selectedInstance._id : null,
        csl: promotion?.contentSafety?.csl ?? 0,
        niche: promotion?.niche || "general",
        hasFace: !!promotion?.hasFace,
        status: "ready",
        stage: "done",
        imageHash,
        captionsGenerated: !skipCaptions,
        promotion,
        meta: metaWithImage,
      });
      stage = "result_save_done";
      console.log(
        JSON.stringify({
          requestId,
          stage,
          packageInstanceId: selectedInstance?._id?.toString?.() || null,
          activeInstanceId: selectedInstance?._id?.toString?.() || null,
        })
      );
    } catch (e) {
      log(requestId, "db_save_error", { message: e?.message });
      return respondErr(500, "Failed to save result.", { stage: "db_save", message: e?.message });
    }

    try {
      const historyEntries = [];
      const niche = promotion?.niche || null;
      const csl = promotion?.contentSafety?.csl ?? null;
      const baseEntry = {
        userId: user._id,
        packageInstanceId: selectedInstance._id,
        niche,
        csl,
        imageHash: imageHash || null,
        resultId: newResult._id,
      };

      if (promotion?.selectedIds?.platformMixId) {
        historyEntries.push({
          ...baseEntry,
          kind: "platformMix",
          platform: null,
          variantId: promotion.selectedIds.platformMixId,
        });
      }

      for (const rec of promotion?.recommendedPlatforms || []) {
        if (rec?.selectedIds?.timePackId) {
          historyEntries.push({
            ...baseEntry,
            kind: "times",
            platform: rec.platform || null,
            variantId: rec.selectedIds.timePackId,
          });
        }
        if (rec?.selectedIds?.hashtagPackId) {
          historyEntries.push({
            ...baseEntry,
            kind: "hashtags",
            platform: rec.platform || null,
            variantId: rec.selectedIds.hashtagPackId,
          });
        }
        if (rec?.selectedIds?.ctaId) {
          historyEntries.push({
            ...baseEntry,
            kind: "cta",
            platform: rec.platform || null,
            variantId: rec.selectedIds.ctaId,
          });
        }
      }

      for (const selected of selectedCaptionHistoryEntries) {
        historyEntries.push({
          ...baseEntry,
          kind: "caption",
          platform: selected.platform || null,
          variantId: selected.variantId,
          textHash: selected.textHash || null,
        });
      }

      if (historyEntries.length > 0) {
        await RecommendationHistory.insertMany(historyEntries, { ordered: false });
      }
    } catch (historyWriteErr) {
      log(requestId, "recommendation_history_write_failed", {
        message: historyWriteErr?.message,
      });
    }

    quotaReserved = false;

    // 6) Done
    return res.json({
      message: "Image analyzed successfully!",
      requestId,
      insights: newResult.toObject(),
      durations: { total_ms: Date.now() - t0, vision_ms: Date.now() - tVision0, captions_ms: skipCaptions ? 0 : (Date.now() - tCap0) },
    });
  } catch (error) {
    const errName = error?.name || "Error";
    const errMessage = error?.message || "Unknown error";
    const errStackTop = String(error?.stack || "")
      .split("\n")
      .slice(0, 5);
    console.log(
      JSON.stringify({
        requestId,
        stage,
        errName,
        errMessage,
        errStackTop,
      })
    );
    try {
      await releaseReservedQuota();
    } catch {}
    const rekognitionErrorNames = new Set([
      "AccessDeniedException",
      "ThrottlingException",
      "InvalidParameterException",
      "ProvisionedThroughputExceededException",
      "ResourceNotFoundException",
      "InternalServerError",
      "NetworkingError",
      "TimeoutError",
    ]);
    if (String(stage).startsWith("face_verify") || rekognitionErrorNames.has(String(errName))) {
      return sendErr(req, res, 403, "Face verification failed.", {
        code: "FACE_VERIFY_FAILED",
      });
    }
    return sendErr(req, res, 500, "Analyze failed.", {
      code: "ANALYZE_FAILED",
    });
  } finally {
    log(requestId, "analyze_done", { duration_ms: Date.now() - t0 });
    try { await fs.unlink(filePath); } catch {}
    await releaseReservedQuota();
  }
};

// GET /api/analyze?email=&page=&limit=&packageInstanceId=
const fetchAnalysisHistory = async (req, res) => {
  const { page = 1, limit = 10, packageInstanceId } = req.query;
  if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");

  try {
    const scope = buildResultScope(req.user);
    const filter = packageInstanceId ? { $and: [scope, { packageInstanceId }] } : scope;
    if (packageInstanceId) {
      if (!mongoose.Types.ObjectId.isValid(packageInstanceId)) {
        return sendErr(req, res, 400, "Invalid packageInstanceId");
      }
      const instance = await PackageInstance.findOne({
        _id: packageInstanceId,
        userId: req.user.id,
      });
      if (!instance) {
        return sendErr(req, res, 403, "Package instance not owned by user");
      }
    }
    const results = await Result.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Result.countDocuments(filter);
    res.json({ results, total });
  } catch (error) {
    return sendErr(req, res, 500, "Failed to fetch results", { message: error?.message });
  }
};


const deleteAnalysisResult = async (req, res) => {
  const { id } = req.params;
  if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");
  try {
    const result = await Result.findOneAndDelete({
      _id: id,
      ...buildResultScope(req.user),
    });
    if (!result) return sendErr(req, res, 404, "Result not found");
    res.json({ message: "Result deleted successfully", result });
  } catch (error) {
    return sendErr(req, res, 500, "Failed to delete result", { message: error?.message });
  }
};


// GET /api/analyze/:id
const getAnalysisById = async (req, res) => {
  const { id } = req.params;
  if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return sendErr(req, res, 400, "Invalid id");
  }
  try {
    const doc = await Result.findOne({ _id: id, ...buildResultScope(req.user) });
    if (!doc) return sendErr(req, res, 404, "Result not found");
    return res.json(doc);
  } catch (e) {
    console.error("getAnalysisById error:", e);
    return sendErr(req, res, 500, "Failed to fetch result");
  }
};

// PATCH /api/analyze/:id
const updateAnalysisResult = async (req, res) => {
  const { id } = req.params;
  if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return sendErr(req, res, 400, "Invalid id");
  }

  // whitelist updatable fields
  const set = {};
  if (req.body && typeof req.body === "object") {
    if (req.body.promotion) set.promotion = req.body.promotion; // captions/hashtags edits, etc.
    if (req.body.meta?.userNotes !== undefined) set["meta.userNotes"] = req.body.meta.userNotes;
  }

  try {
    const updated = await Result.findOneAndUpdate(
      { _id: id, ...buildResultScope(req.user) },
      { $set: set },
      { new: true }
    );
    if (!updated) return sendErr(req, res, 404, "Result not found");
    return res.json(updated);
  } catch (e) {
    console.error("updateAnalysisResult error:", e);
    return sendErr(req, res, 500, "Failed to update result");
  }
};

module.exports = { analyzeImage, fetchAnalysisHistory, getAnalysisById, deleteAnalysisResult, updateAnalysisResult };
