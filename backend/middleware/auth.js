const cookie = require("cookie");
const { verifyToken, SESSION_COOKIE_NAME } = require("../utils/jwt");
const User = require("../models/user");

async function authMiddleware(req, _res, next) {
  try {
    const header = req.headers["cookie"] || "";
    const cookies = header ? cookie.parse(header) : {};
    // Optional header-based auth is disabled by default; enable with HEADER_AUTH_ENABLED=true
    const HEADER_AUTH_ENABLED = String(process.env.HEADER_AUTH_ENABLED || "").toLowerCase() === "true";
    const auth = req.headers["authorization"] || req.headers["Authorization"]; // some proxies
    const bearer = HEADER_AUTH_ENABLED && typeof auth === "string" && auth.toLowerCase().startsWith("bearer ")
      ? auth.slice(7).trim()
      : null;
    const token = bearer || cookies[SESSION_COOKIE_NAME];
    if (!token) {
      req.user = null;
      return next();
    }
    const v = verifyToken(token);
    if (!v.ok || !v.payload?.sub) {
      req.user = null;
      return next();
    }
    // attach minimal identity; controller can load the full user if needed
    req.user = { id: String(v.payload.sub), email: v.payload.email || undefined };

    // Optional: preload user document for convenience
    try {
      if (req.user.id) {
        const doc = await User.findById(req.user.id);
        if (doc) req._user = doc; // some middlewares expect this
      }
    } catch {}

    return next();
  } catch (e) {
    req.user = null;
    return next();
  }
}

module.exports = { authMiddleware };
