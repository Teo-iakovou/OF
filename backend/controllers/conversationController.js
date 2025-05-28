const Conversation = require("../models/conversation");

// Get all conversations for a user (sidebar/history)
const getConversations = async (req, res) => {
  try {
    const { userId } = req.query; // Use req.user._id if using JWT/middleware
    if (!userId) return res.status(400).json({ error: "UserId is required" });

    const conversations = await Conversation.find({ user: userId })
      .sort({ updatedAt: -1 })
      .select("-messages"); // omit messages for faster sidebar loading (optional)
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations." });
  }
};

// Get a single conversation (with all messages)
const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation)
      return res.status(404).json({ error: "Conversation not found" });
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversation." });
  }
};

// Delete a conversation
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    await Conversation.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete conversation." });
  }
};

module.exports = {
  getConversations,
  getConversationById,
  deleteConversation,
};
