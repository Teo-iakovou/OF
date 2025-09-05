const OpenAI = require("openai");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const Result = require("../models/result"); // <-- used in suggestPrompts
const { buildChatContext } = require("../services/chatContext"); // <-- used directly
const { log } = require("../utils/logger"); // <-- make sure this file exists (see note below)

// Helper: simple keyword check for premium features
const premiumKeywords = [
  "content calendar",
  "pricing",
  "script",
  "sales funnel",
  "menu",
  "DM blast",
  "VIP",
  "bulk message",
];

function isPremiumRequest(question = "") {
  return premiumKeywords.some((kw) => question.toLowerCase().includes(kw));
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const coachChatHandler = async (req, res) => {
  const rid =
    req.requestId ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const t0 = Date.now();

  try {
    const { question, latestContentInfo, conversationId, title } = req.body || {};
    const email = req.user?.email || "";
    log(rid, "chat_start", { email });

    const user = req._user || (email ? await User.findOne({ email }) : null);
    if (!user) {
      log(rid, "chat_user_not_found", { email });
      return res.status(403).json({ error: "User not found." });
    }

    const plan = user.purchasedPackage || "lite";

    // --- Your current limit logic (simple per-plan) ---
    user.chatsUsed = user.chatsUsed || 0;
    let chatLimit = 3;
    if (plan === "pro") chatLimit = 20;
    if (plan === "ultimate") chatLimit = 1000;

    if (user.chatsUsed >= chatLimit) {
      log(rid, "chat_limit_hit", {
        plan,
        used: user.chatsUsed,
        limit: chatLimit,
      });
      // TIP: return 402 so the frontend can show the Upgrade UI automatically
      return res.status(402).json({
        error: "You’ve reached your chat limit for this plan.",
        action: "upgrade",
        quota: { used: user.chatsUsed, limit: chatLimit },
      });
      // If you prefer old behavior: return res.json({ ai: "You’ve reached..." })
    }

    if (plan === "lite" && isPremiumRequest(question)) {
      log(rid, "chat_premium_gated", { plan });
      return res.json({
        ai: "This feature is available only on Pro/Ultimate plans. Upgrade to unlock advanced strategies, scripts, and more!",
      });
    }

    // --- Smart context (uses imported buildChatContext) ---
    const { bullets, ids: usedContextIds } = await buildChatContext(email, {});
    log(rid, "chat_context_ready", { usedContextCount: usedContextIds.length });

    // --- Prompt ---
    const systemPrompt = `
You are Sage, an OnlyFans strategist AI. The user’s current plan: ${plan}.
Recent context (last uploads):
${bullets.join("\n") || "• (no prior uploads found)"}
Latest content note: ${latestContentInfo || "n/a"}
Always be clear and direct about what features are available for each plan.
`.trim();

    // --- OpenAI call ---
    log(rid, "chat_openai_start", { model: "gpt-4o" });
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: (question || "").trim() },
      ],
      max_tokens: 350,
      temperature: 0.8,
    });
    const aiMessage = response.choices?.[0]?.message?.content?.trim() || "";
    const usage = response.usage || {};
    log(rid, "chat_openai_done", {
      latencyMs: Date.now() - t0,
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
      total_tokens: usage.total_tokens,
      openai_id: response.id,
    });

    // --- Increment usage on success ---
    user.chatsUsed += 1; // If you migrate to monthly fields, update here
    await user.save();

    // --- Conversation persistence ---
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        log(rid, "chat_convo_not_found", { conversationId });
        return res.status(404).json({ error: "Conversation not found" });
      }
      conversation.messages.push(
        { role: "user", content: question || "" },
        { role: "assistant", content: aiMessage }
      );
      conversation.updatedAt = Date.now();
      await conversation.save();
    } else {
      conversation = await Conversation.create({
        user: user._id,
        title: title || "Untitled conversation",
        messages: [
          { role: "user", content: question || "" },
          { role: "assistant", content: aiMessage },
        ],
      });
    }
    log(rid, "chat_saved", { conversationId: conversation._id.toString() });

    return res.json({
      ai: aiMessage,
      conversation,
      usedContextIds,
      requestId: rid,
      latencyMs: Date.now() - t0,
    });
  } catch (err) {
    log(rid, "chat_error", { message: err?.message });
    console.error("AI Coach Error:", err);
    return res.status(500).json({ error: "AI coach failed to respond." });
  }
};

// --- NEW: quick prompts endpoint (personalized; no token cost) ---
async function suggestPrompts(req, res) {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: "Unauthorized" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const plan = user.purchasedPackage || "lite";

    // Peek at recent uploads to personalize
    const recent = await Result.find({ email: user.email })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const niche = recent[0]?.niche || "general";
    const tz = user.timezone || "Europe/Athens";

    const personalized = [
      `Write a short ${niche} caption (<20 words) that fits IG rules`,
      `Suggest 5 ${niche} hashtags with low/medium competition`,
      `What are my best posting windows this week in ${tz}?`,
    ];

    const premium = [
      `Draft a 3-message DM sequence for ${niche} to boost conversions`,
      `Create a 7-day content outline mixing teasers and ${niche} posts`,
    ];

    const prompts =
      plan === "lite" ? personalized : [...personalized, ...premium];

    return res.json({ prompts, meta: { plan, niche, tz } });
  } catch (e) {
    console.error("suggestPrompts error:", e?.message);
    return res.status(500).json({ error: "Failed to suggest prompts" });
  }
}

module.exports = { coachChatHandler, suggestPrompts };
