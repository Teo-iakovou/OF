const Feedback = require("../models/feedback");
const { sendErr } = require("../utils/sendErr");

const createFeedback = async (req, res) => {
  const { message } = req.body || {};

  if (!message || message.trim() === "") {
    return sendErr(req, res, 400, "Feedback message is required");
  }

  try {
    await Feedback.create({ message, email: req.user?.email });
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("❌ Feedback error:", err);
    return sendErr(req, res, 500, "Failed to save feedback");
  }
};

module.exports = { createFeedback };
