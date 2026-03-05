/* eslint-disable @typescript-eslint/no-require-imports */
// backend/controllers/checkoutController.js
const Stripe = require("stripe");
const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");
const WebhookEvent = require("../models/webhookEvent");
const mongoose = require("mongoose");
const { ADDON_PRICES, getAddonPack } = require("../config/addons");
const { getSadTalkerPlanLimit } = require("./userController");
const { planLimit } = require("../middleware/chatLimits");
const { sendErr } = require("../utils/sendErr");
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

const ALLOWED_ADDON_TYPES = new Set(["uploads", "chat", "sadtalkerVideos"]);

// POST /api/checkout/create-checkout-session
const createCheckoutSession = async (req, res) => {
  try {
    const { packageId, personaKey } = req.body || {};
    const email = req.user?.email;
    if (!email || !packageId || !PACKAGES[packageId]) {
      return sendErr(req, res, 400, "Invalid user or packageId");
    }
    const normalizedPersonaKey =
      typeof personaKey === "string" && personaKey.trim().length > 0 ? personaKey.trim() : null;
    if (personaKey !== undefined && normalizedPersonaKey === null) {
      return sendErr(req, res, 400, "personaKey must be a non-empty string");
    }

    // Pick safe origin (local or prod) based on caller
    const origin = req.get("origin") || req.get("referer") || "";
  const safeOrigin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : (ALLOWED_ORIGINS.includes(origin)
        ? origin
        : process.env.PUBLIC_URL);

    try {
      console.log("[addon-checkout:create]", {
        requestId,
        userId,
        email,
        addonType,
        addonPack,
        addonQty: pack.qty,
        packageInstanceId: instance._id.toString(),
      });
    } catch {}

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
      metadata: {
        email,
        packageId,
        ...(normalizedPersonaKey ? { personaKey: normalizedPersonaKey } : {}),
      },
      client_reference_id: email,
      success_url: `${safeOrigin}/dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
      // If the user cancels or clicks "go back" in Stripe Checkout,
      // return them to the public homepage instead of dashboard.
      cancel_url: `${safeOrigin}/`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    return sendErr(req, res, 500, "Failed to create checkout session");
  }
};

// POST /api/checkout/create-addon-checkout-session
const createAddonCheckoutSession = async (req, res) => {
  try {
    const { addonType, addonPack, packageInstanceId } = req.body || {};
    const packKey = addonPack;
    const userId = req.user?.id;
    const email = req.user?.email;
    const requestId = req.requestId || req.get("x-request-id") || null;
    if (!userId || !email) {
      return res.status(401).json({ error: "UNAUTHORIZED", requestId });
    }
    if (typeof addonType !== "string" || !addonType.trim()) {
      return res.status(400).json({ error: "INVALID_ADDON_TYPE", requestId });
    }
    if (!ALLOWED_ADDON_TYPES.has(addonType)) {
      return res.status(400).json({ error: "INVALID_ADDON_TYPE", requestId });
    }
    if (typeof packKey !== "string" || !packKey.trim()) {
      return res.status(400).json({ error: "INVALID_ADDON_PACK", requestId });
    }
    const pack = getAddonPack(addonType, packKey);
    if (!pack) {
      return res.status(400).json({ error: "INVALID_ADDON_PACK", requestId });
    }
    const priceId = process.env[pack.priceEnv];
    if (!priceId) {
      try {
        console.warn("[addon-checkout:missing-price]", {
          requestId,
          addonType,
          packKey,
          priceEnv: pack.priceEnv,
        });
      } catch {}
      return res.status(500).json({
        error: "ADDON_PRICE_NOT_CONFIGURED",
        requestId,
        details: { addonType, packKey, priceEnv: pack.priceEnv },
      });
    }
    if (!packageInstanceId || !mongoose.Types.ObjectId.isValid(packageInstanceId)) {
      return res.status(400).json({ error: "INVALID_PACKAGE_INSTANCE", requestId });
    }
    const instance = await PackageInstance.findOne({
      _id: packageInstanceId,
      userId,
      status: "active",
    });
    if (!instance) {
      return res.status(403).json({ error: "PACKAGE_INSTANCE_NOT_FOUND", requestId });
    }

    const origin = req.get("origin") || req.get("referer") || "";
    const safeOrigin =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : (ALLOWED_ORIGINS.includes(origin)
            ? origin
            : process.env.PUBLIC_URL);

    const metadata = {
      kind: "addon",
      userId,
      userEmail: email,
      packageInstanceId: instance._id.toString(),
      addonType,
      addonQty: String(pack.qty),
      packKey,
      addonPack: packKey,
      requestId,
    };
    if (!metadata.userId || !metadata.userEmail || !metadata.packageInstanceId || !metadata.addonType || !metadata.packKey) {
      return res.status(400).json({ error: "MISSING_ADDON_METADATA", requestId });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata,
      client_reference_id: email,
      success_url: `${safeOrigin}/dashboard/billing?status=success&kind=addon&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${safeOrigin}/dashboard/billing?status=cancel&kind=addon`,
    });

    return res.json({ url: session.url, requestId });
  } catch (err) {
    console.error("Stripe addon session error:", err);
    const requestId = req.requestId || req.get("x-request-id") || null;
    return res.status(500).json({ error: "ADDON_CHECKOUT_FAILED", requestId });
  }
};

// POST /api/checkout/webhook  (must use express.raw)
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  console.log(
    "[webhook] isBuffer:",
    Buffer.isBuffer(req.body),
    "content-type:",
    req.headers["content-type"]
  );

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
    const sessionId = session?.id || null;
    const paymentIntentId = session?.payment_intent || null;

    try {
      console.log("[webhook:checkout-session-completed]", {
        pid: process.pid,
        eventId: event.id,
        eventType: event.type,
        sessionId,
      });
    } catch {}

    if (session?.metadata?.kind === "addon") {
      const meta = session.metadata || {};
      const addonType = meta.addonType;
      const packKey = meta.packKey;
      const packageInstanceId = meta.packageInstanceId;
      const userEmail = meta.userEmail;
      const userId = meta.userId || null;
      const requestId = meta.requestId || "missing_requestId";

      if (!addonType || !packKey || !packageInstanceId || !userEmail || !meta.requestId) {
        try {
          console.warn("[addon-webhook:missing-metadata]", {
            requestId,
            eventId: event.id,
            sessionId: session?.id || null,
            addonType,
            packKey,
            packageInstanceId,
            userEmail,
          });
        } catch {}
        return res.json({ received: true });
      }
      if (!ALLOWED_ADDON_TYPES.has(addonType)) {
        try {
          console.warn("[addon-webhook:invalid-addon-type]", {
            requestId,
            eventId: event.id,
            sessionId: session?.id || null,
            addonType,
          });
        } catch {}
        return res.json({ received: true });
      }
      if (!mongoose.Types.ObjectId.isValid(packageInstanceId)) {
        try {
          console.warn("[addon-webhook:invalid-package-instance]", {
            requestId,
            eventId: event.id,
            sessionId: session?.id || null,
            packageInstanceId,
          });
        } catch {}
        return res.json({ received: true });
      }
      const hasUserId = typeof userId === "string" && userId.length > 0;
      if (hasUserId && !mongoose.Types.ObjectId.isValid(userId)) {
        try {
          console.warn("[addon-webhook:invalid-user-id]", {
            requestId,
            eventId: event.id,
            sessionId: session?.id || null,
            userId,
          });
        } catch {}
        return res.json({ received: true });
      }

      const pack = getAddonPack(addonType, packKey);
      if (!pack) {
        try {
          console.warn("[addon-webhook:unknown-pack]", {
            requestId,
            eventId: event.id,
            sessionId: session?.id || null,
            addonType,
            packKey,
          });
        } catch {}
        return res.json({ received: true });
      }
      const addonQty = Number(pack.qty);
      try {
        console.log("[addon-webhook:received]", {
          eventId: event.id,
          sessionId: session?.id || null,
          packageInstanceId,
          addonType,
          addonQty,
        });
      } catch {}

      try {
        const upserted = await WebhookEvent.updateOne(
          { eventId: event.id },
          {
            $setOnInsert: {
              eventId: event.id,
              type: event.type,
              kind: "addon",
              sessionId: session?.id || null,
              processedAt: null,
              metadata: session?.metadata || null,
            },
          },
          { upsert: true }
        );
        if (!upserted?.upsertedCount) {
          return res.json({ received: true });
        }
      } catch (err) {
        if (err?.code === 11000) {
          return res.json({ received: true });
        }
        console.error("WebhookEvent insert failed:", err);
        return res.json({ received: true });
      }

      const inc = {};
      if (addonType === "uploads") inc["addons.uploads"] = addonQty;
      if (addonType === "chat") inc["addons.chat"] = addonQty;
      if (addonType === "sadtalkerVideos") inc["addons.sadtalkerVideos"] = addonQty;

      const filter = hasUserId
        ? { _id: packageInstanceId, status: "active", userId }
        : { _id: packageInstanceId, status: "active" };
      const updated = await PackageInstance.findOneAndUpdate(
        filter,
        { $inc: inc, $set: { lastAddonAppliedAt: new Date(), lastAddonSessionId: session?.id || null } },
        { new: true }
      );
      if (!updated) {
        await WebhookEvent.updateOne(
          { eventId: event.id },
          { $set: { error: "package_instance_not_found", processedAt: new Date() } }
        );
        return res.json({ received: true });
      }
      try {
        console.log("[addon-webhook:applied]", {
          eventId: event.id,
          sessionId: session?.id || null,
          packageInstanceId,
          addonType,
          addonQty,
          applied: inc,
        });
      } catch {}
      await WebhookEvent.updateOne(
        { eventId: event.id },
        { $set: { error: null, processedAt: new Date() } }
      );
      return res.json({ received: true });
    }

    try {
      const upserted = await WebhookEvent.updateOne(
        { eventId: event.id },
        {
          $setOnInsert: {
            eventId: event.id,
            type: event.type,
            kind: "package",
            sessionId: session?.id || null,
            processedAt: null,
            metadata: session?.metadata || null,
          },
        },
        { upsert: true }
      );
      if (!upserted?.upsertedCount) {
        return res.json({ received: true });
      }
    } catch (err) {
      if (err?.code === 11000) {
        return res.json({ received: true });
      }
      console.error("WebhookEvent insert failed:", err);
      return res.json({ received: true });
    }

    const email =
      session.metadata?.email ||
      session.customer_details?.email ||
      session.client_reference_id ||
      session.customer_email;
    const packageId = session.metadata?.packageId;
    const personaKey = session.metadata?.personaKey;
    const normalizedPersonaKey =
      typeof personaKey === "string" && personaKey.trim().length > 0 ? personaKey.trim() : null;

    if (!sessionId) {
      console.error("[webhook:missing-session-id]", { eventId: event.id, eventType: event.type });
      return res.status(400).json({ error: "missing_session_id" });
    }

    if (!email || !packageId) {
      console.error("Webhook missing metadata for session:", session.id);
      return res.json({ received: true });
    }
    if (personaKey !== undefined && normalizedPersonaKey === null) {
      throw new Error("personaKey must be a non-empty string");
    }

    try {
      console.log("ℹ️  Webhook checkout session resolved:", {
        sessionId: session.id,
        email,
        packageId,
        dbName: User.db?.name || null,
      });
      const existingInstance = await PackageInstance.findOne({ stripeCheckoutSessionId: sessionId });
      if (existingInstance) {
        return res.json({ received: true });
      }
      let user = await User.findOne({ email });
      if (!user) user = new User({ email });

      user.purchasedPackage = packageId;

      await user.save();
      const legacyWindowStart = new Date(Date.now() - 2 * 60 * 1000);
      const legacyInstance = await PackageInstance.findOne({
        userId: user._id,
        planKey: packageId,
        status: "active",
        stripeCheckoutSessionId: null,
        createdAt: { $gte: legacyWindowStart },
      }).sort({ createdAt: -1 });
      if (legacyInstance) {
        legacyInstance.stripeCheckoutSessionId = sessionId;
        legacyInstance.stripePaymentIntentId = paymentIntentId || null;
        try {
          await legacyInstance.save();
        } catch (err) {
          if (err?.code === 11000) {
            return res.json({ received: true });
          }
          throw err;
        }
        user.activePackageInstanceId = legacyInstance._id;
        await user.save();
        return res.json({ received: true });
      }
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
        personaKey: normalizedPersonaKey,
        personaBound: !!normalizedPersonaKey,
        rekognitionFaceId: null,
        stripeCheckoutSessionId: sessionId,
        stripePaymentIntentId: paymentIntentId,
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
      await WebhookEvent.updateOne(
        { eventId: event.id },
        { $set: { error: null, processedAt: new Date() } }
      );
    } catch (err) {
      if (err?.code === 11000) {
        return res.json({ received: true });
      }
      await WebhookEvent.updateOne(
        { eventId: event.id },
        { $set: { error: "package_checkout_failed", processedAt: new Date() } }
      );
      console.error("❌ Failed to update user after checkout:", err);
    }
  }

  return res.json({ received: true });
};

// GET /api/checkout/verify-session?session_id=cs_...
const verifyCheckoutSession = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return sendErr(req, res, 400, "session_id required");

    const session = await stripe.checkout.sessions.retrieve(session_id);
    return res.json({
      status: session.payment_status, // 'paid' | 'unpaid' | 'no_payment_required'
      email: session.metadata?.email,
      packageId: session.metadata?.packageId,
    });
  } catch (err) {
    console.error("Verify session error:", err);
    return sendErr(req, res, 500, "Failed to verify session");
  }
};

// GET /api/billing/addons/verify?session_id=cs_...
const verifyAddonSession = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return sendErr(req, res, 400, "session_id required");

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const meta = session?.metadata || {};
    if (meta.kind !== "addon") {
      return sendErr(req, res, 400, "Not an addon session");
    }
    const packageInstanceId = meta.packageInstanceId || null;
    const addonType = meta.addonType || null;
    const addonQty = meta.addonQty ? Number(meta.addonQty) : null;
    const addonPack = meta.addonPack || null;
    const requestId = meta.requestId || null;

    if (!packageInstanceId || !mongoose.Types.ObjectId.isValid(packageInstanceId)) {
      return sendErr(req, res, 400, "Invalid packageInstanceId");
    }
    const instance = await PackageInstance.findById(packageInstanceId);
    const applied = Boolean(instance && instance.lastAddonSessionId === session.id);

    return res.json({
      applied,
      instanceId: packageInstanceId,
      delta: addonType && addonQty ? { addonType, addonQty, addonPack } : null,
      paymentStatus: session.payment_status,
      sessionId: session.id,
      requestId,
    });
  } catch (err) {
    console.error("Verify addon session error:", err);
    return sendErr(req, res, 500, "Failed to verify addon session");
  }
};

module.exports = {
  createCheckoutSession,
  createAddonCheckoutSession,
  handleStripeWebhook,
  verifyCheckoutSession,
  verifyAddonSession,
};

// Manual test checklist:
// - Trigger checkout twice quickly and confirm only one PackageInstance is created for the session.
// - Replay a checkout.session.completed webhook and confirm it returns 200 without new PackageInstance.
// - Verify PackageInstance records include stripeCheckoutSessionId and stripePaymentIntentId.
