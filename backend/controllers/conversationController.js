const Conversation = require("../models/conversation");
const User = require("../models/user");
const OpenAI = require("openai");

// Get all conversations for a user (sidebar/history)
const getConversations = async (req, res) => {
  try {
    // Accept email instead of userId
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Find conversations by user._id
    const conversations = await Conversation.find({ user: user._id })
      .sort({ updatedAt: -1 })
      .select("-messages");
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
// Generate a title for a conversation based on the first user message
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstUserMessage } = req.body;

    // Use Chat Completions API!
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4o" if you have access
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Write a short, clear chat title in 6 words or fewer.",
        },
        {
          role: "user",
          content: `Write a short, clear title for this conversation: "${firstUserMessage}"`,
        },
      ],
      max_tokens: 12,
      temperature: 0.5,
    });

    const title = chatResponse.choices[0].message.content.trim();

    await Conversation.findByIdAndUpdate(id, { title });

    res.json({ title });
  } catch (err) {
    console.error("Error in generateTitle:", err);
    res.status(500).json({ error: "Failed to generate title" });
  }
};

const createConversation = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Find user by email (or create user if you want auto-provisioning)
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
      // Or, to auto-create user on demand:
      // user = await User.create({ email });
    }

    // Create a new empty conversation for this user
    const conversation = await Conversation.create({
      user: user._id,
      title: "",
      messages: [],
    });

    // Return the new conversation object (or just the ID if you prefer)
    res.status(201).json(conversation);
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ error: "Failed to create conversation" });
  }
};

module.exports = {
  getConversations,
  getConversationById,
  deleteConversation,
  generateTitle,
  createConversation,
};
