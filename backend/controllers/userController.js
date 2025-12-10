/* eslint-disable @typescript-eslint/no-require-imports */
// controllers/userController.js
const User = require("../models/user");
const Result = require("../models/result");

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

    if (!user) {
      const email = req.user.email || "";
      user = new User({
        email,
        purchasedPackage: packageId,
        uploadLimit,
        uploadsUsed: 0,
        sadtalkerVideoLimit,
        sadtalkerVideosUsed: 0,
      });
    } else {
      user.purchasedPackage = packageId;
      user.uploadLimit = uploadLimit;
      user.sadtalkerVideoLimit = sadtalkerVideoLimit;
      user.sadtalkerVideosUsed = 0;
    }

    await user.save();
    res.json({ message: "Package purchased successfully!", user });
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

    if (!user || !user.purchasedPackage) {
      return res.json({ hasAccess: false });
    }

    const uploadsRemaining = user.uploadLimit - user.uploadsUsed;

    const plan = user.purchasedPackage;
    const effectiveVideoLimit =
      user.sadtalkerVideoLimit && user.sadtalkerVideoLimit > 0
        ? user.sadtalkerVideoLimit
        : getSadTalkerPlanLimit(plan);
    const videosUsed = user.sadtalkerVideosUsed || 0;
    const videosRemaining =
      effectiveVideoLimit && effectiveVideoLimit > 0
        ? Math.max(0, effectiveVideoLimit - videosUsed)
        : null;

    res.json({
      hasAccess: true,
      package: plan,
      uploadsUsed: user.uploadsUsed,
      uploadLimit: user.uploadLimit,
      uploadsRemaining: uploadsRemaining < 0 ? 0 : uploadsRemaining,
      // SadTalker-specific counters (optional for callers)
      sadtalkerVideosUsed: videosUsed,
      sadtalkerVideoLimit: effectiveVideoLimit,
      sadtalkerVideosRemaining: videosRemaining,
    });
  } catch (error) {
    console.error("Error checking package:", error);
    res.status(500).json({ error: "Failed to check package" });
  }
};

const consumeSadtalkerCredit = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const plan = user.purchasedPackage || "lite";
    const isAdmin = !!user.isAdmin;

    const imageHash =
      req.body && typeof req.body.imageHash === "string" ? req.body.imageHash.trim() : "";

    // Single-face restriction for non-ultimate, non-admin users.
    if (!isAdmin && plan !== "ultimate" && imageHash) {
      if (!user.sadtalkerPrimaryImageHash) {
        user.sadtalkerPrimaryImageHash = imageHash;
      } else if (user.sadtalkerPrimaryImageHash !== imageHash) {
        return res.status(403).json({
          error:
            "Your current plan allows videos for one face image only. Please reuse your original photo or upgrade to the Ultimate plan.",
          code: "face_mismatch",
          plan,
        });
      }
    }

    // Admins bypass limits but we still persist the primary image if present.
    if (isAdmin) {
      await user.save();
      return res.json({
        ok: true,
        userId: user._id.toString(),
        plan,
        videoLimit: null,
        videosUsed: user.sadtalkerVideosUsed || 0,
        videosRemaining: null,
        unlimited: true,
        adminBypass: true,
      });
    }

    const planLimit = getSadTalkerPlanLimit(plan);
    const used = user.sadtalkerVideosUsed || 0;

    // Ultimate or explicit 0-limit = unlimited, but we still track usage count.
    if (plan === "ultimate" || planLimit === 0) {
      user.sadtalkerVideosUsed = used + 1;
      await user.save();
      return res.json({
        ok: true,
        userId: user._id.toString(),
        plan,
        videoLimit: null,
        videosUsed: user.sadtalkerVideosUsed,
        videosRemaining: null,
        unlimited: true,
      });
    }

    if (used >= planLimit) {
      return res.status(402).json({
        error: "Video limit reached for your plan",
        action: "upgrade",
        plan,
      });
    }

    user.sadtalkerVideosUsed = used + 1;
    user.sadtalkerVideoLimit = planLimit;
    await user.save();

    const remaining = Math.max(0, planLimit - user.sadtalkerVideosUsed);

    return res.json({
      ok: true,
      userId: user._id.toString(),
      plan,
      videoLimit: planLimit,
      videosUsed: user.sadtalkerVideosUsed,
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
  consumeSadtalkerCredit,
  getSadTalkerPlanLimit,
};
