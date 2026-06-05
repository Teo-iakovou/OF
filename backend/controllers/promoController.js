/* eslint-disable @typescript-eslint/no-require-imports */
const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");
const PromoCode = require("../models/promoCode");
const { getQuotasForPlan } = require("../config/planQuotas");
const { sendErr } = require("../utils/sendErr");

const redeemPromoCode = async (req, res) => {
  const requestId = req.requestId || null;
  const userId = req.user?.id;
  if (!userId) return sendErr(req, res, 401, "Unauthorized");

  // 1. Require non-empty code in body
  const rawCode = req.body?.code;
  if (!rawCode || typeof rawCode !== "string" || !rawCode.trim()) {
    return res.status(400).json({ error: "PROMO_CODE_REQUIRED", requestId });
  }

  // 2. Normalize
  const code = rawCode.trim().toUpperCase();

  // 3. Lookup
  const promo = await PromoCode.findOne({ code }).lean();
  if (!promo) {
    return res.status(404).json({ error: "PROMO_CODE_INVALID", requestId });
  }

  // 4–7. Pre-flight validation (fast checks before hitting the atomic update)
  if (!promo.active) {
    return res.status(403).json({ error: "PROMO_CODE_INACTIVE", requestId });
  }
  const now = new Date();
  if (promo.expiresAt && promo.expiresAt <= now) {
    return res.status(403).json({ error: "PROMO_CODE_EXPIRED", requestId });
  }
  const alreadyUsed = promo.usedBy.some((id) => id.toString() === userId);
  if (alreadyUsed) {
    return res.status(409).json({ error: "PROMO_CODE_ALREADY_USED_BY_YOU", requestId });
  }
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
    return res.status(409).json({ error: "PROMO_CODE_EXHAUSTED", requestId });
  }

  // Atomic reservation — re-asserts all conditions to prevent races.
  // A null result means a concurrent request consumed the last use between
  // our pre-flight read and this update — we correctly return EXHAUSTED.
  const reserved = await PromoCode.findOneAndUpdate(
    {
      _id: promo._id,
      active: true,
      $and: [
        { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
        { $or: [{ maxUses: null }, { $expr: { $lt: ["$usedCount", "$maxUses"] } }] },
        { usedBy: { $ne: userId } },
      ],
    },
    { $inc: { usedCount: 1 }, $addToSet: { usedBy: userId } },
    { new: true }
  );

  if (!reserved) {
    return res.status(409).json({ error: "PROMO_CODE_EXHAUSTED", requestId });
  }

  // Create PackageInstance — mirrors the Stripe-path shape exactly.
  let instance;
  let user;
  try {
    user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found after reservation");
    }

    const { uploads: uploadLimit, tokensLimit, videos: sadtalkerLimit } = getQuotasForPlan(promo.planKey);

    instance = await PackageInstance.create({
      userId: user._id,
      planKey: promo.planKey,
      status: "active",
      uploadLimit,
      uploadsUsed: 0,
      tokensLimit,
      tokensUsed: 0,
      chatMonthlyLimit: tokensLimit,
      chatUsedThisCycle: 0,
      chatCycleEndsAt: null,
      sadtalkerVideoLimit: sadtalkerLimit,
      sadtalkerVideosUsed: 0,
      sadtalkerPrimaryImageHash: null,
      personaKey: null,
      personaBound: false,
      rekognitionFaceId: null,
      stripeCheckoutSessionId: `promo:${code}`,
      stripePaymentIntentId: null,
    });

    try {
      console.log("[promo:instance-created]", {
        requestId,
        userId,
        instanceId: instance._id.toString(),
        planKey: promo.planKey,
        code,
      });
    } catch {}
  } catch (err) {
    // Roll back the reservation so the code remains usable
    try {
      await PromoCode.updateOne(
        { _id: promo._id },
        { $inc: { usedCount: -1 }, $pull: { usedBy: userId } }
      );
      console.log("[promo:rollback-ok]", { requestId, userId, code });
    } catch (rollbackErr) {
      console.error("[promo:rollback-failed]", {
        requestId,
        userId,
        code,
        rollbackError: rollbackErr?.message || String(rollbackErr),
      });
    }
    console.error("[promo:instance-create-failed]", {
      requestId,
      userId,
      code,
      error: err?.message || String(err),
    });
    return res.status(500).json({ error: "PROMO_REDEEM_FAILED", requestId });
  }

  // Set active pointer — same conditional pattern as the Stripe webhook path.
  // Only auto-activate if the user has no other currently-active package;
  // returning users keep their current active instance and the frontend will
  // prompt them to switch via /api/user/select-package-instance.
  try {
    const hasOtherActive = await PackageInstance.exists({
      userId: user._id,
      status: "active",
      _id: { $ne: instance._id },
    });
    if (!hasOtherActive) {
      user.activePackageInstanceId = instance._id;
      await user.save();
      try {
        console.log("[promo:pointer-set]", {
          requestId,
          userId,
          instanceId: instance._id.toString(),
          planKey: promo.planKey,
        });
      } catch {}
    }
  } catch (err) {
    // Instance exists but pointer was not updated.
    // Log with instanceId so diagnoseUserPackages.js can detect and repair it.
    console.error("[promo:pointer-set-failed]", {
      requestId,
      userId,
      instanceId: instance._id.toString(),
      planKey: promo.planKey,
      error: err?.message || String(err),
    });
    // Do NOT roll back the code reservation — the instance was created successfully.
    // The user still received their package; only the active pointer needs repair.
  }

  return res.json({
    applied: true,
    packageId: promo.planKey,
    planKey: promo.planKey,
    activePackageInstanceId: instance._id.toString(),
    requestId,
  });
};

module.exports = { redeemPromoCode };
