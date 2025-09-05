const { signToken, getCookieOptions, SESSION_COOKIE_NAME } = require("../utils/jwt");
const User = require("../models/user");

// Simple credential login (email-only dev mode). You can extend with password/OTP.
async function login(req, res) {
  try {
    const { email } = req.body || {};
    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Optional: auto-create user in dev; in production you may require invite / OAuth
      user = await User.create({ email: email.toLowerCase().trim() });
    }

    const token = signToken({ sub: user._id.toString(), email: user.email });
    res.cookie(SESSION_COOKIE_NAME, token, getCookieOptions());
    return res.json({ id: user._id.toString(), email: user.email, plan: user.purchasedPackage || null });
  } catch (e) {
    return res.status(500).json({ error: "Login failed" });
  }
}

async function logout(_req, res) {
  try {
    res.clearCookie(SESSION_COOKIE_NAME, { ...getCookieOptions(), maxAge: 0 });
    return res.json({ ok: true });
  } catch {
    return res.json({ ok: true });
  }
}

async function me(req, res) {
  if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    return res.json({ id: user._id.toString(), email: user.email, plan: user.purchasedPackage || null });
  } catch {
    return res.status(500).json({ error: "Failed to load session" });
  }
}

module.exports = { login, logout, me };

