const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
require("dotenv").config();

connectDB();
const coachChatRoutes = require("./routes/coach-chat");
const conversationRoutes = require("./routes/conversations");
const analyzeRoutes = require("./routes/analyze");
const userRoutes = require("./routes/userRoutes");
const checkoutRoutes = require("./routes/checkout");
const feedbackRoutes = require("./routes/feedbackRoutes");
const webhookController = require("./controllers/checkoutController");

const app = express();

// ✅ CORS first, for all routes
const allowedOrigins = [
  "http://localhost:3000",
  "https://airecomadations.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ Stripe webhook - must come before express.json
app.post(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  webhookController.handleStripeWebhook
);

// ✅ JSON parser (after webhook)
app.use(express.json());

// ✅ Main API routes
app.use("/api/analyze", analyzeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/coach-chat", coachChatRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/conversations", conversationRoutes);

const PORT = process.env.PORT || 5001;

if (!PORT) {
  throw new Error("🚨 PORT environment variable is required on Render.");
}
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
