const { signToken, getCookieOptions, SESSION_COOKIE_NAME } = require("../utils/jwt");
const { sendErr } = require("../utils/sendErr");
const User = require("../models/user");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signupSchema, loginSchema } = require("../validators/authValidators");

const AUTH_DEBUG = String(process.env.AUTH_DEBUG || "").toLowerCase() === "true" || process.env.NODE_ENV !== "production";

async function signup(req, res) {
  try {
    const parsed = signupSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return sendErr(req, res, 400, "Invalid input");
    }
    const { email, password, name } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      // Generic message — don't reveal whether the email is already registered
      return sendErr(req, res, 409, "Unable to create account");
    }
    const [firstName = "", ...rest] = typeof name === "string" ? name.trim().split(/\s+/) : [];
    const lastName = rest.join(" ");
    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email: normalizedEmail,
      provider: "email",
      firstName,
      lastName,
      passwordHash,
      emailVerified: false,
    });
    const token = signToken({ sub: user._id.toString(), email: user.email });
    const opts = getCookieOptions();
    res.cookie(SESSION_COOKIE_NAME, token, opts);
    return res.status(201).json({ id: user._id.toString(), email: user.email, plan: user.purchasedPackage || null });
  } catch (e) {
    if (AUTH_DEBUG) { try { console.error("[auth] signup error", e?.message || e); } catch {} }
    return sendErr(req, res, 500, "Signup failed");
  }
}

async function login(req, res) {
  try {
    const parsed = loginSchema.safeParse(req.body || {});
    if (!parsed.success) {
      return sendErr(req, res, 400, "Invalid input");
    }
    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();
    // Select passwordHash explicitly (field has select:false)
    const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
    // Same message for "not found" and "wrong password" — prevents user enumeration
    const INVALID = "Invalid email or password";
    if (!user || !user.passwordHash) {
      return sendErr(req, res, 401, INVALID);
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return sendErr(req, res, 401, INVALID);
    }
    const token = signToken({ sub: user._id.toString(), email: user.email });
    const opts = getCookieOptions();
    res.cookie(SESSION_COOKIE_NAME, token, opts);
    if (AUTH_DEBUG) {
      try { console.log("[auth] login ok", { sameSite: opts.sameSite, secure: opts.secure }); } catch {}
    }
    return res.json({ id: user._id.toString(), email: user.email, plan: user.purchasedPackage || null });
  } catch (e) {
    if (AUTH_DEBUG) { try { console.error("[auth] login error", e?.message || e); } catch {} }
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
      const hasCookie = Boolean((req.headers["cookie"] || "").includes(SESSION_COOKIE_NAME));
      console.log("[auth] /me", { hasCookie, userId: req.user?.id || null });
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

// Called server-to-server from the Next.js OAuth callback — never exposed publicly
async function googleSession(req, res) {
  try {
    const { googleId, email, name } = req.body || {};
    if (typeof googleId !== "string" || !googleId) {
      return sendErr(req, res, 400, "Invalid googleId");
    }
    if (typeof email !== "string" || !email.includes("@")) {
      return sendErr(req, res, 400, "Invalid email");
    }
    const normalizedEmail = email.toLowerCase().trim();

    // Lookup by googleId first; fall back to email for account-linking
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email: normalizedEmail });
    }
    if (!user) {
      const [firstName = "", ...rest] = typeof name === "string" ? name.trim().split(/\s+/) : [];
      const lastName = rest.join(" ");
      user = await User.create({
        email: normalizedEmail,
        provider: "google",
        googleId,
        firstName,
        lastName,
      });
    } else {
      const updates = {};
      if (user.googleId !== googleId) updates.googleId = googleId;
      if (user.provider !== "google") updates.provider = "google";
      if (typeof name === "string" && name.trim()) {
        const [firstName = "", ...rest] = name.trim().split(/\s+/);
        const lastName = rest.join(" ");
        if (!user.firstName && firstName) updates.firstName = firstName;
        if (!user.lastName && lastName) updates.lastName = lastName;
      }
      if (Object.keys(updates).length > 0) {
        user = await User.findByIdAndUpdate(user._id, updates, { new: true });
      }
    }

    console.log(`[AUTH] Google OAuth login: ${normalizedEmail}`);

    const token = signToken({ sub: user._id.toString(), email: user.email });
    const opts = getCookieOptions();
    res.cookie(SESSION_COOKIE_NAME, token, opts);
    return res.json({ id: user._id.toString(), email: user.email, plan: user.purchasedPackage || null });
  } catch (e) {
    if (AUTH_DEBUG) { try { console.error("[auth] googleSession error", e?.message || e); } catch {} }
    return sendErr(req, res, 500, "OAuth session failed");
  }
}

module.exports = { signup, login, logout, me, googleSession };
