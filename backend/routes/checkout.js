const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  handleStripeWebhook,
} = require("../controllers/checkoutController");

// Stripe checkout session
router.post("/create-checkout-session", createCheckoutSession);

// Stripe webhook endpoint
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;
