const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
require("dotenv").config();

connectDB();

const analyzeRoutes = require("./routes/analyze");
const userRoutes = require("./routes/userRoutes");
const checkoutRoutes = require("./routes/checkout");
const feedbackRoutes = require("./routes/feedbackRoutes"); // ✅ correct import
const webhookController = require("./controllers/checkoutController");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://airecomadations.netlify.app",
];

// CORS
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

// Stripe webhook – raw body
app.post(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  webhookController.handleStripeWebhook
);

// JSON parser
app.use(express.json());

// API Routes
app.use("/api/analyze", analyzeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
