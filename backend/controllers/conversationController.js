const Conversation = require("../models/conversation");
const User = require("../models/user");
const OpenAI = require("openai");
const mongoose = require("mongoose");
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
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cleanTitle = (t = "") => t.replace(/^["'\s]+|["'\s]+$/g, "").slice(0, 60);

const generateTitle = async (req, res) => {
  const t0 = Date.now();
  try {
    const { id } = req.params;
    const { firstUserMessage } = req.body || {};

    // --- input validation ---
    if (!id) return res.status(400).json({ error: "Missing conversation id" });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("[genTitle] Invalid ObjectId:", id);
      return res.status(400).json({ error: "Invalid conversation id" });
    }
    if (!firstUserMessage || typeof firstUserMessage !== "string") {
      console.error("[genTitle] Missing firstUserMessage");
      return res.status(400).json({ error: "firstUserMessage is required" });
    }

    // --- ensure conversation exists ---
    const convo = await Conversation.findById(id).lean();
    if (!convo) {
      console.error("[genTitle] Conversation not found:", id);
      return res.status(404).json({ error: "Conversation not found" });
    }

    // --- build prompt/messages ---
    const systemMsg =
      "You are a helpful assistant. Write a short, clear chat title in 6 words or fewer. No quotes.";
    const userMsg = `Write a short, clear title for this conversation: "${firstUserMessage}"`;

    console.log("[genTitle] START", {
      convoId: id,
      userMsgPreview: firstUserMessage.slice(0, 120),
      model: "gpt-3.5-turbo",
    });

    const t1 = Date.now();

    // --- OpenAI call ---
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: userMsg },
      ],
      max_tokens: 12,
      temperature: 0.4,
    });

    const raw = chatResponse?.choices?.[0]?.message?.content || "";
    const candidate = cleanTitle(raw) || "Quick chat";

    const t2 = Date.now();
    console.log("[genTitle] OpenAI response", {
      raw,
      candidate,
      latencyMs: t2 - t1,
      requestId: chatResponse?.id,
    });

    // --- save to DB ---
    const updated = await Conversation.findByIdAndUpdate(
      id,
      { $set: { title: candidate, updatedAt: new Date() } },
      { new: true }
    ).lean();

    const t3 = Date.now();
    console.log("[genTitle] DB updated", {
      convoId: id,
      savedTitle: updated?.title,
      openaiLatencyMs: t2 - t1,
      totalMs: t3 - t0,
    });

    return res.json({
      ok: true,
      title: updated?.title || candidate,
      conversationId: id,
      timings: {
        totalMs: t3 - t0,
        openaiMs: t2 - t1,
        dbMs: t3 - t2,
      },
    });
  } catch (err) {
    console.error("[genTitle] ERROR", err);
    return res.status(500).json({ error: "Failed to generate title" });
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
  createConversation,
  generateTitle,
};
