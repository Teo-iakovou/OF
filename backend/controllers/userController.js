/* eslint-disable @typescript-eslint/no-require-imports */
// controllers/userController.js
const User = require("../models/user");
const Result = require("../models/result");
const PackageInstance = require("../models/packageInstance");
const mongoose = require("mongoose");
const { sendQuotaError } = require("../utils/quotaError");
const { planLimit } = require("../middleware/chatLimits");

const makeRequestId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const toInstanceSummary = (instance) => ({
  id: instance._id.toString(),
  planKey: instance.planKey,
  uploadsUsed: instance.uploadsUsed,
  uploadLimit: instance.uploadLimit,
  sadtalkerVideosUsed: instance.sadtalkerVideosUsed,
  sadtalkerVideoLimit: instance.sadtalkerVideoLimit,
  sadtalkerPrimaryImageHash: instance.sadtalkerPrimaryImageHash,
  personaBound: instance.personaBound,
  createdAt: instance.createdAt,
});

const getUserDashboard = async (req, res) => {
  if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

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
    res.status(500).json({ error: "Failed to fetch dashboard data" });
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
  const { packageId } = req.body || {};

  if (!req.user || !req.user.id || !packageId) {
    return res.status(400).json({ error: "Package ID required" });
  }

  try {
    let user = await User.findById(req.user.id);

    const uploadLimit = PACKAGE_LIMITS[packageId] || 0;
    const sadtalkerVideoLimit = getSadTalkerPlanLimit(packageId);
    const chatMonthlyLimit = planLimit(packageId);

    if (!user) {
      const email = req.user.email || "";
      user = new User({
        email,
        purchasedPackage: packageId,
      });
    } else {
      user.purchasedPackage = packageId;
    }

    await user.save();
    const instance = await PackageInstance.create({
      userId: user._id,
      planKey: packageId,
      status: "active",
      uploadLimit,
      uploadsUsed: 0,
      chatMonthlyLimit,
      chatUsedThisCycle: 0,
      chatCycleEndsAt: null,
      sadtalkerVideoLimit,
      sadtalkerVideosUsed: 0,
      sadtalkerPrimaryImageHash: null,
      personaBound: false,
      rekognitionFaceId: null,
    });
    if (instance.userId && instance.userId.toString() === user._id.toString()) {
      user.activePackageInstanceId = instance._id;
      await user.save();
    }
    res.json({ message: "Package purchased successfully!", user, instance });
  } catch (error) {
    console.error("Error purchasing package:", error);
    res.status(500).json({ error: "Purchase failed" });
  }
};

const checkUserPackage = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let selectedInstance = null;
    if (user.activePackageInstanceId) {
      selectedInstance = await PackageInstance.findOne({
        _id: user.activePackageInstanceId,
        userId: user._id,
        status: "active",
      });
    }
    if (!selectedInstance) {
      const instances = await PackageInstance.getActiveByUserId(user._id);
      selectedInstance = instances[0] || null;
    }

    if (!selectedInstance) {
      return res.json({ hasAccess: false, package: null });
    }

    const uploadsRemaining = selectedInstance.uploadLimit - selectedInstance.uploadsUsed;

    const plan = selectedInstance.planKey;
    const effectiveVideoLimit =
      selectedInstance.sadtalkerVideoLimit && selectedInstance.sadtalkerVideoLimit > 0
        ? selectedInstance.sadtalkerVideoLimit
        : getSadTalkerPlanLimit(plan);
    const videosUsed = selectedInstance.sadtalkerVideosUsed || 0;
    const videosRemaining =
      effectiveVideoLimit && effectiveVideoLimit > 0
        ? Math.max(0, effectiveVideoLimit - videosUsed)
        : null;

    res.json({
      hasAccess: true,
      package: plan,
      uploadsUsed: selectedInstance.uploadsUsed,
      uploadLimit: selectedInstance.uploadLimit,
      uploadsRemaining: uploadsRemaining < 0 ? 0 : uploadsRemaining,
      // SadTalker-specific counters (optional for callers)
      sadtalkerVideosUsed: videosUsed,
      sadtalkerVideoLimit: effectiveVideoLimit,
      sadtalkerVideosRemaining: videosRemaining,
      packageInstanceId: selectedInstance._id.toString(),
      expiresAt: selectedInstance.chatCycleEndsAt || null,
    });
  } catch (error) {
    console.error("Error checking package:", error);
    res.status(500).json({ error: "Failed to check package" });
  }
};

const listActivePackageInstances = async (req, res) => {
  const requestId = makeRequestId();
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized", requestId });
  }

  try {
    const instances = await PackageInstance.getActiveByUserId(req.user.id);
    return res.json({ instances: instances.map(toInstanceSummary) });
  } catch (error) {
    console.error("Error listing package instances:", error);
    return res.status(500).json({ error: "Failed to list package instances", requestId });
  }
};

const selectPackageInstance = async (req, res) => {
  const requestId = makeRequestId();
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized", requestId });
  }

  const { packageInstanceId } = req.body || {};
  if (!packageInstanceId || !mongoose.isValidObjectId(packageInstanceId)) {
    return res.status(400).json({ error: "packageInstanceId required", requestId });
  }

  try {
    const instance = await PackageInstance.findOne({
      _id: packageInstanceId,
      userId: req.user.id,
      status: "active",
    });
    if (!instance) {
      return res.status(404).json({ error: "Package instance not found", requestId });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found", requestId });

    user.activePackageInstanceId = instance._id;
    await user.save();

    return res.json({ instance: toInstanceSummary(instance) });
  } catch (error) {
    console.error("Error selecting package instance:", error);
    return res.status(500).json({ error: "Failed to select package instance", requestId });
  }
};

const consumeSadtalkerCredit = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let instance = null;
    if (user.activePackageInstanceId) {
      instance = await PackageInstance.findOne({
        _id: user.activePackageInstanceId,
        userId: user._id,
        status: "active",
      });
    }
    if (!instance) {
      const instances = await PackageInstance.getActiveByUserId(user._id);
      instance = instances[0] || null;
    }

    const isAdmin = !!user.isAdmin;
    if (!instance) {
      return sendQuotaError(res, 403, {
        message: "Video limit reached for your plan",
        feature: "talking_head",
        plan: null,
        remaining: 0,
        limit: null,
      });
    }

    const plan = instance.planKey || "lite";
    const planLimit =
      instance.sadtalkerVideoLimit && instance.sadtalkerVideoLimit > 0
        ? instance.sadtalkerVideoLimit
        : getSadTalkerPlanLimit(plan);
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
          remaining: Math.max(0, planLimit ? planLimit - used : 0),
          limit: planLimit || null,
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
        plan,
        videoLimit: null,
        videosUsed: instance.sadtalkerVideosUsed || 0,
        videosRemaining: null,
        unlimited: true,
        adminBypass: true,
      });
    }

    // Ultimate or explicit 0-limit = unlimited, but we still track usage count.
    if (plan === "ultimate" || planLimit === 0) {
      instance.sadtalkerVideosUsed = used + 1;
      await instance.save();
      return res.json({
        ok: true,
        userId: user._id.toString(),
        plan,
        videoLimit: null,
        videosUsed: instance.sadtalkerVideosUsed,
        videosRemaining: null,
        unlimited: true,
      });
    }

    if (used >= planLimit) {
      return sendQuotaError(res, 402, {
        message: "Video limit reached for your plan",
        feature: "talking_head",
        plan,
        remaining: Math.max(0, planLimit - used),
        limit: planLimit,
      });
    }

    instance.sadtalkerVideosUsed = used + 1;
    instance.sadtalkerVideoLimit = planLimit;
    await instance.save();

    const remaining = Math.max(0, planLimit - instance.sadtalkerVideosUsed);

    return res.json({
      ok: true,
      userId: user._id.toString(),
      plan,
      videoLimit: planLimit,
      videosUsed: instance.sadtalkerVideosUsed,
      videosRemaining: remaining,
      unlimited: false,
    });
  } catch (error) {
    console.error("Error consuming SadTalker credit:", error);
    return res.status(500).json({ error: "Failed to update video quota" });
  }
};

module.exports = {
  purchasePackage,
  checkUserPackage,
  getUserDashboard,
  listActivePackageInstances,
  selectPackageInstance,
  consumeSadtalkerCredit,
  getSadTalkerPlanLimit,
};
