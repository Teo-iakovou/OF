// TODO: Migrate to a Redis-backed store (e.g. rate-limit-redis) when running
// multiple server instances. The default in-memory store is per-process and
// will not share counts across horizontally-scaled deployments.

const rateLimit = require("express-rate-limit");

// No-op pass-through used in test environment so tests are never rate-blocked.
const noop = (_req, _res, next) => next();

// Stable IP key: req.ip (set by Express using trust-proxy) with an explicit
// fallback to the raw socket address. Never throws — ipKeyGenerator from
// express-rate-limit v8 throws ERR_ERL_UNDEFINED_IP_ADDRESS when req.ip is
// falsy, which causes the limiter to create a fresh bucket per request.
function resolveIp(req) {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function makeIpLimiter({ routeName, windowMs, max, message }) {
  if (process.env.NODE_ENV === "test") return noop;
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => resolveIp(req),
    handler: (req, res) => {
      const ip = req.ip || req.socket?.remoteAddress || "unknown";
      console.log(`[RATE LIMIT] ${routeName}: ${ip} blocked`);
      res.status(429).json({ error: message });
    },
  });
}

function makeUserLimiter({ routeName, windowMs, max, message }) {
  if (process.env.NODE_ENV === "test") return noop;
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      if (req.user?.id) return `uid:${req.user.id}`;
      return resolveIp(req);
    },
    handler: (req, res) => {
      const key = req.user?.id ? `user:${req.user.id}` : (req.ip || req.socket?.remoteAddress || "unknown");
      console.log(`[RATE LIMIT] ${routeName}: ${key} blocked`);
      res.status(429).json({ error: message });
    },
  });
}

// 5 attempts per 15 min per IP — applied to /api/auth/login and /api/auth/signup
const authLimiter = makeIpLimiter({
  routeName: "auth",
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many attempts, please try again in 15 minutes",
});

// 3 attempts per hour per IP — wire up when password reset flow is built
const passwordResetLimiter = makeIpLimiter({
  routeName: "password-reset",
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many password reset attempts, please try again in 1 hour",
});

// 30 messages per minute per authenticated user
const aiChatLimiter = makeUserLimiter({
  routeName: "ai-chat",
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many messages, please slow down",
});

// 10 video generations per hour per authenticated user
const videoGenerationLimiter = makeUserLimiter({
  routeName: "video-generation",
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Video generation limit reached, please try again later",
});

// 20 uploads per hour per authenticated user
const uploadLimiter = makeUserLimiter({
  routeName: "upload",
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "Upload limit reached, please try again later",
});

// 10 verify-session calls per minute per IP — defence-in-depth behind auth
const verifySessionLimiter = makeIpLimiter({
  routeName: "verify-session",
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later",
});

module.exports = {
  authLimiter,
  passwordResetLimiter,
  aiChatLimiter,
  videoGenerationLimiter,
  uploadLimiter,
  verifySessionLimiter,
};
