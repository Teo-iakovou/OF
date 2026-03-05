const { signToken, getCookieOptions, SESSION_COOKIE_NAME } = require("../utils/jwt");
const { sendErr } = require("../utils/sendErr");
const User = require("../models/user");

// Simple credential login (email-only dev mode). You can extend with password/OTP.
const AUTH_DEBUG = String(process.env.AUTH_DEBUG || "").toLowerCase() === "true" || process.env.NODE_ENV !== 'production';
async function login(req, res) {
  try {
    // Support both POST (JSON body) and GET (query string) to enable
    // top-level redirect-based login for cross-site cookie scenarios.
    const isGet = req.method === "GET";
    const email = isGet ? (req.query?.email || "") : ((req.body || {}).email || "");
    const provider = isGet ? (req.query?.provider || null) : ((req.body || {}).provider || null);
    const googleId = isGet ? (req.query?.googleId || null) : ((req.body || {}).googleId || null);
    const fullName = isGet ? (req.query?.name || null) : ((req.body || {}).name || null);
    const redirect = isGet ? (req.query?.redirect || null) : null;
    if (typeof email !== "string" || !email.includes("@")) {
      return sendErr(req, res, 400, "Valid email is required");
    }
    if (AUTH_DEBUG) {
      try {
        console.log('[auth] login attempt', {
          email: String(email || '').slice(0, 80),
          origin: req.get('origin') || undefined,
          referer: req.get('referer') || undefined,
          ua: req.get('user-agent') || undefined,
        });
      } catch {}
    }
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Optional: auto-create user in dev; in production you may require invite / OAuth
      const [firstName = "", ...rest] =
        typeof fullName === "string" ? fullName.trim().split(/\s+/) : [];
      const lastName = rest.join(" ");
      user = await User.create({
        email: normalizedEmail,
        provider: provider === "google" ? "google" : "email",
        googleId: provider === "google" && typeof googleId === "string" ? googleId : null,
        firstName,
        lastName,
      });
    } else if (provider === "google") {
      const updates = {};
      if (typeof googleId === "string" && googleId && user.googleId !== googleId) {
        updates.googleId = googleId;
      }
      if (user.provider !== "google") {
        updates.provider = "google";
      }
      if (typeof fullName === "string" && fullName.trim()) {
        const [firstName = "", ...rest] = fullName.trim().split(/\s+/);
        const lastName = rest.join(" ");
        if (!user.firstName && firstName) updates.firstName = firstName;
        if (!user.lastName && lastName) updates.lastName = lastName;
      }
      if (Object.keys(updates).length > 0) {
        user = await User.findByIdAndUpdate(user._id, updates, { new: true });
      }
    }

    const token = signToken({ sub: user._id.toString(), email: user.email });
    const opts = getCookieOptions();
    res.cookie(SESSION_COOKIE_NAME, token, opts);
    if (AUTH_DEBUG) {
      try { console.log('[auth] login ok', { sameSite: opts.sameSite, secure: opts.secure, domain: opts.domain || null }); } catch {}
    }
    
    // If this was a GET with a redirect hint, perform a top-level redirect
    // back to the UI. This avoids third-party cookie restrictions because
    // the cookie is being set on a top-level navigation to the API origin.
    if (isGet) {
      const uiBase = process.env.PUBLIC_URL || "http://localhost:3000";
      // Only allow relative redirects to avoid open redirect issues.
      const destPath = (typeof redirect === "string" && redirect.startsWith("/")) ? redirect : "/";
      const to = new URL(destPath, uiBase).toString();
      return res.redirect(302, to);
    }

    return res.json({ id: user._id.toString(), email: user.email, plan: user.purchasedPackage || null, token });
  } catch (e) {
    if (AUTH_DEBUG) { try { console.error('[auth] login error', e?.message || e); } catch {} }
    return sendErr(req, res, 500, "Login failed");
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
  if (AUTH_DEBUG) {
    try {
      const hasCookie = Boolean((req.headers['cookie'] || '').includes(SESSION_COOKIE_NAME));
      console.log('[auth] /me', { hasCookie, userId: req.user?.id || null });
    } catch {}
  }
  if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");
  try {
    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 401, "Unauthorized");
    return res.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        plan: user.purchasedPackage || null,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      },
    });
  } catch {
    return sendErr(req, res, 500, "Failed to load session");
  }
}

module.exports = { login, logout, me };
