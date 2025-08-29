const addMonths = (d, m=1) => new Date(d.getFullYear(), d.getMonth()+m, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());

async function ensureCycle(user) {
  const now = new Date();
  if (!user.chatCycleEndsAt || now > user.chatCycleEndsAt) {
    user.chatUsedThisCycle = 0;
    user.chatCycleEndsAt = addMonths(now, 1);
    await user.save();
  }
}

function planLimit(plan) {
  if (plan === "ultimate") return 1000;
  if (plan === "pro") return 200;
  return 20; // lite
}

async function checkChatQuota(req,res,next){
  try{
    const user = req._user; // must be attached earlier in the route
    await ensureCycle(user);
    user.chatMonthlyLimit = planLimit(user.purchasedPackage || "lite");
    if (user.chatUsedThisCycle >= user.chatMonthlyLimit)
      return res.status(402).json({ error: "Chat limit reached for your plan", action: "upgrade" });
    return next();
  }catch(e){
    return res.status(500).json({ error:"Quota check failed" });
  }
}

module.exports = { checkChatQuota, planLimit, ensureCycle };