const Conversation = require("../models/conversation");
const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");
const OpenAI = require("openai");
const mongoose = require("mongoose");
const { sendErr } = require("../utils/sendErr");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const cleanTitle = (t = "") => t.replace(/^["'\s]+|["'\s]+$/g, "").slice(0, 60);
const DEFAULT_CONTEXT_LIMIT = Number(process.env.CHAT_CONTEXT_TOKENS_LIMIT || "128000");

function estimateTokensFromText(text = "") {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

function estimateTokensForMessages(messages = []) {
  return messages.reduce((sum, msg) => sum + estimateTokensFromText(msg?.content || ""), 0);
}

/**
 * Resolve the PackageInstance for a new conversation.
 *
 * Mirrors analyzeController.resolvePackageInstanceForAnalyze:
 *   1. If caller sends a valid `packageInstanceId`, use that (verified against user).
 *   2. Otherwise fall back to user.activePackageInstanceId.
 */
async function resolvePackageInstanceForChat(user, requestedId) {
  if (requestedId && mongoose.Types.ObjectId.isValid(requestedId)) {
    const requested = await PackageInstance.findOne({
      _id: requestedId,
      userId: user._id,
      status: "active",
    });
    if (requested) return requested;
  }
  if (!user.activePackageInstanceId) return null;
  return PackageInstance.findOne({
    _id: user.activePackageInstanceId,
    userId: user._id,
    status: "active",
  });
}

// ---------------------------------------------------------------------------
// GET /api/conversations
// ---------------------------------------------------------------------------
const getConversations = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");

    const { packageInstanceId } = req.query;

    const filter = { user: req.user.id };

    if (packageInstanceId && mongoose.Types.ObjectId.isValid(packageInstanceId)) {
      // Verify ownership before using it as a filter
      const owns = await PackageInstance.exists({ _id: packageInstanceId, userId: req.user.id });
      if (!owns) return sendErr(req, res, 403, "Package instance not owned by user");
      filter.packageInstanceId = new mongoose.Types.ObjectId(packageInstanceId);
    } else {
      // Default: scope to user's currently active package so the sidebar
      // never accidentally shows cross-package conversations.
      const user = req._user || (await User.findById(req.user.id).select("activePackageInstanceId"));
      if (user?.activePackageInstanceId) {
        filter.packageInstanceId = user.activePackageInstanceId;
      }
    }

    const conversations = await Conversation.find(filter)
      .sort({ updatedAt: -1 })
      .select("-messages");
    res.json(conversations);
  } catch (err) {
    return sendErr(req, res, 500, "Failed to fetch conversations.");
  }
};

// ---------------------------------------------------------------------------
// GET /api/conversations/:id
// ---------------------------------------------------------------------------
const getConversationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");
    if (!mongoose.Types.ObjectId.isValid(id)) return sendErr(req, res, 400, "Invalid id");

    const conversation = await Conversation.findOne({ _id: id, user: req.user.id });
    if (!conversation) return sendErr(req, res, 404, "Conversation not found");

    // If the conversation belongs to a package, verify the user is currently
    // operating in that package context (i.e. it is their active package).
    // We return 403 with a machine-readable code so the frontend can prompt
    // the user to switch packages.
    if (conversation.packageInstanceId) {
      const user = req._user || (await User.findById(req.user.id).select("activePackageInstanceId"));
      const activeId = user?.activePackageInstanceId?.toString();
      const owningId = conversation.packageInstanceId.toString();
      if (activeId && activeId !== owningId) {
        return res.status(403).json({
          error: "Conversation belongs to a different package",
          code: "WRONG_PACKAGE_CONTEXT",
          owningPackageInstanceId: owningId,
        });
      }
    }

    res.json(conversation);
  } catch (err) {
    return sendErr(req, res, 500, "Failed to fetch conversation.");
  }
};

// ---------------------------------------------------------------------------
// DELETE /api/conversations/:id
// ---------------------------------------------------------------------------
const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");
    await Conversation.findOneAndDelete({ _id: id, user: req.user.id });
    res.json({ success: true });
  } catch (err) {
    return sendErr(req, res, 500, "Failed to delete conversation.");
  }
};

// ---------------------------------------------------------------------------
// POST /api/conversations
// ---------------------------------------------------------------------------
const createConversation = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");

    const user = req._user || (await User.findById(req.user.id));
    if (!user) return sendErr(req, res, 403, "User not found.");

    const requestedPackageInstanceId =
      typeof req.body?.packageInstanceId === "string" ? req.body.packageInstanceId : null;

    const instance = await resolvePackageInstanceForChat(user, requestedPackageInstanceId);
    if (!instance) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
      });
    }

    const conversation = await Conversation.create({
      user: req.user.id,
      title: "",
      messages: [],
      packageInstanceId: instance._id,
    });

    res.status(201).json(conversation);
  } catch (err) {
    console.error("Error creating conversation:", err);
    return sendErr(req, res, 500, "Failed to create conversation");
  }
};

// ---------------------------------------------------------------------------
// POST /api/conversations/:id/generate-title
// ---------------------------------------------------------------------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateTitle = async (req, res) => {
  const t0 = Date.now();
  try {
    const { id } = req.params;
    const { firstUserMessage } = req.body || {};

    if (!id) return sendErr(req, res, 400, "Missing conversation id");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendErr(req, res, 400, "Invalid conversation id");
    }
    if (!firstUserMessage || typeof firstUserMessage !== "string") {
      return sendErr(req, res, 400, "firstUserMessage is required");
    }

    const convo = await Conversation.findById(id).lean();
    if (!convo) return sendErr(req, res, 404, "Conversation not found");

    const systemMsg =
      "You are a helpful assistant. Write a short, clear chat title in 6 words or fewer. No quotes.";
    const userMsg = `Write a short, clear title for this conversation: "${firstUserMessage}"`;

    console.log("[genTitle] START", {
      convoId: id,
      userMsgPreview: firstUserMessage.slice(0, 120),
      model: "gpt-3.5-turbo",
    });

    const t1 = Date.now();
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
      timings: { totalMs: t3 - t0, openaiMs: t2 - t1, dbMs: t3 - t2 },
    });
  } catch (err) {
    console.error("[genTitle] ERROR", err);
    return sendErr(req, res, 500, "Failed to generate title");
  }
};

// ---------------------------------------------------------------------------
// POST /api/conversations/:id/summarize
// Creates a continuation conversation inheriting the same package.
// ---------------------------------------------------------------------------
const summarizeConversation = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");
    const { id } = req.params;
    if (!id) return sendErr(req, res, 400, "Missing conversation id");
    if (!mongoose.Types.ObjectId.isValid(id)) return sendErr(req, res, 400, "Invalid conversation id");

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
    try { parsed = JSON.parse(raw); } catch { parsed = null; }

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

    // Continuation inherits the parent's package
    const newConversation = await Conversation.create({
      user: req.user.id,
      title: `${conversation.title || "Untitled conversation"} (continued)`,
      messages: [summaryMessage],
      tokensUsed,
      tokensLimit: DEFAULT_CONTEXT_LIMIT,
      nearLimit: tokensUsed >= Math.round(DEFAULT_CONTEXT_LIMIT * 0.85),
      continuedFromConversationId: conversation._id,
      packageInstanceId: conversation.packageInstanceId ?? null,
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

// ---------------------------------------------------------------------------
// POST /api/conversations/:id/feedback
// ---------------------------------------------------------------------------
const submitFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { messageIndex, vote } = req.body || {};

    if (!req.user?.id) return sendErr(req, res, 401, "Unauthorized");
    if (vote !== "up" && vote !== "down") return sendErr(req, res, 400, "Invalid vote");
    if (typeof messageIndex !== "number" || !Number.isInteger(messageIndex) || messageIndex < 0) {
      return sendErr(req, res, 400, "Invalid messageIndex");
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) return sendErr(req, res, 404, "Conversation not found");
    if (conversation.user.toString() !== req.user.id.toString()) {
      return sendErr(req, res, 403, "Forbidden");
    }

    const msg = conversation.messages[messageIndex];
    if (!msg) return sendErr(req, res, 400, "messageIndex out of bounds");
    if (msg.role !== "assistant") return sendErr(req, res, 400, "Can only rate assistant messages");

    conversation.messages[messageIndex] = { ...msg.toObject?.() ?? msg, feedback: vote };
    conversation.markModified("messages");
    await conversation.save();

    return res.json({ ok: true });
  } catch (err) {
    return sendErr(req, res, 500, "Failed to save feedback");
  }
};

module.exports = {
  getConversations,
  getConversationById,
  deleteConversation,
  createConversation,
  generateTitle,
  summarizeConversation,
  submitFeedback,
};
