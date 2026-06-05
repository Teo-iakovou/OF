const OpenAI = require("openai");
const User = require("../models/user");
const Conversation = require("../models/conversation");
const Result = require("../models/result");
const PackageInstance = require("../models/packageInstance");
const { sendQuotaError } = require("../utils/quotaError");
const { buildChatContext } = require("../services/chatContext");
const { log } = require("../utils/logger");
const { sendErr } = require("../utils/sendErr");
const { ensureCycle, planLimit } = require("../middleware/chatLimits");
const { resolveLanguageName } = require("../utils/locale");
const { moderateText, logModeration } = require("../utils/moderation");
const { countMessagesTokens } = require("../utils/tokenizer");
const { calculateOpenAICost } = require("../utils/cost");
const ApiUsage = require("../models/apiUsage");
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INTAKE_RESPONSES = {
  en: `Hey! I'm Sage, your content strategist. Before I dive in, let me learn about you so every answer is relevant to YOUR account. Quick questions:\n\n1. What's your main platform? (Instagram / TikTok / OnlyFans / other)\n2. What's your content niche? (fitness, glamour, lifestyle, etc.)\n3. What's your #1 goal right now? (more followers / more sales / better content)\n\nAnswer all three and I'll give you a custom strategy instantly.`,
  el: `Γεια! Είμαι ο Sage, ο σύμβουλος περιεχομένου σου. Πριν ξεκινήσουμε, ας σε γνωρίσω για να σου δίνω σχετικές συμβουλές. Τρεις γρήγορες ερωτήσεις:\n\n1. Ποια είναι η κύρια πλατφόρμα σου; (Instagram / TikTok / OnlyFans / άλλη)\n2. Ποια είναι η θεματική του περιεχομένου σου; (fitness, glamour, lifestyle, κλπ)\n3. Ποιος είναι ο νο.1 στόχος σου τώρα; (περισσότεροι followers / περισσότερες πωλήσεις / καλύτερο περιεχόμενο)\n\nΑπάντησε και στα τρία και θα σου δώσω custom στρατηγική αμέσως.`,
  es: `¡Hola! Soy Sage, tu estratega de contenido. Antes de empezar, déjame conocerte para que cada respuesta sea relevante para TU cuenta. Preguntas rápidas:\n\n1. ¿Cuál es tu plataforma principal? (Instagram / TikTok / OnlyFans / otra)\n2. ¿Cuál es el nicho de tu contenido? (fitness, glamour, lifestyle, etc.)\n3. ¿Cuál es tu objetivo #1 ahora mismo? (más seguidores / más ventas / mejor contenido)\n\nResponde a las tres y te daré una estrategia personalizada al instante.`,
  it: `Ciao! Sono Sage, il tuo stratega di contenuti. Prima di iniziare, fammi conoscerti meglio così ogni risposta sarà rilevante per il TUO account. Domande veloci:\n\n1. Qual è la tua piattaforma principale? (Instagram / TikTok / OnlyFans / altra)\n2. Qual è la nicchia del tuo contenuto? (fitness, glamour, lifestyle, ecc.)\n3. Qual è il tuo obiettivo #1 in questo momento? (più follower / più vendite / contenuto migliore)\n\nRispondi a tutte e tre e ti darò una strategia personalizzata all'istante.`,
};

function getIntakeResponse(locale) {
  const normalized = (typeof locale === "string" ? locale : "en").toLowerCase().slice(0, 2);
  return INTAKE_RESPONSES[normalized] || INTAKE_RESPONSES.en;
}

function buildSystemPrompt({ languageName, plan, bullets, latestContentInfo }) {
  return `
You are Sage — a sharp, direct OnlyFans content strategist. You give clear, actionable advice. No filler, no fluff.
Language: respond in ${languageName}. All advice, examples, captions, and hashtag suggestions should be in ${languageName} unless the user explicitly asks otherwise. Keep platform names (TikTok, Instagram, OnlyFans) in English as proper nouns.
Plan: ${plan}. Adjust what you recommend to what's available on this plan.
Scope: captions, hashtags, posting schedules, content strategy${plan !== "lite" ? ", DM scripts" : ""}. Never give financial or legal advice.
Recent upload context:
${Array.isArray(bullets) && bullets.length ? bullets.join("\n") : "• (no uploads found — ask the user to upload content first before making recommendations)"}
${latestContentInfo ? `Latest upload:\n${latestContentInfo}` : ""}
Rules: reference the upload context when it's relevant. If context is empty, say so and ask for an upload. Be concise — lead with the answer.
`.trim();
}

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
const TOKENS_PER_LEGACY_CHAT_UNIT = 500;

function estimateTokensFromText(text = "") {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

function estimateTokensForMessages(messages = []) {
  return countMessagesTokens(messages, "gpt-4o");
}

function toLegacyTokenValue(value, fallback = 0) {
  const raw = Number(value);
  if (!Number.isFinite(raw) || raw < 0) return fallback;
  return raw > 5000 ? raw : raw * TOKENS_PER_LEGACY_CHAT_UNIT;
}

const OPENAI_CHAT_MAX_ATTEMPTS = 2;
const OPENAI_CHAT_BASE_BACKOFF_MS = 300;
const OPENAI_CHAT_RATE_LIMIT_BACKOFF_MS = 2000;
const OPENAI_CHAT_TIMEOUT_MS = 30_000;

async function callOpenAIChatWithRetry({ messages, max_tokens, temperature, rid }) {
  let lastError = null;

  for (let attempt = 1; attempt <= OPENAI_CHAT_MAX_ATTEMPTS; attempt++) {
    try {
      const response = await openai.chat.completions.create(
        { model: "gpt-4o", messages, max_tokens, temperature },
        { timeout: OPENAI_CHAT_TIMEOUT_MS }
      );

      const content = response.choices?.[0]?.message?.content?.trim() || "";
      if (!content && attempt < OPENAI_CHAT_MAX_ATTEMPTS) {
        log(rid, "chat_openai_empty_response", { attempt });
        await new Promise((r) => setTimeout(r, OPENAI_CHAT_BASE_BACKOFF_MS));
        continue;
      }

      return response;
    } catch (err) {
      lastError = err;
      const status = err?.status || err?.response?.status;

      const isPermanent =
        (typeof status === "number" && status >= 400 && status < 500 && status !== 408 && status !== 429) ||
        err?.type === "invalid_request_error";

      if (isPermanent) {
        log(rid, "chat_openai_permanent_failure", { attempt, status, message: err?.message });
        throw err;
      }

      if (attempt >= OPENAI_CHAT_MAX_ATTEMPTS) {
        log(rid, "chat_openai_retry_exhausted", { attempts: attempt, status, message: err?.message });
        throw err;
      }

      const backoff = status === 429 ? OPENAI_CHAT_RATE_LIMIT_BACKOFF_MS : OPENAI_CHAT_BASE_BACKOFF_MS;
      log(rid, "chat_openai_retry", { attempt, status, message: err?.message, backoffMs: backoff });
      await new Promise((r) => setTimeout(r, backoff));
    }
  }

  throw lastError || new Error("OpenAI chat call failed after retries");
}

// ---------------------------------------------------------------------------
// Main chat handler — POST /api/coach-chat
// ---------------------------------------------------------------------------
const coachChatHandler = async (req, res) => {
  const rid =
    req.requestId ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const t0 = Date.now();

  try {
    const { question, latestContentInfo, conversationId, title, locale } = req.body || {};
    const languageName = resolveLanguageName(locale);
    const email = req.user?.email || "";
    log(rid, "chat_start", { email });

    const user =
      req._user ||
      (req.user?.id ? await User.findById(req.user.id) : email ? await User.findOne({ email }) : null);
    if (!user) {
      log(rid, "chat_user_not_found", { email });
      return sendErr(req, res, 403, "User not found.");
    }

    // --- Moderation ---
    const moderationResult = await moderateText(question || "");
    logModeration({
      userId: user._id,
      email: user.email,
      inputText: question || "",
      result: moderationResult,
      conversationId: conversationId || null,
      requestId: rid,
      locale,
    }).catch(() => {});
    if (moderationResult.blocked) {
      if (moderationResult.failureReason === "MODERATION_UNAVAILABLE") {
        log(rid, "chat_moderation_unavailable", {});
        return res.status(400).json({
          error: "MODERATION_UNAVAILABLE",
          message: "We couldn't process your message right now. Please try again in a moment.",
        });
      }
      log(rid, "chat_moderation_blocked", { blockedCategories: moderationResult.blockedCategories });
      return res.status(400).json({
        error: "CONTENT_BLOCKED",
        message: "Your message can't be processed. Please rephrase and try again.",
        blockedCategories: moderationResult.blockedCategories,
      });
    }

    // --- Load existing conversation (if continuing one) ---
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

    // --- Resolve owning package instance ----------------------------------------
    // For an existing conversation: use the package it was created under.
    // For a new conversation (or legacy conversation without packageInstanceId):
    //   fall back to the user's currently active package.
    // This ensures quota is always debited to the correct package.
    let owningInstance = null;

    if (conversation?.packageInstanceId) {
      owningInstance = await PackageInstance.findOne({
        _id: conversation.packageInstanceId,
        userId: user._id,
        status: "active",
      });
      if (!owningInstance) {
        return res.status(402).json({
          error: "This conversation belongs to a package that is no longer active.",
          code: "OWNING_PACKAGE_INACTIVE",
          requestId: rid,
        });
      }
    } else {
      // New conversation or legacy — use active package
      owningInstance = req._activePackageInstance ||
        (user.activePackageInstanceId
          ? await PackageInstance.findOne({
              _id: user.activePackageInstanceId,
              userId: user._id,
              status: "active",
            })
          : null);
    }

    if (!owningInstance) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    // --- Quota check against the OWNING instance (not active) -------------------
    await ensureCycle(owningInstance);

    const plan = owningInstance.planKey || "lite";
    const addonsChatTokens =
      typeof owningInstance.addons?.chatTokens === "number"
        ? owningInstance.addons.chatTokens
        : typeof owningInstance.addons?.chat === "number"
          ? owningInstance.addons.chat
          : 0;
    const baseChatLimit =
      typeof owningInstance.tokensLimit === "number" && owningInstance.tokensLimit >= 0
        ? owningInstance.tokensLimit
        : typeof owningInstance.chatMonthlyLimit === "number"
          ? toLegacyTokenValue(owningInstance.chatMonthlyLimit, planLimit(plan))
          : planLimit(plan);
    const effectiveChatLimit = baseChatLimit === 0 ? 0 : baseChatLimit + addonsChatTokens;
    const currentTokensUsed =
      typeof owningInstance.tokensUsed === "number" && owningInstance.tokensUsed >= 0
        ? owningInstance.tokensUsed
        : toLegacyTokenValue(owningInstance.chatUsedThisCycle, 0);

    if (effectiveChatLimit > 0 && currentTokensUsed >= effectiveChatLimit) {
      return sendQuotaError(res, 402, {
        message: "Chat token limit reached for your plan",
        feature: "ai_chat_tokens",
        plan: owningInstance.planKey,
        remaining: 0,
        limit: effectiveChatLimit,
        requestId: rid,
      });
    }

    // --- Context window check ---
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

    // --- First-ever message: intake (no OpenAI call) ----------------------------
    const isFirstEverMessage = (user.totalChatMessages ?? 0) === 0;
    let aiMessage;
    let usedContextIds = [];

    if (isFirstEverMessage) {
      aiMessage = getIntakeResponse(locale);
    } else {
      // --- Smart context ---
      const { bullets, ids: ctxIds } = await buildChatContext(email, {});
      usedContextIds = ctxIds;
      log(rid, "chat_context_ready", { usedContextCount: usedContextIds.length });

      const systemPrompt = buildSystemPrompt({ languageName, plan, bullets, latestContentInfo });

      // --- Build conversation history ---
      const HISTORY_MAX_MESSAGES = 20;
      const HISTORY_MAX_TOKENS = 8000;
      let historyMessages = [];
      if (conversation?.messages?.length) {
        let trimmed = conversation.messages.slice(-HISTORY_MAX_MESSAGES);
        while (trimmed.length > 0 && estimateTokensForMessages(trimmed) > HISTORY_MAX_TOKENS) {
          trimmed = trimmed.slice(2);
        }
        historyMessages = trimmed.map((m) => ({ role: m.role, content: m.content }));
      }
      log(rid, "chat_history_prepared", {
        storedCount: conversation?.messages?.length || 0,
        replayedCount: historyMessages.length,
      });

      // --- OpenAI call ---
      log(rid, "chat_openai_start", { model: "gpt-4o" });
      const response = await callOpenAIChatWithRetry({
        messages: [
          { role: "system", content: systemPrompt },
          ...historyMessages,
          { role: "user", content: (question || "").trim() },
        ],
        max_tokens: 600,
        temperature: 0.8,
        rid,
      });
      aiMessage = response.choices?.[0]?.message?.content?.trim() || "";
      const usage = response.usage || {};
      const realPromptTokens = typeof usage.prompt_tokens === "number" ? usage.prompt_tokens : 0;
      const realCompletionTokens = typeof usage.completion_tokens === "number" ? usage.completion_tokens : 0;
      const realTotalTokens =
        typeof usage.total_tokens === "number" && usage.total_tokens > 0
          ? usage.total_tokens
          : realPromptTokens + realCompletionTokens ||
            estimateTokensForMessages([
              { role: "user", content: (question || "").trim() },
              { role: "assistant", content: aiMessage },
            ]);

      log(rid, "chat_openai_done", {
        latencyMs: Date.now() - t0,
        prompt_tokens: realPromptTokens,
        completion_tokens: realCompletionTokens,
        total_tokens: realTotalTokens,
        openai_id: response.id,
        owningInstanceId: owningInstance._id.toString(),
      });

      // --- Increment usage on the OWNING package instance (atomic) --------------
      try {
        if (effectiveChatLimit === 0) {
          const trackUnlimited = process.env.TRACK_UNLIMITED_CHAT_USAGE === "true";
          if (trackUnlimited) {
            await PackageInstance.updateOne(
              { _id: owningInstance._id, userId: user._id, status: "active" },
              {
                $inc: { tokensUsed: realTotalTokens, chatUsedThisCycle: realTotalTokens },
                $set: { tokensLimit: baseChatLimit, chatMonthlyLimit: baseChatLimit },
              }
            );
          }
        } else {
          const updated = await PackageInstance.findOneAndUpdate(
            {
              _id: owningInstance._id,
              userId: user._id,
              status: "active",
              $expr: {
                $lte: [{ $add: [{ $ifNull: ["$tokensUsed", 0] }, realTotalTokens] }, effectiveChatLimit],
              },
            },
            {
              $inc: { tokensUsed: realTotalTokens, chatUsedThisCycle: realTotalTokens },
              $set: { tokensLimit: baseChatLimit, chatMonthlyLimit: baseChatLimit },
            },
            { new: true }
          );
          if (!updated) {
            return sendQuotaError(res, 402, {
              message: "Chat token limit reached for your plan",
              feature: "ai_chat_tokens",
              plan: owningInstance.planKey,
              remaining: 0,
              limit: effectiveChatLimit,
              requestId: rid,
            });
          }
        }
      } catch (e) {
        log(rid, "chat_quota_increment_failed", { message: e?.message });
      }

      // --- Log to ApiUsage (fire-and-forget) ---
      ApiUsage.create({
        userId: user._id,
        email: user.email,
        packageInstanceId: owningInstance._id,
        provider: "openai",
        endpoint: "chat",
        model: "gpt-4o",
        promptTokens: realPromptTokens,
        completionTokens: realCompletionTokens,
        totalTokens: realTotalTokens,
        costUsd: calculateOpenAICost({ model: "gpt-4o", promptTokens: realPromptTokens, completionTokens: realCompletionTokens }),
        conversationId: conversationId || null,
        requestId: rid,
        success: true,
        latencyMs: Date.now() - t0,
      }).catch((err) => {
        log(rid, "api_usage_log_failed", { message: err?.message });
      });
    }

    // --- Lifetime counter ---
    await User.updateOne({ _id: user._id }, { $inc: { totalChatMessages: 1 } });

    // --- Conversation persistence ------------------------------------------------
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
      // New conversation — stamp owning package
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
        packageInstanceId: owningInstance._id,
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

// ---------------------------------------------------------------------------
// GET /api/coach-chat/prompts — quick prompts (no token cost)
// ---------------------------------------------------------------------------
async function suggestPrompts(req, res) {
  try {
    if (!req.user || !req.user.id) return sendErr(req, res, 401, "Unauthorized");
    const user = await User.findById(req.user.id);
    if (!user) return sendErr(req, res, 404, "User not found");

    const plan = user.purchasedPackage || "lite";

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

    const prompts = plan === "lite" ? personalized : [...personalized, ...premium];

    return res.json({ prompts, meta: { plan, niche, tz } });
  } catch (e) {
    console.error("suggestPrompts error:", e?.message);
    return sendErr(req, res, 500, "Failed to suggest prompts");
  }
}

module.exports = { coachChatHandler, suggestPrompts };
