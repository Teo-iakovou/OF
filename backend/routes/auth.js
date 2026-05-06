const express = require("express");
const router = express.Router();
const { signup, login, logout, me, googleSession } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiters");
const { requireInternalSecret } = require("../middleware/requireInternalSecret");

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", me);
router.post("/google-session", requireInternalSecret, googleSession);

module.exports = router;
