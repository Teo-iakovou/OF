// backend/routes/coachChat.js
const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit"); // IPv6-safe keys

const User = require("../models/user");
const { checkChatQuota } = require("../middleware/chatLimits");
const { coachChatHandler, suggestPrompts } = require("../controllers/coachChatController");

// Per-user rate limit (POST /): prefer email, fallback to IPv6-safe IP
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    const email = (req.body?.email || "").toLowerCase().trim();
    if (email) return `email:${email}`;
    return ipKeyGenerator(req);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Per-user rate limit (GET /prompts): use query.email, fallback to IPv6-safe IP
const promptsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => {
    const email = (req.query?.email || "").toLowerCase().trim();
    if (email) return `email:${email}`;
    return ipKeyGenerator(req);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Prefetch user so checkChatQuota can use req._user
async function attachUser(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email is required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ error: "User not found." });
    req._user = user;
    next();
  } catch (e) {
    return res.status(500).json({ error: "User lookup failed" });
  }
}

// Chat send
router.post("/", chatLimiter, attachUser, checkChatQuota, coachChatHandler);

// Quick prompts
router.get("/prompts", promptsLimiter, suggestPrompts);

module.exports = router;