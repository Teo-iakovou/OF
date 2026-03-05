function sendErr(req, res, status, message, extra) {
  const payload = { error: message, requestId: req.requestId || null };
  if (extra && typeof extra === "object") {
    Object.assign(payload, extra);
  }
  return res.status(status).json(payload);
}

module.exports = { sendErr };
