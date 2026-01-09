// backend/utils/quotaError.js

function sendQuotaError(res, status, { message, feature, plan = null, remaining = null, limit = null, requestId = null }) {
  return res.status(status).json({
    error: message,
    code: "UPGRADE_REQUIRED",
    feature,
    plan,
    remaining,
    limit,
    requestId,
  });
}

module.exports = { sendQuotaError };
