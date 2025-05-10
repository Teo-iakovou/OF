const Feedback = require("../models/feedback");

const createFeedback = async (req, res) => {
  const { message, email } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Feedback message is required" });
  }

  try {
    await Feedback.create({ message, email });
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("❌ Feedback error:", err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
};

module.exports = { createFeedback };
