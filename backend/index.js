const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/db");
// Load environment variables: base .env, then optional .env.local overlays
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
const { getCookieOptions } = require("./utils/jwt");
if (process.env.NODE_ENV !== "production") {
  const opts = getCookieOptions();
  try {
    console.log("[cookies] resolved", {
      sameSite: opts.sameSite,
      secure: opts.secure,
      domain: opts.domain || null,
    });
  } catch {}
}
const { validateAddonPriceEnv } = require("./config/addons");
validateAddonPriceEnv();
const coachChatRoutes = require("./routes/coach-chat");
const conversationRoutes = require("./routes/conversations");
const analyzeRoutes = require("./routes/analyze");
const renderRoutes = require("./routes/render");
const renderInternalRoutes = require("./routes/render-internal");
const userRoutes = require("./routes/userRoutes");
const checkoutRoutes = require("./routes/checkout");
const feedbackRoutes = require("./routes/feedbackRoutes");
const authRoutes = require("./routes/auth");
const billingRoutes = require("./routes/billing");
const debugRoutes = require("./routes/debug");
const personaRoutes = require("./routes/persona");
const recommendationRoutes = require("./routes/recommendations");
const webhookController = require("./controllers/checkoutController");
const PackageInstance = require("./models/packageInstance");
const { requestIdMiddleware } = require("./middleware/requestId");
const { authMiddleware } = require("./middleware/auth");
const { requireAuth } = require("./middleware/requireAuth");
const { ensureRekognitionCollection } = require("./utils/rekognition");
const { requestLogger } = require("./middleware/requestLogger");


const app = express();
app.post(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  webhookController.handleStripeWebhook
);
app.use(requestIdMiddleware);
// ✅ CORS for all routes (env-driven allowlist + credentials)
const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowAllCors = String(process.env.CORS_ALLOW_ALL || "").toLowerCase() === "true";
const shouldDebugCors =
  String(process.env.AUTH_DEBUG || "").toLowerCase() === "true" ||
  process.env.NODE_ENV !== "production";
if (process.env.NODE_ENV !== "test") {
  console.log("[cors] resolved", {
    nodeEnv: process.env.NODE_ENV || "development",
    allowAllCors,
    allowedOrigins,
  });
}
const corsOptions = {
  origin: allowAllCors
    ? true // reflect request origin (needed when credentials are used)
    : function (origin, callback) {
        // Allow no-origin requests (curl, mobile apps) and allowed origins
        const matched = !origin || allowedOrigins.includes(origin);
        if (shouldDebugCors) {
          console.log("[cors] origin-check", {
            origin: origin || null,
            matched,
            allowAllCors,
          });
        }
        if (matched) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // Let cors package reflect Access-Control-Request-Headers automatically.
  // Avoid hard-coding to prevent preflight failures on modern UA headers.
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ JSON parser (after webhook)
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);
app.use(requestLogger);
if (process.env.NODE_ENV !== "production") {
  app.use("/api/debug", debugRoutes);
}

// ✅ Auth routes (public)
app.use("/api/auth", authRoutes);

// ✅ Main API routes (protected)
app.use("/api/analyze", requireAuth, analyzeRoutes);
app.use("/api/render", requireAuth, renderRoutes); // stubbed v0 endpoints
app.use("/api/user", requireAuth, userRoutes);
app.use("/api/checkout", checkoutRoutes); // login not required for webhook/create
app.use("/api/coach-chat", requireAuth, coachChatRoutes);
app.use("/api/feedback", requireAuth, feedbackRoutes);
app.use("/api/conversations", requireAuth, conversationRoutes);
app.use("/api/render", requireAuth, renderRoutes);
app.use("/api/render-internal", renderInternalRoutes);
app.use("/api/billing", requireAuth, billingRoutes);
app.use("/api/persona", requireAuth, personaRoutes);
app.use("/api/recommendations", requireAuth, recommendationRoutes);

const PORT = process.env.PORT || 5001;

if (!PORT) {
  throw new Error("🚨 PORT environment variable is required on Render.");
}

(async () => {
  console.log("[startup]", { pid: process.pid, env: process.env.NODE_ENV || "development" });
  await connectDB();
  if (process.env.NODE_ENV !== "production") {
    await PackageInstance.syncIndexes();
  }
  await ensureRekognitionCollection();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})().catch((err) => {
  console.error("[startup] failed:", err?.message || err);
});
