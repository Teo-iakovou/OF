// backend/routes/checkout.js
const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  createAddonCheckoutSession,
  verifyCheckoutSession,
} = require("../controllers/checkoutController");
const { requireAuth } = require("../middleware/requireAuth");
const { verifySessionLimiter } = require("../middleware/rateLimiters");

// Create a Stripe Checkout session
router.post("/create-checkout-session", requireAuth, createCheckoutSession);
// Create a Stripe Checkout session for addon packs
router.post("/create-addon-checkout-session", requireAuth, createAddonCheckoutSession);

// Verify a session (client convenience after redirect) — requires the session owner
router.get("/verify-session", verifySessionLimiter, requireAuth, verifyCheckoutSession);

module.exports = router;
