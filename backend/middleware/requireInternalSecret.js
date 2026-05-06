const { createHash, timingSafeEqual } = require("crypto");

/**
 * Verifies that the request originates from our own Next.js BFF layer by
 * checking the x-internal-secret header against INTERNAL_SECRET env var.
 *
 * Fails CLOSED: if INTERNAL_SECRET is not configured, ALL requests are
 * rejected with 401 — never open access by misconfiguration.
 *
 * Uses constant-time comparison (timingSafeEqual) to prevent timing attacks.
 */
function requireInternalSecret(req, res, next) {
  const configured = process.env.INTERNAL_SECRET || "";
  if (!configured) {
    console.error("[FATAL] INTERNAL_SECRET is not set — rejecting internal request");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const incoming = req.headers["x-internal-secret"] || "";

  // Hash both to equal-length buffers before timingSafeEqual (required: same length)
  const configuredBuf = createHash("sha256").update(configured).digest();
  const incomingBuf = createHash("sha256").update(incoming).digest();

  if (!timingSafeEqual(configuredBuf, incomingBuf)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
}

module.exports = { requireInternalSecret };
