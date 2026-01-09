const PackageInstance = require("../models/packageInstance");

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
    if (!user) return res.status(401).json({ error: "Unauthorized" });

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
    if (!instance) {
      return res.status(402).json({ error: "Chat limit reached for your plan", action: "upgrade" });
    }

    await ensureCycle(instance);
    instance.chatMonthlyLimit = planLimit(instance.planKey || "lite");
    if (instance.chatUsedThisCycle >= instance.chatMonthlyLimit)
      return res.status(402).json({ error: "Chat limit reached for your plan", action: "upgrade" });
    return next();
  } catch (e) {
    return res.status(500).json({ error: "Quota check failed" });
  }
}

module.exports = { checkChatQuota, planLimit, ensureCycle };
