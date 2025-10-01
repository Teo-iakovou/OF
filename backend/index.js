const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/db");
// Load environment variables: base .env, then optional .env.local overlays
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
connectDB();
const coachChatRoutes = require("./routes/coach-chat");
const conversationRoutes = require("./routes/conversations");
const analyzeRoutes = require("./routes/analyze");
const renderRoutes = require("./routes/render");
const renderInternalRoutes = require("./routes/render-internal");
const userRoutes = require("./routes/userRoutes");
const checkoutRoutes = require("./routes/checkout");
const feedbackRoutes = require("./routes/feedbackRoutes");
const ttsRoutes = require("./routes/tts");
const authRoutes = require("./routes/auth");
const webhookController = require("./controllers/checkoutController");
const { requestId } = require("./middleware/requestId");
const { authMiddleware } = require("./middleware/auth");
const { requireAuth } = require("./middleware/requireAuth");


const app = express();
app.use(requestId);
// ✅ CORS for all routes (env-driven allowlist + credentials)
const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const allowAllCors = String(process.env.CORS_ALLOW_ALL || "").toLowerCase() === "true";
if (process.env.NODE_ENV !== "test") {
  console.log("[cors] allowAll=", allowAllCors, "allowedOrigins=", allowedOrigins);
}
const corsOptions = {
  origin: allowAllCors
    ? true // reflect request origin (needed when credentials are used)
    : function (origin, callback) {
        // Allow no-origin requests (curl, mobile apps) and allowed origins
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "User-Agent",
    "Cache-Control",
    "Pragma",
  ],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ✅ Stripe webhook - must come before express.json
app.post(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  webhookController.handleStripeWebhook
);

// ✅ JSON parser (after webhook)
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

// ✅ Auth routes (public)
app.use("/api/auth", authRoutes);

// ✅ Main API routes (protected)
app.use("/api/analyze", requireAuth, analyzeRoutes);
app.use("/api/render", requireAuth, renderRoutes); // stubbed v0 endpoints
app.use("/api/user", requireAuth, userRoutes);
app.use("/api/checkout", checkoutRoutes); // login not required for webhook/create
app.use("/api/coach-chat", requireAuth, coachChatRoutes);
app.use("/api/feedback", requireAuth, feedbackRoutes);
app.use("/api/tts", requireAuth, ttsRoutes);
app.use("/api/conversations", requireAuth, conversationRoutes);
app.use("/api/render", requireAuth, renderRoutes);
app.use("/api/render-internal", renderInternalRoutes);

const PORT = process.env.PORT || 5001;

if (!PORT) {
  throw new Error("🚨 PORT environment variable is required on Render.");
}
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
