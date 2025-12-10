const cookie = require("cookie");
const { verifyToken, SESSION_COOKIE_NAME } = require("../utils/jwt");
const User = require("../models/user");

async function authMiddleware(req, _res, next) {
  try {
    const header = req.headers["cookie"] || "";
    const cookies = header ? cookie.parse(header) : {};
    const token = cookies[SESSION_COOKIE_NAME];
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
