const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");
require("dotenv").config();
connectDB();

const analyzeRoutes = require("./routes/analyze");
const userRoutes = require("./routes/userRoutes");
const checkoutRoutes = require("./routes/checkout");
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // ✅ Allow requests from Next.js frontend
app.use(express.json());

// Routes
app.use("/api/analyze", analyzeRoutes); // ✅ Now API requests to http://localhost:5000/api/analyze will work
app.use("/api/user", userRoutes);
app.use(
  "/api/checkout/webhook",
  express.raw({ type: "application/json" }),
  checkoutRoutes
);
app.use("/api/checkout", require("./routes/checkout"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
