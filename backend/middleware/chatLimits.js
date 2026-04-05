const PackageInstance = require("../models/packageInstance");
const { sendErr } = require("../utils/sendErr");
const { sendQuotaError } = require("../utils/quotaError");

const TOKENS_PER_LEGACY_CHAT_UNIT = 500;

const addMonths = (d, m = 1) =>
  new Date(d.getFullYear(), d.getMonth() + m, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());

const toLegacyTokenValue = (value, fallback = 0) => {
  const raw = Number(value);
  if (!Number.isFinite(raw) || raw < 0) return fallback;
  // Legacy chat limits were message counts (20/200/1000). Convert only small values.
  return raw > 5000 ? raw : raw * TOKENS_PER_LEGACY_CHAT_UNIT;
};

function resolveTokensLimit(instance) {
  const planDefault = planLimit(instance?.planKey || "lite");
  if (typeof instance?.tokensLimit === "number" && instance.tokensLimit >= 0) {
    const tokensLimit = Number(instance.tokensLimit);
    // Only treat 0 as "unlimited" when plan default is explicitly unlimited.
    if (tokensLimit > 0 || planDefault === 0) return tokensLimit;
  }
  if (typeof instance?.chatMonthlyLimit === "number" && instance.chatMonthlyLimit >= 0) {
    const legacy = toLegacyTokenValue(instance.chatMonthlyLimit, 0);
    if (legacy > 0 || planDefault === 0) return legacy;
  }
  return planDefault;
}

function resolveTokensUsed(instance) {
  if (typeof instance?.tokensUsed === "number" && instance.tokensUsed >= 0) {
    return Number(instance.tokensUsed);
  }
  if (typeof instance?.chatUsedThisCycle === "number" && instance.chatUsedThisCycle >= 0) {
    return toLegacyTokenValue(instance.chatUsedThisCycle, 0);
  }
  return 0;
}

async function ensureCycle(instance) {
  const now = new Date();
  let dirty = false;
  const nextTokensLimit = resolveTokensLimit(instance);
  const nextTokensUsed = resolveTokensUsed(instance);
  if (instance.tokensLimit !== nextTokensLimit) {
    instance.tokensLimit = nextTokensLimit;
    dirty = true;
  }
  if (instance.tokensUsed !== nextTokensUsed) {
    instance.tokensUsed = nextTokensUsed;
    dirty = true;
  }

  if (!instance.chatCycleEndsAt || now > instance.chatCycleEndsAt) {
    instance.chatUsedThisCycle = 0;
    instance.tokensUsed = 0;
    instance.chatCycleEndsAt = addMonths(now, 1);
    dirty = true;
  }
  if (dirty) {
    await instance.save();
  }
}

function planLimit(plan) {
  if (plan === "ultimate") return 500000; // ~600 messages × ~800 tokens
  if (plan === "pro")      return 100000; // ~120 messages × ~800 tokens
  return 10000;                           // ~12 messages × ~800 tokens (lite)
}

async function checkChatQuota(req, res, next) {
  try {
    const user = req._user; // must be attached earlier in the route
    if (!user) return sendErr(req, res, 401, "Unauthorized");

    const instance = user.activePackageInstanceId
      ? await PackageInstance.findOne({
          _id: user.activePackageInstanceId,
          userId: user._id,
          status: "active",
        })
      : null;
    if (!instance) {
      return sendErr(req, res, 409, "ACTIVE_INSTANCE_REQUIRED", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
      });
    }

    await ensureCycle(instance);
    const baseChatLimit = resolveTokensLimit(instance);
    const addonsChatTokens =
      typeof instance.addons?.chatTokens === "number"
        ? instance.addons.chatTokens
        : typeof instance.addons?.chat === "number"
          ? instance.addons.chat
          : 0;
    const effectiveChatLimit = baseChatLimit === 0 ? 0 : baseChatLimit + addonsChatTokens;
    const isUnlimited = effectiveChatLimit === 0;
    const usedTokens = resolveTokensUsed(instance);
    req.chatQuota = {
      instanceId: instance._id.toString(),
      effectiveChatLimit,
      usedTokens,
      isUnlimited,
    };
    if (isUnlimited) return next();
    if (usedTokens >= effectiveChatLimit) {
      return sendQuotaError(res, 402, {
        message: "Chat limit reached for your plan",
        feature: "ai_chat",
        plan: instance.planKey,
        remaining: 0,
        limit: effectiveChatLimit,
        requestId: req.requestId || null,
      });
    }
    return next();
  } catch (e) {
    return sendErr(req, res, 500, "Quota check failed");
  }
}

module.exports = { checkChatQuota, planLimit, ensureCycle };
