const crypto = require("crypto");

function generateRequestId() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function requestIdMiddleware(req, res, next) {
  const headerId = req.headers["x-request-id"];
  const requestId = typeof headerId === "string" && headerId.trim() ? headerId : generateRequestId();
  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}

module.exports = { requestIdMiddleware };
