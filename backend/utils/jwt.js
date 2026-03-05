const jwt = require("jsonwebtoken");

function getEnv(name, fallback = undefined) {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
}

const JWT_SECRET = getEnv("JWT_SECRET", "dev-insecure-secret-change-me");
const JWT_ISSUER = getEnv("JWT_ISSUER", "ai-platform");
const JWT_AUDIENCE = getEnv("JWT_AUDIENCE", "ai-platform-users");
const TOKEN_TTL_MIN = Number(getEnv("TOKEN_TTL_MIN", "30"));
const SESSION_COOKIE_NAME = getEnv("SESSION_COOKIE_NAME", "ai_session");

function signToken(payload = {}) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + TOKEN_TTL_MIN * 60;
  const base = { iat: now, exp, iss: JWT_ISSUER, aud: JWT_AUDIENCE };
  return jwt.sign({ ...base, ...payload }, JWT_SECRET, { algorithm: "HS256" });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return { ok: true, payload: decoded };
  } catch (e) {
    return { ok: false, error: e };
  }
}

function getCookieOptions() {
  const uiBase = String(process.env.PUBLIC_URL || "");
  const isLocal =
    uiBase.includes("localhost") ||
    uiBase.includes("127.0.0.1") ||
    process.env.NODE_ENV !== "production";

  const base = {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30 * 1000,
    secure: !isLocal,
  };

  if (!isLocal && process.env.COOKIE_DOMAIN) {
    return { ...base, domain: process.env.COOKIE_DOMAIN };
  }

  return base;
}

module.exports = {
  signToken,
  verifyToken,
  getCookieOptions,
  SESSION_COOKIE_NAME,
};
