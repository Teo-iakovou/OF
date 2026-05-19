/* eslint-disable @typescript-eslint/no-require-imports */
const PromoCode = require("../models/promoCode");
const { sendErr } = require("../utils/sendErr");
const { generatePromoCode } = require("../utils/generatePromoCode");

const VALID_PLAN_KEYS = new Set(["lite", "pro", "ultimate"]);

const createPromoCode = async (req, res) => {
  const requestId = req.requestId || null;
  const adminUserId = req.user?.id;

  const { code: rawCode, planKey, maxUses, expiresAt: expiresAtRaw, note } = req.body || {};

  // planKey validation
  if (!planKey || !VALID_PLAN_KEYS.has(String(planKey).toLowerCase())) {
    return res.status(400).json({
      error: "INVALID_PLAN_KEY",
      message: "planKey must be one of: lite, pro, ultimate",
      requestId,
    });
  }

  // maxUses validation
  let resolvedMaxUses = 1;
  if (maxUses !== undefined) {
    if (maxUses === null) {
      resolvedMaxUses = null;
    } else {
      const n = Number(maxUses);
      if (!Number.isInteger(n) || n < 1) {
        return res.status(400).json({
          error: "INVALID_MAX_USES",
          message: "maxUses must be a positive integer or null for unlimited",
          requestId,
        });
      }
      resolvedMaxUses = n;
    }
  }

  // expiresAt validation
  let resolvedExpiresAt = null;
  if (expiresAtRaw !== undefined && expiresAtRaw !== null) {
    const parsed = new Date(expiresAtRaw);
    if (isNaN(parsed.getTime())) {
      return res.status(400).json({
        error: "INVALID_EXPIRES_AT",
        message: "expiresAt must be a valid ISO date string",
        requestId,
      });
    }
    if (parsed <= new Date()) {
      return res.status(400).json({
        error: "EXPIRES_AT_IN_PAST",
        message: "expiresAt must be a future date",
        requestId,
      });
    }
    resolvedExpiresAt = parsed;
  }

  // Resolve or generate code
  let resolvedCode;
  if (rawCode !== undefined) {
    if (typeof rawCode !== "string" || !rawCode.trim()) {
      return res.status(400).json({
        error: "INVALID_CODE",
        message: "code must be a non-empty string",
        requestId,
      });
    }
    resolvedCode = rawCode.trim().toUpperCase();
  } else {
    resolvedCode = generatePromoCode(12);
  }

  try {
    const promo = await PromoCode.create({
      code: resolvedCode,
      planKey: String(planKey).toLowerCase(),
      maxUses: resolvedMaxUses,
      expiresAt: resolvedExpiresAt,
      note: typeof note === "string" ? note.trim() : "",
      createdBy: adminUserId || null,
    });

    try {
      console.log("[admin:promo-created]", {
        requestId,
        adminUserId,
        code: promo.code,
        planKey: promo.planKey,
        maxUses: promo.maxUses,
        expiresAt: promo.expiresAt,
      });
    } catch {}

    return res.status(201).json({
      code: promo.code,
      planKey: promo.planKey,
      maxUses: promo.maxUses,
      expiresAt: promo.expiresAt,
      note: promo.note,
      active: promo.active,
      createdAt: promo.createdAt,
      id: promo._id.toString(),
      requestId,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        error: "PROMO_CODE_CONFLICT",
        message: "A code with that value already exists",
        requestId,
      });
    }
    console.error("[admin:promo-create-error]", { requestId, error: err?.message || String(err) });
    return sendErr(req, res, 500, "Failed to create promo code");
  }
};

const listPromoCodes = async (req, res) => {
  const requestId = req.requestId || null;
  try {
    const codes = await PromoCode.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      codes: codes.map((c) => ({
        id: c._id.toString(),
        code: c.code,
        planKey: c.planKey,
        maxUses: c.maxUses,
        usedCount: c.usedCount,
        usedBy: c.usedBy.map((id) => id.toString()),
        expiresAt: c.expiresAt,
        active: c.active,
        note: c.note,
        createdBy: c.createdBy?.toString() || null,
        createdAt: c.createdAt,
      })),
      requestId,
    });
  } catch (err) {
    console.error("[admin:promo-list-error]", { requestId, error: err?.message || String(err) });
    return sendErr(req, res, 500, "Failed to list promo codes");
  }
};

module.exports = { createPromoCode, listPromoCodes };
