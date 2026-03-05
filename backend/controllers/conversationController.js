const Conversation = require("../models/conversation");
const User = require("../models/user");
const OpenAI = require("openai");
const mongoose = require("mongoose");
const { sendErr } = require("../utils/sendErr");
// Get all conversations for a user (sidebar/history)
const getConversations = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");

    // Find conversations by user._id
    const conversations = await Conversation.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .select("-messages");
    res.json(conversations);
  } catch (err) {
    return sendErr(req, res, 500, "Failed to fetch conversations.");
  }
};

// Get a single conversation (with all messages)
const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Conversation.findById(id);
    if (!conversation) return sendErr(req, res, 404, "Conversation not found");
    res.json(conversation);
  } catch (err) {
    return sendErr(req, res, 500, "Failed to fetch conversation.");
  }
};

// Delete a conversation
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    await Conversation.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    return sendErr(req, res, 500, "Failed to delete conversation.");
  }
};
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cleanTitle = (t = "") => t.replace(/^["'\s]+|["'\s]+$/g, "").slice(0, 60);
const DEFAULT_CONTEXT_LIMIT = Number(process.env.CHAT_CONTEXT_TOKENS_LIMIT || "128000");

function estimateTokensFromText(text = "") {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

function estimateTokensForMessages(messages = []) {
  return messages.reduce((sum, msg) => sum + estimateTokensFromText(msg?.content || ""), 0);
}

const generateTitle = async (req, res) => {
  const t0 = Date.now();
  try {
    const { id } = req.params;
    const { firstUserMessage } = req.body || {};

    // --- input validation ---
    if (!id) return sendErr(req, res, 400, "Missing conversation id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("[genTitle] Invalid ObjectId:", id);
      return sendErr(req, res, 400, "Invalid conversation id");
    }
    if (!firstUserMessage || typeof firstUserMessage !== "string") {
      console.error("[genTitle] Missing firstUserMessage");
      return sendErr(req, res, 400, "firstUserMessage is required");
    }

    // --- ensure conversation exists ---
    const convo = await Conversation.findById(id).lean();
    if (!convo) {
      console.error("[genTitle] Conversation not found:", id);
      return sendErr(req, res, 404, "Conversation not found");
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
    return sendErr(req, res, 500, "Failed to generate title");
  }
};

const createConversation = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");

    // Create a new empty conversation for this user
    const conversation = await Conversation.create({
      user: req.user.id,
      title: "",
      messages: [],
    });

    // Return the new conversation object (or just the ID if you prefer)
    res.status(201).json(conversation);
  } catch (err) {
    console.error("Error creating conversation:", err);
    return sendErr(req, res, 500, "Failed to create conversation");
  }
};

const summarizeConversation = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");
    const { id } = req.params;
    if (!id) return sendErr(req, res, 400, "Missing conversation id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErr(req, res, 400, "Invalid conversation id");
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) return sendErr(req, res, 404, "Conversation not found");
    if (conversation.user.toString() !== req.user.id) {
      return sendErr(req, res, 403, "Conversation not owned by user");
    }

    const transcript = (conversation.messages || [])
      .filter((m) => m.role !== "system")
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");
    const systemMsg =
      "Return JSON only with keys: summary (string), keyFacts (string[]), userPreferences (string[]). Keep it concise.";

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: transcript.slice(0, 12000) },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const raw = chatResponse?.choices?.[0]?.message?.content?.trim() || "";
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
    const summaryPayload = {
      v: 1,
      summary: typeof parsed?.summary === "string" ? parsed.summary : raw || "Summary unavailable.",
      keyFacts: Array.isArray(parsed?.keyFacts) ? parsed.keyFacts.filter((v) => typeof v === "string") : [],
      userPreferences: Array.isArray(parsed?.userPreferences)
        ? parsed.userPreferences.filter((v) => typeof v === "string")
        : [],
    };
    if (!summaryPayload.summary || typeof summaryPayload.summary !== "string") {
      return sendErr(req, res, 500, "Failed to generate summary");
    }
    const summaryJson = JSON.stringify(summaryPayload);
    const summaryMessage = { role: "system", content: summaryJson };
    const tokensUsed = estimateTokensForMessages([summaryMessage]);

    const newConversation = await Conversation.create({
      user: req.user.id,
      title: `${conversation.title || "Untitled conversation"} (continued)`,
      messages: [summaryMessage],
      tokensUsed,
      tokensLimit: DEFAULT_CONTEXT_LIMIT,
      nearLimit: tokensUsed >= Math.round(DEFAULT_CONTEXT_LIMIT * 0.85),
      continuedFromConversationId: conversation._id,
    });
    await Conversation.updateOne(
      { _id: conversation._id },
      { $set: { continuedToConversationId: newConversation._id } }
    );

    return res.json({
      ok: true,
      newConversationId: newConversation._id.toString(),
      summary: summaryPayload,
    });
  } catch (err) {
    console.error("Error summarizing conversation:", err);
    return sendErr(req, res, 500, "Failed to summarize conversation");
  }
};

module.exports = {
  getConversations,
  getConversationById,
  deleteConversation,
  createConversation,
  generateTitle,
  summarizeConversation,
};
