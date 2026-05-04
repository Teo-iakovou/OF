/* eslint-disable @typescript-eslint/no-require-imports */
// controllers/userController.js
const User = require("../models/user");
const Result = require("../models/result");
const PackageInstance = require("../models/packageInstance");
const mongoose = require("mongoose");
const { sendQuotaError } = require("../utils/quotaError");
const { planLimit } = require("../middleware/chatLimits");
const { sendErr } = require("../utils/sendErr");
const { signUrl, objectExists } = require("../utils/s3");
const TOKENS_PER_LEGACY_CHAT_UNIT = 500;

const makeRequestId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const toIdString = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value.toString === "function") return value.toString().trim();
  return "";
};

const extractImageKey = (result) => {
  if (!result || typeof result !== "object") return "";
  if (typeof result.imageKey === "string" && result.imageKey.trim()) {
    return result.imageKey.trim();
  }
  if (
    result.meta &&
    typeof result.meta === "object" &&
    typeof result.meta.imageKey === "string" &&
    result.meta.imageKey.trim()
  ) {
    return result.meta.imageKey.trim();
  }
  return "";
};

const extractImageExt = (result) => {
  if (!result || typeof result !== "object") return "";
  if (typeof result.imageExt === "string" && result.imageExt.trim()) {
    return result.imageExt.trim().replace(/^\./, "").toLowerCase();
  }
  if (result.meta && typeof result.meta === "object") {
    if (typeof result.meta.imageExt === "string" && result.meta.imageExt.trim()) {
      return result.meta.imageExt.trim().replace(/^\./, "").toLowerCase();
    }
    if (typeof result.meta.uploadExt === "string" && result.meta.uploadExt.trim()) {
      return result.meta.uploadExt.trim().replace(/^\./, "").toLowerCase();
    }
  }
  return "";
};

const deriveImageKey = (result, ext = "jpg") => {
  if (!result || typeof result !== "object") return "";
  const userId = toIdString(result.userId);
  const packageInstanceId = toIdString(result.packageInstanceId);
  const imageHash = typeof result.imageHash === "string" ? result.imageHash.trim() : "";
  if (!userId || !packageInstanceId || !imageHash) return "";
  const safeExt = (ext || "jpg").replace(/^\./, "").toLowerCase() || "jpg";
  return `uploads/${userId}/${packageInstanceId}/${imageHash}.${safeExt}`;
};

const toLegacyTokenValue = (value, fallback = 0) => {
  const raw = Number(value);
  if (!Number.isFinite(raw) || raw < 0) return fallback;
  return raw > 5000 ? raw : raw * TOKENS_PER_LEGACY_CHAT_UNIT;
};

const resolveTokenBaseLimit = (instance) => {
  const planDefault = planLimit(instance?.planKey || "lite");
  if (typeof instance?.tokensLimit === "number" && instance.tokensLimit >= 0) {
    const tokensLimit = Number(instance.tokensLimit);
    if (tokensLimit > 0 || planDefault === 0) return tokensLimit;
  }
  if (typeof instance?.chatMonthlyLimit === "number" && instance.chatMonthlyLimit >= 0) {
    const legacyLimit = toLegacyTokenValue(instance.chatMonthlyLimit, 0);
    if (legacyLimit > 0 || planDefault === 0) return legacyLimit;
  }
  return planDefault;
};

const resolveVideoBaseLimit = (instance) => {
  const planDefault = getSadTalkerPlanLimit(instance?.planKey || null);
  if (typeof instance?.sadtalkerVideoLimit === "number") {
    const value = Number(instance.sadtalkerVideoLimit);
    if (value > 0 || planDefault === 0) return value;
  }
  return planDefault;
};

const toInstanceSummary = (instance) => {
  const addons = instance.addons || {};
  const addonsUploads = typeof addons.uploads === "number" ? addons.uploads : 0;
  const addonsChatTokens =
    typeof addons.chatTokens === "number"
      ? addons.chatTokens
      : typeof addons.chat === "number"
        ? addons.chat
        : 0;
  const addonsVideos = typeof addons.sadtalkerVideos === "number" ? addons.sadtalkerVideos : 0;

  const baseUploadLimit = typeof instance.uploadLimit === "number" ? instance.uploadLimit : 0;
  const effectiveUploadLimit = baseUploadLimit === 0 ? 0 : baseUploadLimit + addonsUploads;
  const uploadsRemaining =
    effectiveUploadLimit === 0 ? null : Math.max(0, effectiveUploadLimit - (instance.uploadsUsed || 0));

  const tokensLimitBase =
    resolveTokenBaseLimit(instance);
  const tokensUsed =
    typeof instance?.tokensUsed === "number"
      ? Number(instance.tokensUsed)
      : toLegacyTokenValue(instance?.chatUsedThisCycle ?? 0, 0);
  const effectiveChatLimit = tokensLimitBase === 0 ? 0 : tokensLimitBase + addonsChatTokens;
  const isChatUnlimited = effectiveChatLimit === 0;
  const chatRemaining = isChatUnlimited ? null : Math.max(0, effectiveChatLimit - tokensUsed);

  const baseVideoLimit = resolveVideoBaseLimit(instance);
  const effectiveVideoLimit = baseVideoLimit === 0 ? 0 : baseVideoLimit + addonsVideos;
  const videoRemaining =
    effectiveVideoLimit === 0
      ? null
      : Math.max(0, effectiveVideoLimit - (instance.sadtalkerVideosUsed || 0));
  const quotas = {
    uploads: {
      baseLimit: baseUploadLimit,
      addons: addonsUploads,
      effectiveLimit: effectiveUploadLimit,
      used: instance.uploadsUsed || 0,
      remaining: uploadsRemaining,
      isUnlimited: effectiveUploadLimit === 0,
    },
    aiTokens: {
      baseLimit: tokensLimitBase,
      addons: addonsChatTokens,
      effectiveLimit: effectiveChatLimit,
      used: tokensUsed,
      remaining: chatRemaining,
      isUnlimited: isChatUnlimited,
    },
    videos: {
      baseLimit: baseVideoLimit,
      addons: addonsVideos,
      effectiveLimit: effectiveVideoLimit,
      used: instance.sadtalkerVideosUsed || 0,
      remaining: videoRemaining,
      isUnlimited: effectiveVideoLimit === 0,
    },
  };

  return {
    id: instance._id.toString(),
    planKey: instance.planKey,
    status: instance.status,
    personaKey: instance.personaKey || null,
    uploadsUsed: instance.uploadsUsed,
    uploadLimit: instance.uploadLimit,
    tokensLimit: tokensLimitBase,
    tokensUsed,
    chatMonthlyLimit: tokensLimitBase,
    chatUsedThisCycle: tokensUsed,
    sadtalkerVideosUsed: instance.sadtalkerVideosUsed,
    sadtalkerVideoLimit: baseVideoLimit,
    sadtalkerPrimaryImageHash: instance.sadtalkerPrimaryImageHash,
    personaBound: instance.personaBound,
    createdAt: instance.createdAt,
    quotas,
    // Deprecated compatibility aliases (derived from `quotas`).
    addonsUploads,
    addonsChatTokens,
    addonsVideos,
    effectiveUploadLimit,
    effectiveChatLimit,
    
    effectiveVideoLimit,
    uploadsRemaining,
    chatRemaining,
    videoRemaining,
  };
};

const buildCheckPackagePayload = (instance) => {
  const addons = instance.addons || {};
  const addonsUploads = typeof addons.uploads === "number" ? addons.uploads : 0;
  const addonsChatTokens =
    typeof addons.chatTokens === "number"
      ? addons.chatTokens
      : typeof addons.chat === "number"
        ? addons.chat
        : 0;
  const addonsVideos = typeof addons.sadtalkerVideos === "number" ? addons.sadtalkerVideos : 0;

  const baseUploadLimit = typeof instance.uploadLimit === "number" ? instance.uploadLimit : 0;
  const effectiveUploadLimit = baseUploadLimit === 0 ? 0 : baseUploadLimit + addonsUploads;
  const uploadsRemaining =
    effectiveUploadLimit === 0
      ? null
      : Math.max(0, effectiveUploadLimit - (instance.uploadsUsed || 0));

  const chatCycleEndsAt = instance?.chatCycleEndsAt ?? null;
  const baseChatLimit =
    resolveTokenBaseLimit(instance);
  const usedChat =
    typeof instance?.tokensUsed === "number"
      ? Number(instance.tokensUsed)
      : toLegacyTokenValue(instance?.chatUsedThisCycle ?? 0, 0);
  const effectiveChatLimit = baseChatLimit === 0 ? 0 : baseChatLimit + addonsChatTokens;
  const isChatUnlimited = baseChatLimit === 0;
  const chatRemaining = isChatUnlimited ? null : Math.max(0, effectiveChatLimit - usedChat);

  const baseVideoLimit = resolveVideoBaseLimit(instance);
  const effectiveVideoLimit = baseVideoLimit === 0 ? 0 : baseVideoLimit + addonsVideos;
  const videosUsed = instance.sadtalkerVideosUsed || 0;
  const videosRemaining =
    effectiveVideoLimit === 0 ? null : Math.max(0, effectiveVideoLimit - videosUsed);
  const quotas = {
    uploads: {
      baseLimit: baseUploadLimit,
      addons: addonsUploads,
      effectiveLimit: effectiveUploadLimit,
      used: instance.uploadsUsed || 0,
      remaining: uploadsRemaining,
      isUnlimited: effectiveUploadLimit === 0,
    },
    aiTokens: {
      baseLimit: baseChatLimit,
      addons: addonsChatTokens,
      effectiveLimit: effectiveChatLimit,
      used: usedChat,
      remaining: chatRemaining,
      isUnlimited: effectiveChatLimit === 0,
    },
    videos: {
      baseLimit: baseVideoLimit,
      addons: addonsVideos,
      effectiveLimit: effectiveVideoLimit,
      used: videosUsed,
      remaining: videosRemaining,
      isUnlimited: effectiveVideoLimit === 0,
    },
  };

  return {
    hasAccess: true,
    package: instance.planKey,
    faceEnrolled: Boolean(instance.faceEnrolled),
    faceEnrolledAt: instance.faceEnrolledAt ?? null,
    rekognitionFaceId: instance.rekognitionFaceId ?? null,
    uploadsUsed: instance.uploadsUsed,
    uploadLimit: instance.uploadLimit,
    uploadsRemaining,
    addonsUploads,
    addonsChat: addonsChatTokens,
    addonsVideos,
    addons: {
      uploads: addonsUploads,
      chatTokens: addonsChatTokens,
      chat: addonsChatTokens,
      sadtalkerVideos: addonsVideos,
    },
    quotas,
    // Deprecated compatibility aliases (derived from `quotas`).
    effectiveUploadLimit,
    effectiveChatLimit,
    effectiveVideoLimit,
    tokensLimit: quotas.aiTokens.effectiveLimit,
    tokensUsed: quotas.aiTokens.used,
    chatMonthlyLimit: quotas.aiTokens.effectiveLimit,
    chatUsedThisCycle: quotas.aiTokens.used,
    chatRemaining: quotas.aiTokens.remaining,
    chatTokenLimit: quotas.aiTokens.baseLimit,
    chatTokensUsed: quotas.aiTokens.used,
    chatLimitTokens: quotas.aiTokens.effectiveLimit,
    chatUsedTokens: quotas.aiTokens.used,
    chatRemainingTokens: quotas.aiTokens.remaining,
    chatCycleEndsAt,
    nextReset: chatCycleEndsAt,
    expiresAt: chatCycleEndsAt,
    personaKey: instance.personaKey || null,
    // SadTalker-specific counters (optional for callers)
    sadtalkerVideosUsed: quotas.videos.used,
    sadtalkerVideoLimit: quotas.videos.effectiveLimit,
    sadtalkerVideosLimit: quotas.videos.baseLimit,
    sadtalkerVideosRemaining: quotas.videos.remaining,
    videosLimit: quotas.videos.baseLimit,
    videosUsed: quotas.videos.used,
    videosRemaining: quotas.videos.remaining,
    packageInstanceId: instance._id.toString(),
    packageInstanceCreatedAt: instance.createdAt,
  };
};

const getUserDashboard = async (req, res) => {
  if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");

  try {
    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 404, "User not found");

    const uploadsRemaining = user.uploadLimit - user.uploadsUsed;

    // Fetch recent analysis results (limit to 5–10 for now)
    const recentResults = await Result.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      email: user.email,
      package: user.purchasedPackage,
      uploadsUsed: user.uploadsUsed,
      uploadsRemaining: uploadsRemaining < 0 ? 0 : uploadsRemaining,
      recentResults,
    });
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return sendErr(req, res, 500, "Failed to fetch dashboard data");
  }
};

const normalizeProfileField = (value) => {
  if (value === null) return { ok: true, value: "" };
  if (typeof value !== "string") return { ok: false, value: "", reason: "MUST_BE_STRING" };
  const trimmed = value.trim();
  if (trimmed.length > 60) return { ok: false, value: "", reason: "MAX_LENGTH_60" };
  return { ok: true, value: trimmed };
};

const updateUserProfile = async (req, res) => {
  const requestId = req.requestId || null;
  if (!req.user || !req.user.id) {
    return sendErr(req, res, 401, "Unauthorized", {
      errorCode: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const hasFirstName = Object.prototype.hasOwnProperty.call(body, "firstName");
  const hasLastName = Object.prototype.hasOwnProperty.call(body, "lastName");
  if (!hasFirstName && !hasLastName) {
    return sendErr(req, res, 400, "Validation failed", {
      errorCode: "VALIDATION_ERROR",
      message: "At least one of firstName or lastName is required.",
    });
  }

  const next = {};
  if (hasFirstName) {
    const normalized = normalizeProfileField(body.firstName);
    if (!normalized.ok) {
      return sendErr(req, res, 400, "Validation failed", {
        errorCode: "VALIDATION_ERROR",
        message: "firstName must be a string with max length 60.",
        details: { field: "firstName", reason: normalized.reason },
      });
    }
    next.firstName = normalized.value;
  }
  if (hasLastName) {
    const normalized = normalizeProfileField(body.lastName);
    if (!normalized.ok) {
      return sendErr(req, res, 400, "Validation failed", {
        errorCode: "VALIDATION_ERROR",
        message: "lastName must be a string with max length 60.",
        details: { field: "lastName", reason: normalized.reason },
      });
    }
    next.lastName = normalized.value;
  }

  try {
    const user = await User.findById(req.user.id).select("_id email firstName lastName");
    if (!user) {
      return sendErr(req, res, 401, "Unauthorized", {
        errorCode: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const changedFields = Object.keys(next).filter((field) => user[field] !== next[field]);
    console.log({
      requestId,
      stage: "profile_update_start",
      userId: user._id.toString(),
      email: user.email,
      changedFields,
    });

    if (hasFirstName) user.firstName = next.firstName;
    if (hasLastName) user.lastName = next.lastName;
    await user.save();

    console.log({
      requestId,
      stage: "profile_update_done",
      userId: user._id.toString(),
      email: user.email,
      changedFields,
    });

    return res.json({
      requestId,
      user: {
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return sendErr(req, res, 500, "Failed to update profile", {
      errorCode: "INTERNAL_ERROR",
      message: "Failed to update profile.",
    });
  }
};

const PACKAGE_LIMITS = {
  lite: 10,
  pro: 50,
  ultimate: 9999,
};

// Per-plan talking-head / SadTalker video limits.
// 0 = unlimited for that plan (used for "ultimate").
const SADTALKER_PLAN_LIMITS = {
  lite: Number(process.env.SADTALKER_LITE_LIMIT || 10),
  pro: Number(process.env.SADTALKER_PRO_LIMIT || 50),
  ultimate: 0,
};

function getSadTalkerPlanLimit(plan) {
  if (!plan) return 0;
  return SADTALKER_PLAN_LIMITS[plan] ?? 0;
}

const purchasePackage = async (req, res) => {
  const requestId = req.requestId || null;
  return res.status(410).json({
    errorCode: "DEPRECATED_PURCHASE_ENDPOINT",
    message: "Use Stripe Checkout.",
    requestId,
  });
};

const checkUserPackage = async (req, res) => {
  if (!req.user || !req.user.id) {
    return sendErr(req, res, 401, "Unauthorized");
  }

  try {
    const requestId = req.requestId || null;
    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 404, "User not found");

    if (!user.activePackageInstanceId) {
      try {
        console.log("[check-package]", {
          requestId,
          userId: req.user.id,
          activePackageInstanceId: null,
          error: "ACTIVE_INSTANCE_REQUIRED",
        });
      } catch {}
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    const selectedInstance = await PackageInstance.findOne({
      _id: user.activePackageInstanceId,
      userId: user._id,
      status: "active",
    });

    if (!selectedInstance) {
      try {
        console.log("[check-package]", {
          requestId,
          userId: req.user.id,
          activePackageInstanceId: user.activePackageInstanceId || null,
          error: "ACTIVE_INSTANCE_REQUIRED",
        });
      } catch {}
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    const payload = buildCheckPackagePayload(selectedInstance);
    res.json(payload);
    try {
      console.log("[check-package]", {
        requestId,
        userId: req.user.id,
        activePackageInstanceId: user.activePackageInstanceId || null,
        hasAccess: true,
        packageInstanceId: payload.packageInstanceId || null,
      });
      if (process.env.NODE_ENV !== "production") {
        const addonsUploads =
          typeof selectedInstance?.addons?.uploads === "number" ? selectedInstance.addons.uploads : 0;
        const baseLimit =
          typeof selectedInstance?.uploadLimit === "number" ? selectedInstance.uploadLimit : null;
        console.log("[check-package][quota]", {
          requestId,
          packageInstanceId: payload.packageInstanceId || null,
          baseLimit,
          addonsUploads,
          uploadsUsed: typeof selectedInstance?.uploadsUsed === "number" ? selectedInstance.uploadsUsed : null,
          remaining: payload.uploadsRemaining ?? null,
        });
      }
    } catch {}
  } catch (error) {
    console.error("Error checking package:", error);
    return sendErr(req, res, 500, "Failed to check package");
  }
};

const listUserResults = async (req, res) => {
  if (!req.user || !req.user.id) {
    return sendErr(req, res, 401, "Unauthorized");
  }

  const requestId = req.requestId || null;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 404, "User not found");
    if (!user.activePackageInstanceId) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    const instance = await PackageInstance.findOne({
      _id: user.activePackageInstanceId,
      userId: user._id,
      status: "active",
    });
    if (!instance) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    const page = Math.max(1, Number(req.query?.page || 1));
    const limit = Math.max(1, Math.min(100, Number(req.query?.limit || 20)));
    const includeLegacy = String(req.query?.includeLegacy || "").toLowerCase() === "true";

    const baseQuery = {
      userId: user._id,
      packageInstanceId: instance._id,
    };
    const query = includeLegacy
      ? {
          userId: user._id,
          $or: [
            { packageInstanceId: instance._id },
            { packageInstanceId: { $exists: false } },
          ],
        }
      : baseQuery;

    const [results, total] = await Promise.all([
      Result.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Result.countDocuments(query),
    ]);

    const responseResults = results.map((doc) => {
      const plain = typeof doc?.toObject === "function" ? doc.toObject() : doc;
      const existingImageKey = extractImageKey(plain);
      if (existingImageKey) {
        plain.imageKey = existingImageKey;
        return plain;
      }
      const ext = extractImageExt(plain) || "jpg";
      const derived = deriveImageKey(plain, ext);
      if (derived) {
        plain.imageKey = derived;
      }
      return plain;
    });

    try {
      console.log("[results]", {
        requestId,
        userId: req.user.id,
        activePackageInstanceId: instance._id.toString(),
        countReturned: results.length,
      });
    } catch {}

    return res.json({ results: responseResults, total, page, limit, requestId });
  } catch (error) {
    console.error("Error listing results:", error);
    return sendErr(req, res, 500, "Failed to list results");
  }
};

const getUserResultImageUrl = async (req, res) => {
  if (!req.user || !req.user.id) {
    return sendErr(req, res, 401, "Unauthorized");
  }

  const requestId = req.requestId || null;
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return sendErr(req, res, 400, "Invalid result id");
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 404, "User not found");

    const result = await Result.findOne({
      _id: id,
      userId: user._id,
    }).lean();
    if (!result) {
      return sendErr(req, res, 404, "Result not found");
    }

    let imageKey = extractImageKey(result);
    if (!imageKey) {
      const knownExt = extractImageExt(result);
      if (knownExt) {
        imageKey = deriveImageKey(result, knownExt);
      } else {
        const candidates = ["jpg", "png", "webp"];
        for (const ext of candidates) {
          const candidateKey = deriveImageKey(result, ext);
          if (!candidateKey) continue;
          if (await objectExists(candidateKey)) {
            imageKey = candidateKey;
            break;
          }
        }
        if (!imageKey) {
          imageKey = deriveImageKey(result, "jpg");
        }
      }
    }

    if (!imageKey) {
      return sendErr(req, res, 404, "Missing imageKey for this result", {
        errorCode: "MISSING_IMAGE_KEY",
        message: "Missing imageKey for this result",
        requestId,
      });
    }
    if (!imageKey.startsWith("uploads/")) {
      return sendErr(req, res, 400, "Invalid image key");
    }

    const signed = await signUrl(imageKey, 60 * 60 * 24 * 7);

    return res.json({
      id: result._id,
      imageKey,
      url: signed,
      requestId,
    });
  } catch (error) {
    console.error("Error generating result image URL:", error);
    return sendErr(req, res, 500, "Failed to generate image URL");
  }
};

const listActivePackageInstances = async (req, res) => {
  const requestId = req.requestId || makeRequestId();
  if (!req.user || !req.user.id) {
    return sendErr(req, res, 401, "Unauthorized");
  }

  try {
    const instances = await PackageInstance.getActiveByUserId(req.user.id);
    return res.json({ instances: instances.map(toInstanceSummary) });
  } catch (error) {
    console.error("Error listing package instances:", error);
    return sendErr(req, res, 500, "Failed to list package instances");
  }
};

const grantAddons = async (req, res) => {
  if (!req.user || !req.user.id) {
    return sendErr(req, res, 401, "Unauthorized");
  }

  const { uploads, chat, sadtalkerVideos } = req.body || {};
  const provided = { uploads, chat, sadtalkerVideos };
  const keys = Object.keys(provided).filter((k) => provided[k] !== undefined);
  if (keys.length === 0) {
    return sendErr(req, res, 400, "No addons provided");
  }

  for (const key of keys) {
    const value = provided[key];
    if (!Number.isInteger(value) || value < 0) {
      return sendErr(req, res, 400, `${key} must be an integer >= 0`);
    }
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 404, "User not found");
    if (!user.activePackageInstanceId) {
      return sendErr(req, res, 404, "Active package instance not found");
    }

    const inc = {};
    if (uploads !== undefined) inc["addons.uploads"] = uploads;
    if (chat !== undefined) inc["addons.chat"] = chat;
    if (sadtalkerVideos !== undefined) inc["addons.sadtalkerVideos"] = sadtalkerVideos;

    const updated = await PackageInstance.findOneAndUpdate(
      {
        _id: user.activePackageInstanceId,
        userId: user._id,
        status: "active",
      },
      { $inc: inc },
      { new: true }
    );
    if (!updated) {
      return sendErr(req, res, 404, "Active package instance not found");
    }

    return res.json({
      ok: true,
      instance: toInstanceSummary(updated),
      checkPackage: buildCheckPackagePayload(updated),
    });
  } catch (error) {
    console.error("Error granting addons:", error);
    return sendErr(req, res, 500, "Failed to grant addons");
  }
};

const selectPackageInstance = async (req, res) => {
  const requestId = makeRequestId();
  if (!req.user || !req.user.id) {
    return sendErr(req, res, 401, "Unauthorized");
  }

  const { packageInstanceId } = req.body || {};
  if (!packageInstanceId || !mongoose.isValidObjectId(packageInstanceId)) {
    return sendErr(req, res, 400, "packageInstanceId required");
  }

  try {
    const instance = await PackageInstance.findOne({
      _id: packageInstanceId,
      userId: req.user.id,
      status: "active",
    });
    if (!instance) {
      return sendErr(req, res, 404, "Package instance not found");
    }

    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 404, "User not found");

    user.activePackageInstanceId = instance._id;
    await user.save();
    try {
      console.log("[select-package-instance]", {
        requestId,
        userId: req.user.id,
        packageInstanceId: instance._id.toString(),
      });
    } catch {}

    return res.json({
      activePackageInstanceId: instance._id.toString(),
      instance: toInstanceSummary(instance),
    });
  } catch (error) {
    console.error("Error selecting package instance:", error);
    return sendErr(req, res, 500, "Failed to select package instance");
  }
};

const consumeSadtalkerCredit = async (req, res) => {
  if (!req.user || !req.user.id) {
    return sendErr(req, res, 401, "Unauthorized");
  }

  try {
    const requestId = req.requestId || null;
    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 404, "User not found");

    const isAdmin = !!user.isAdmin;
    if (!user.activePackageInstanceId) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    const instance = await PackageInstance.findOne({
      _id: user.activePackageInstanceId,
      userId: user._id,
      status: "active",
    });
    if (!instance) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    const plan = instance.planKey || "lite";
    const baseLimit = resolveVideoBaseLimit(instance);
    const addonsVideos =
      typeof instance.addons?.sadtalkerVideos === "number" ? instance.addons.sadtalkerVideos : 0;
    const effectiveLimit = baseLimit === 0 ? 0 : baseLimit + addonsVideos;
    const used = instance.sadtalkerVideosUsed || 0;

    const imageHash =
      req.body && typeof req.body.imageHash === "string" ? req.body.imageHash.trim() : "";

    // Single-face restriction for non-ultimate, non-admin users.
    if (!isAdmin && plan !== "ultimate" && imageHash) {
      if (!instance.sadtalkerPrimaryImageHash) {
        instance.sadtalkerPrimaryImageHash = imageHash;
      } else if (instance.sadtalkerPrimaryImageHash !== imageHash) {
        return sendQuotaError(res, 403, {
          message:
            "Your current plan allows videos for one face image only. Please reuse your original photo or upgrade to the Ultimate plan.",
          feature: "talking_head",
          plan,
          remaining: Math.max(0, effectiveLimit - used),
          limit: baseLimit || null,
          requestId,
        });
      }
    }

    // Admins bypass limits but we still persist the primary image if present.
    if (isAdmin) {
      if (imageHash && !instance.sadtalkerPrimaryImageHash) {
        instance.sadtalkerPrimaryImageHash = imageHash;
      }
      await instance.save();
      return res.json({
        ok: true,
        userId: user._id.toString(),
        packageInstanceId: instance._id.toString(),
        personaKey: instance.personaKey || null,
        plan,
        videoLimit: null,
        videosUsed: instance.sadtalkerVideosUsed || 0,
        videosRemaining: null,
        unlimited: true,
        adminBypass: true,
      });
    }

    // Ultimate or explicit 0-limit = unlimited, but we still track usage count.
    if (plan === "ultimate" || baseLimit === 0) {
      const update = {};
      if (imageHash && !instance.sadtalkerPrimaryImageHash) {
        update.sadtalkerPrimaryImageHash = imageHash;
      }
      const updated = await PackageInstance.findOneAndUpdate(
        {
          _id: instance._id,
          userId: user._id,
          status: "active",
        },
        {
          $inc: { sadtalkerVideosUsed: 1 },
          ...(Object.keys(update).length ? { $set: update } : {}),
        },
        { new: true }
      );
      if (!updated) {
        return sendErr(req, res, 500, "Failed to update video quota");
      }
      return res.json({
        ok: true,
        userId: user._id.toString(),
        packageInstanceId: instance._id.toString(),
        personaKey: instance.personaKey || null,
        plan,
        videoLimit: null,
        videosUsed: updated.sadtalkerVideosUsed,
        videosRemaining: null,
        unlimited: true,
      });
    }

    const remainingExpr = {
      $subtract: [
        {
          $add: [
            { $ifNull: ["$sadtalkerVideoLimit", 0] },
            { $ifNull: ["$addons.sadtalkerVideos", 0] },
          ],
        },
        { $ifNull: ["$sadtalkerVideosUsed", 0] },
      ],
    };

    const primaryFilter = imageHash
      ? {
          $or: [
            { sadtalkerPrimaryImageHash: imageHash },
            { sadtalkerPrimaryImageHash: { $in: [null, ""] } },
          ],
        }
      : {};

    const update = {};
    if (imageHash && !instance.sadtalkerPrimaryImageHash) {
      update.sadtalkerPrimaryImageHash = imageHash;
    }

    const setFields = { sadtalkerVideoLimit: baseLimit };
    if (imageHash && !instance.sadtalkerPrimaryImageHash) {
      setFields.sadtalkerPrimaryImageHash = imageHash;
    }

    const updated = await PackageInstance.findOneAndUpdate(
      {
        _id: instance._id,
        userId: user._id,
        status: "active",
        ...primaryFilter,
        $expr: {
          $or: [
            { $eq: ["$sadtalkerVideoLimit", 0] },
            { $gt: [remainingExpr, 0] },
          ],
        },
      },
      {
        $inc: { sadtalkerVideosUsed: 1 },
        $set: setFields,
      },
      { new: true }
    );

    if (!updated) {
      if (imageHash) {
        const current = await PackageInstance.findOne({
          _id: instance._id,
          userId: user._id,
          status: "active",
        });
        if (current?.sadtalkerPrimaryImageHash && current.sadtalkerPrimaryImageHash !== imageHash) {
          return sendQuotaError(res, 403, {
            message:
              "Your current plan allows videos for one face image only. Please reuse your original photo or upgrade to the Ultimate plan.",
            feature: "talking_head",
            plan,
            remaining: Math.max(0, effectiveLimit - used),
            limit: baseLimit || null,
            requestId,
          });
        }
      }
      return res.status(403).json({
        error: "Video limit reached for your plan",
        errorCode: "SADTALKER_NO_CREDITS",
        requestId,
      });
    }

    const remaining = Math.max(0, effectiveLimit - (updated.sadtalkerVideosUsed || 0));

    return res.json({
      ok: true,
      userId: user._id.toString(),
      packageInstanceId: instance._id.toString(),
      personaKey: instance.personaKey || null,
      plan,
      videoLimit: baseLimit,
      videosUsed: updated.sadtalkerVideosUsed,
      videosRemaining: remaining,
      unlimited: false,
    });
  } catch (error) {
    console.error("Error consuming SadTalker credit:", error);
    return sendErr(req, res, 500, "Failed to update video quota");
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HeyGen credit consumption
// Uses the same quota fields as SadTalker (shared video pool) but supports
// consuming multiple credits at once for longer videos (1 credit = 1 minute).
// ─────────────────────────────────────────────────────────────────────────────

const consumeHeygenCredit = async (req, res) => {
  if (!req.user || !req.user.id) {
    return sendErr(req, res, 401, "Unauthorized");
  }

  try {
    const requestId = req.requestId || null;
    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 404, "User not found");

    const isAdmin = !!user.isAdmin;
    if (!user.activePackageInstanceId) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    const instance = await PackageInstance.findOne({
      _id: user.activePackageInstanceId,
      userId: user._id,
      status: "active",
    });
    if (!instance) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    // creditsToConsume: how many quota units this video costs (1 per minute of audio)
    const rawCredits = Number(req.body?.creditsToConsume);
    const creditsToConsume = Number.isFinite(rawCredits)
      ? Math.max(1, Math.min(10, Math.ceil(rawCredits)))
      : 1;

    const plan = instance.planKey || "lite";
    const baseLimit = resolveVideoBaseLimit(instance);
    const addonsVideos =
      typeof instance.addons?.sadtalkerVideos === "number" ? instance.addons.sadtalkerVideos : 0;
    const effectiveLimit = baseLimit === 0 ? 0 : baseLimit + addonsVideos;
    const used = instance.sadtalkerVideosUsed || 0;

    const imageHash =
      req.body && typeof req.body.imageHash === "string" ? req.body.imageHash.trim() : "";

    // Single-face restriction for non-ultimate, non-admin users.
    if (!isAdmin && plan !== "ultimate" && imageHash) {
      if (!instance.sadtalkerPrimaryImageHash) {
        instance.sadtalkerPrimaryImageHash = imageHash;
      } else if (instance.sadtalkerPrimaryImageHash !== imageHash) {
        return sendQuotaError(res, 403, {
          message:
            "Your current plan allows videos for one face image only. Please reuse your original photo or upgrade to the Ultimate plan.",
          feature: "talking_head",
          plan,
          remaining: Math.max(0, effectiveLimit - used),
          limit: baseLimit || null,
          requestId,
        });
      }
    }

    // Admin bypass: unlimited, still tracks usage.
    if (isAdmin) {
      if (imageHash && !instance.sadtalkerPrimaryImageHash) {
        instance.sadtalkerPrimaryImageHash = imageHash;
      }
      await instance.save();
      return res.json({
        ok: true,
        userId: user._id.toString(),
        packageInstanceId: instance._id.toString(),
        personaKey: instance.personaKey || null,
        plan,
        videoLimit: null,
        videosUsed: (instance.sadtalkerVideosUsed || 0) + creditsToConsume,
        videosRemaining: null,
        unlimited: true,
        adminBypass: true,
        creditsConsumed: creditsToConsume,
      });
    }

    // Ultimate or explicit 0-limit = unlimited, still track usage.
    if (plan === "ultimate" || baseLimit === 0) {
      const update = {};
      if (imageHash && !instance.sadtalkerPrimaryImageHash) {
        update.sadtalkerPrimaryImageHash = imageHash;
      }
      const updated = await PackageInstance.findOneAndUpdate(
        { _id: instance._id, userId: user._id, status: "active" },
        {
          $inc: { sadtalkerVideosUsed: creditsToConsume },
          ...(Object.keys(update).length ? { $set: update } : {}),
        },
        { new: true }
      );
      if (!updated) {
        return sendErr(req, res, 500, "Failed to update video quota");
      }
      return res.json({
        ok: true,
        userId: user._id.toString(),
        packageInstanceId: instance._id.toString(),
        personaKey: instance.personaKey || null,
        plan,
        videoLimit: null,
        videosUsed: updated.sadtalkerVideosUsed,
        videosRemaining: null,
        unlimited: true,
        creditsConsumed: creditsToConsume,
      });
    }

    // Limited plan: atomic check that remaining >= creditsToConsume.
    const remainingExpr = {
      $subtract: [
        {
          $add: [
            { $ifNull: ["$sadtalkerVideoLimit", 0] },
            { $ifNull: ["$addons.sadtalkerVideos", 0] },
          ],
        },
        { $ifNull: ["$sadtalkerVideosUsed", 0] },
      ],
    };

    const primaryFilter = imageHash
      ? {
          $or: [
            { sadtalkerPrimaryImageHash: imageHash },
            { sadtalkerPrimaryImageHash: { $in: [null, ""] } },
          ],
        }
      : {};

    const setFields = { sadtalkerVideoLimit: baseLimit };
    if (imageHash && !instance.sadtalkerPrimaryImageHash) {
      setFields.sadtalkerPrimaryImageHash = imageHash;
    }

    const updated = await PackageInstance.findOneAndUpdate(
      {
        _id: instance._id,
        userId: user._id,
        status: "active",
        ...primaryFilter,
        $expr: {
          $or: [
            { $eq: ["$sadtalkerVideoLimit", 0] },
            { $gte: [remainingExpr, creditsToConsume] },
          ],
        },
      },
      {
        $inc: { sadtalkerVideosUsed: creditsToConsume },
        $set: setFields,
      },
      { new: true }
    );

    if (!updated) {
      if (imageHash) {
        const current = await PackageInstance.findOne({
          _id: instance._id,
          userId: user._id,
          status: "active",
        });
        if (current?.sadtalkerPrimaryImageHash && current.sadtalkerPrimaryImageHash !== imageHash) {
          return sendQuotaError(res, 403, {
            message:
              "Your current plan allows videos for one face image only. Please reuse your original photo or upgrade to the Ultimate plan.",
            feature: "talking_head",
            plan,
            remaining: Math.max(0, effectiveLimit - used),
            limit: baseLimit || null,
            requestId,
          });
        }
      }
      return res.status(403).json({
        error: `Not enough video credits. This video requires ${creditsToConsume} credit(s).`,
        errorCode: "HEYGEN_NO_CREDITS",
        creditsRequired: creditsToConsume,
        remaining: Math.max(0, effectiveLimit - used),
        requestId,
      });
    }

    const remaining = Math.max(0, effectiveLimit - (updated.sadtalkerVideosUsed || 0));

    return res.json({
      ok: true,
      userId: user._id.toString(),
      packageInstanceId: instance._id.toString(),
      personaKey: instance.personaKey || null,
      plan,
      videoLimit: baseLimit,
      videosUsed: updated.sadtalkerVideosUsed,
      videosRemaining: remaining,
      unlimited: false,
      creditsConsumed: creditsToConsume,
    });
  } catch (error) {
    console.error("Error consuming HeyGen credit:", error);
    return sendErr(req, res, 500, "Failed to update video quota");
  }
};

module.exports = {
  purchasePackage,
  checkUserPackage,
  updateUserProfile,
  getUserDashboard,
  listActivePackageInstances,
  listUserResults,
  getUserResultImageUrl,
  selectPackageInstance,
  grantAddons,
  consumeSadtalkerCredit,
  consumeHeygenCredit,
  getSadTalkerPlanLimit,
};
