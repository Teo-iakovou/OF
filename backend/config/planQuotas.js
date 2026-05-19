// Single source of truth for per-plan quota limits.
// chatMonthlyLimit equals tokensLimit — callers set both fields to the same value.
const PLAN_QUOTAS = {
  lite:     { uploads: 5,   tokensLimit: 10000,  videos: Number(process.env.SADTALKER_LITE_LIMIT || 10) },
  pro:      { uploads: 20,  tokensLimit: 100000, videos: Number(process.env.SADTALKER_PRO_LIMIT  || 50) },
  ultimate: { uploads: 100, tokensLimit: 500000, videos: 0 },
};

function getQuotasForPlan(planKey) {
  const key = String(planKey || "").toLowerCase();
  const quotas = PLAN_QUOTAS[key];
  if (!quotas) throw new Error(`[planQuotas] Unknown plan: ${planKey}`);
  return { ...quotas };
}

module.exports = { PLAN_QUOTAS, getQuotasForPlan };
