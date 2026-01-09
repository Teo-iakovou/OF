/* eslint-disable @typescript-eslint/no-require-imports */
// backend/controllers/checkoutController.js
const Stripe = require("stripe");
const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");
const { getSadTalkerPlanLimit } = require("./userController");
const { planLimit } = require("../middleware/chatLimits");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Comma-separated allowlist of UI origins (local + prod)
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
// Example .env:
// ALLOWED_ORIGINS=http://localhost:3000,https://yourapp.com

const PACKAGES = { lite: 500, pro: 1500, ultimate: 3000 }; // cents
const UPLOAD_LIMITS = { lite: 5, pro: 20, ultimate: 100 };

// POST /api/checkout/create-checkout-session
const createCheckoutSession = async (req, res) => {
  try {
    const { packageId } = req.body || {};
    const email = req.user?.email;
    if (!email || !packageId || !PACKAGES[packageId]) {
      return res.status(400).json({ error: "Invalid user or packageId" });
    }

    // Pick safe origin (local or prod) based on caller
    const origin = req.get("origin") || req.get("referer") || "";
  const safeOrigin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : (ALLOWED_ORIGINS.includes(origin)
        ? origin
        : process.env.PUBLIC_URL);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `${packageId.toUpperCase()} Package` },
            unit_amount: PACKAGES[packageId],
          },
          quantity: 1,
        },
      ],
      metadata: { email, packageId },
      client_reference_id: email,
      success_url: `${safeOrigin}/dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
      // If the user cancels or clicks "go back" in Stripe Checkout,
      // return them to the public homepage instead of dashboard.
      cancel_url: `${safeOrigin}/`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// POST /api/checkout/webhook  (must use express.raw)
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email =
      session.metadata?.email ||
      session.customer_details?.email ||
      session.client_reference_id ||
      session.customer_email;
    const packageId = session.metadata?.packageId;

    if (!email || !packageId) {
      console.error("Webhook missing metadata for session:", session.id);
      return res.json({ received: true });
    }

    try {
      console.log("ℹ️  Webhook checkout session resolved:", {
        sessionId: session.id,
        email,
        packageId,
        dbName: User.db?.name || null,
      });
      let user = await User.findOne({ email });
      if (!user) user = new User({ email });

      user.purchasedPackage = packageId;

      await user.save();
      const uploadLimit = UPLOAD_LIMITS[packageId] || 0;
      const sadtalkerLimit = getSadTalkerPlanLimit(packageId);
      const chatMonthlyLimit = planLimit(packageId);
      const instance = await PackageInstance.create({
        userId: user._id,
        planKey: packageId,
        status: "active",
        uploadLimit,
        uploadsUsed: 0,
        chatMonthlyLimit,
        chatUsedThisCycle: 0,
        chatCycleEndsAt: null,
        sadtalkerVideoLimit: sadtalkerLimit,
        sadtalkerVideosUsed: 0,
        sadtalkerPrimaryImageHash: null,
        personaBound: false,
        rekognitionFaceId: null,
      });
      if (instance.userId && instance.userId.toString() === user._id.toString()) {
        user.activePackageInstanceId = instance._id;
        await user.save();
      }
      console.log("✅ Package instance created for:", {
        email,
        instanceId: instance._id.toString(),
        dbName: User.db?.name || null,
      });
    } catch (err) {
      console.error("❌ Failed to update user after checkout:", err);
    }
  }

  return res.json({ received: true });
};

// GET /api/checkout/verify-session?session_id=cs_...
const verifyCheckoutSession = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ error: "session_id required" });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    return res.json({
      status: session.payment_status, // 'paid' | 'unpaid' | 'no_payment_required'
      email: session.metadata?.email,
      packageId: session.metadata?.packageId,
    });
  } catch (err) {
    console.error("Verify session error:", err);
    return res.status(500).json({ error: "Failed to verify session" });
  }
};

module.exports = {
  createCheckoutSession,
  handleStripeWebhook,
  verifyCheckoutSession,
};
