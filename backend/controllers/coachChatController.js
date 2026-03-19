const OpenAI = require("openai");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const Result = require("../models/result"); // <-- used in suggestPrompts
const PackageInstance = require("../models/packageInstance");
const { sendQuotaError } = require("../utils/quotaError");
const { buildChatContext } = require("../services/chatContext"); // <-- used directly
const { log } = require("../utils/logger"); // <-- make sure this file exists (see note below)
const { sendErr } = require("../utils/sendErr");
const { ensureCycle, planLimit } = require("../middleware/chatLimits");

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

const DEFAULT_CONTEXT_LIMIT = Number(process.env.CHAT_CONTEXT_TOKENS_LIMIT || "128000");

function estimateTokensFromText(text = "") {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

function estimateTokensForMessages(messages = []) {
  return messages.reduce((sum, msg) => sum + estimateTokensFromText(msg?.content || ""), 0);
}

const coachChatHandler = async (req, res) => {
  const rid =
    req.requestId ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const t0 = Date.now();

  try {
    const { question, latestContentInfo, conversationId, title } = req.body || {};
    const email = req.user?.email || "";
    log(rid, "chat_start", { email });

    const user =
      req._user ||
      (req.user?.id ? await User.findById(req.user.id) : email ? await User.findOne({ email }) : null);
    if (!user) {
      log(rid, "chat_user_not_found", { email });
      return sendErr(req, res, 403, "User not found.");
    }

    const instance =
      user.activePackageInstanceId
        ? await PackageInstance.findOne({
            _id: user.activePackageInstanceId,
            userId: user._id,
            status: "active",
          })
        : null;
    if (!instance) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    await ensureCycle(instance);
    const plan = instance.planKey || "lite";
    const addonsChatTokens =
      typeof instance.addons?.chatTokens === "number"
        ? instance.addons.chatTokens
        : typeof instance.addons?.chat === "number"
          ? instance.addons.chat
          : 0;
    const baseChatLimit =
      typeof instance.chatMonthlyLimit === "number" ? instance.chatMonthlyLimit : planLimit(plan);
    const effectiveChatLimit =
      typeof req.chatQuota?.effectiveChatLimit === "number"
        ? req.chatQuota.effectiveChatLimit
        : baseChatLimit === 0
          ? 0
          : baseChatLimit + addonsChatTokens;
    // effectiveChatLimit === 0 means unlimited; never enforce plan quota.

    let conversation = null;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        log(rid, "chat_convo_not_found", { conversationId });
        return sendErr(req, res, 404, "Conversation not found");
      }
      if (conversation.user && conversation.user.toString() !== user._id.toString()) {
        return sendErr(req, res, 403, "Conversation not owned by user");
      }
    }

    const tokensLimit =
      conversation && typeof conversation.tokensLimit === "number" && conversation.tokensLimit > 0
        ? conversation.tokensLimit
        : DEFAULT_CONTEXT_LIMIT;
    const preSendTokens = estimateTokensForMessages([
      ...(conversation?.messages || []),
      { role: "user", content: question || "" },
    ]);

    if (preSendTokens >= tokensLimit) {
      if (conversation) {
        conversation.tokensUsed = preSendTokens;
        conversation.tokensLimit = tokensLimit;
        conversation.nearLimit = preSendTokens >= Math.round(tokensLimit * 0.85);
        await conversation.save();
      }
      return res.status(409).json({
        error: "CONTEXT_LIMIT_REACHED",
        tokensUsed: preSendTokens,
        tokensLimit,
      });
    }

    if (plan === "lite" && isPremiumRequest(question)) {
      log(rid, "chat_premium_gated", { plan });
      return res.json({
        ai: "This feature is available only on Pro/Ultimate plans. Upgrade to unlock advanced strategies, scripts, and more!",
      });
    }

    // --- First-ever message: structured intake (no OpenAI call) ---
    const isFirstEverMessage = (user.totalChatMessages ?? 0) === 0;
    let aiMessage;
    let usedContextIds = [];

    if (isFirstEverMessage) {
      aiMessage = `Hey! I’m Sage, your content strategist. Before I dive in, let me learn about you so every answer is relevant to YOUR account. Quick questions:\n\n1. What’s your main platform? (Instagram / TikTok / OnlyFans / other)\n2. What’s your content niche? (fitness, glamour, lifestyle, etc.)\n3. What’s your #1 goal right now? (more followers / more sales / better content)\n\nAnswer all three and I’ll give you a custom strategy instantly.`;
    } else {
      // --- Smart context (uses imported buildChatContext) ---
      const { bullets, ids: ctxIds } = await buildChatContext(email, {});
      usedContextIds = ctxIds;
      log(rid, "chat_context_ready", { usedContextCount: usedContextIds.length });

      // --- Prompt ---
      const systemPrompt = `
You are Sage — a sharp, direct OnlyFans content strategist. You give clear, actionable advice. No filler, no fluff.
Plan: ${plan}. Adjust what you recommend to what’s available on this plan.
Scope: captions, hashtags, posting schedules, content strategy${plan !== "lite" ? ", DM scripts" : ""}. Never give financial or legal advice.
Recent upload context:
${bullets.join("\n") || "• (no uploads found — ask the user to upload content first before making recommendations)"}
${latestContentInfo ? `Latest upload:\n${latestContentInfo}` : ""}
Rules: reference the upload context when it’s relevant. If context is empty, say so and ask for an upload. Be concise — lead with the answer.
`.trim();

      // --- OpenAI call ---
      log(rid, "chat_openai_start", { model: "gpt-4o" });
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: (question || "").trim() },
        ],
        max_tokens: 600,
        temperature: 0.8,
      });
      aiMessage = response.choices?.[0]?.message?.content?.trim() || "";
      const usage = response.usage || {};
      log(rid, "chat_openai_done", {
        latencyMs: Date.now() - t0,
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        openai_id: response.id,
      });
    }

    // --- Increment usage on success (per active package instance, atomic) ---
    try {
      if (effectiveChatLimit === 0) {
        const trackUnlimited = process.env.TRACK_UNLIMITED_CHAT_USAGE === "true";
        if (trackUnlimited) {
          await PackageInstance.updateOne(
            { _id: instance._id, userId: user._id, status: "active" },
            { $inc: { chatUsedThisCycle: 1 } }
          );
        }
      } else {
        const updated = await PackageInstance.findOneAndUpdate(
          {
            _id: instance._id,
            userId: user._id,
            status: "active",
            $expr: { $lt: ["$chatUsedThisCycle", effectiveChatLimit] },
          },
          { $inc: { chatUsedThisCycle: 1 } },
          { new: true }
        );
        if (!updated) {
          return sendQuotaError(res, 402, {
            message: "Chat limit reached for your plan",
            feature: "ai_chat",
            plan: instance.planKey,
            remaining: 0,
            limit: effectiveChatLimit,
            requestId: rid,
          });
        }
      }
    } catch (e) {
      log(rid, "chat_quota_increment_failed", { message: e?.message });
    }

    // --- Increment lifetime chat message counter ---
    await User.updateOne({ _id: user._id }, { $inc: { totalChatMessages: 1 } });

    // --- Conversation persistence ---
    if (conversationId && conversation) {
      conversation.messages.push(
        { role: "user", content: question || "" },
        { role: "assistant", content: aiMessage }
      );
      const postTokens = estimateTokensForMessages(conversation.messages);
      conversation.tokensUsed = postTokens;
      conversation.tokensLimit = tokensLimit;
      conversation.nearLimit = postTokens >= Math.round(tokensLimit * 0.85);
      conversation.updatedAt = Date.now();
      await conversation.save();
    } else {
      const postTokens = estimateTokensForMessages([
        { role: "user", content: question || "" },
        { role: "assistant", content: aiMessage },
      ]);
      conversation = await Conversation.create({
        user: user._id,
        title: title || "Untitled conversation",
        messages: [
          { role: "user", content: question || "" },
          { role: "assistant", content: aiMessage },
        ],
        tokensUsed: postTokens,
        tokensLimit,
        nearLimit: postTokens >= Math.round(tokensLimit * 0.85),
      });
    }
    log(rid, "chat_saved", { conversationId: conversation._id.toString() });

    return res.json({
      ai: aiMessage,
      conversation,
      usedContextIds,
      requestId: rid,
      latencyMs: Date.now() - t0,
      nearContextLimit: Boolean(conversation?.nearLimit),
      tokensUsed: conversation?.tokensUsed ?? null,
      tokensLimit: conversation?.tokensLimit ?? tokensLimit,
    });
  } catch (err) {
    log(rid, "chat_error", { message: err?.message });
    console.error("AI Coach Error:", err);
    return sendErr(req, res, 500, "AI coach failed to respond.");
  }
};

// --- NEW: quick prompts endpoint (personalized; no token cost) ---
async function suggestPrompts(req, res) {
  try {
    if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");
    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 404, "User not found");

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
    return sendErr(req, res, 500, "Failed to suggest prompts");
  }
}

module.exports = { coachChatHandler, suggestPrompts };
