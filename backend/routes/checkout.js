// backend/routes/checkout.js
const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  handleStripeWebhook,
  verifyCheckoutSession,
} = require("../controllers/checkoutController");

// Create a Stripe Checkout session
router.post("/create-checkout-session", createCheckoutSession);

// Verify a session (client convenience after redirect)
router.get("/verify-session", verifyCheckoutSession);

// Webhook (must use raw body for this route only)
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

module.exports = router;