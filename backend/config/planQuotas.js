// Single source of truth for per-plan quota limits.
// chatMonthlyLimit equals tokensLimit — callers set both fields to the same value.
// tokensLimit: 0 means unlimited chat (Ultimate plan).
const PLAN_QUOTAS = {
  lite:     { uploads: 30,  tokensLimit: 500_000,   videos: 3  },
  pro:      { uploads: 100, tokensLimit: 2_000_000, videos: 10 },
  ultimate: { uploads: 350, tokensLimit: 0,         videos: 30 }, // tokensLimit:0 = unlimited chat
};

function getQuotasForPlan(planKey) {
  const key = String(planKey || "").toLowerCase();
  const quotas = PLAN_QUOTAS[key];
  if (!quotas) throw new Error(`[planQuotas] Unknown plan: ${planKey}`);
  return { ...quotas };
}

module.exports = { PLAN_QUOTAS, getQuotasForPlan };
