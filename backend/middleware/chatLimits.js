const PackageInstance = require("../models/packageInstance");
const { sendErr } = require("../utils/sendErr");
const { sendQuotaError } = require("../utils/quotaError");

const addMonths = (d, m = 1) =>
  new Date(d.getFullYear(), d.getMonth() + m, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());

async function ensureCycle(instance) {
  const now = new Date();
  if (!instance.chatCycleEndsAt || now > instance.chatCycleEndsAt) {
    instance.chatUsedThisCycle = 0;
    instance.chatCycleEndsAt = addMonths(now, 1);
    await instance.save();
  }
}

function planLimit(plan) {
  if (plan === "ultimate") return 1000;
  if (plan === "pro") return 200;
  return 20; // lite
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
    const baseChatLimit =
      typeof instance.chatMonthlyLimit === "number"
        ? instance.chatMonthlyLimit
        : planLimit(instance.planKey || "lite");
    const addonsChatTokens =
      typeof instance.addons?.chatTokens === "number"
        ? instance.addons.chatTokens
        : typeof instance.addons?.chat === "number"
          ? instance.addons.chat
          : 0;
    const effectiveChatLimit = baseChatLimit === 0 ? 0 : baseChatLimit + addonsChatTokens;
    const isUnlimited = effectiveChatLimit === 0;
    req.chatQuota = {
      instanceId: instance._id.toString(),
      effectiveChatLimit,
      isUnlimited,
    };
    if (isUnlimited) return next();
    if (instance.chatUsedThisCycle >= effectiveChatLimit) {
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
