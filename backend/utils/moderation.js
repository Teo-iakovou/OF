const OpenAI = require("openai");
const ModerationLog = require("../models/moderationLog");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODERATION_TIMEOUT_MS = 5000;

/**
 * Categories that BLOCK the message entirely.
 * These represent legal liability or universal harm.
 * Sexual content is intentionally excluded — echo-fy serves an adult-adjacent niche.
 */
const BLOCKING_CATEGORIES = [
  "sexual/minors",           // child safety — absolute
  "self-harm/intent",        // legal liability
  "self-harm/instructions",
  "violence/graphic",        // illegal/harmful content
  "hate/threatening",        // threats — illegal in many jurisdictions
  "illicit/violent",         // weapons, etc.
];

/**
 * Fire-and-forget: log a moderation system failure to ModerationLog so ops
 * can grep for MODERATION_UNAVAILABLE / API_ERROR in the same collection.
 */
function logModerationFailure({ error, text, reason }) {
  try {
    ModerationLog.create({
      inputText: typeof text === "string" ? text.slice(0, 2000) : "",
      inputLength: typeof text === "string" ? text.length : 0,
      flagged: false,
      blocked: true,
      blockedCategories: [],
      reason,
      errorMessage: error?.message?.slice(0, 500) ?? null,
    }).catch(() => {});
  } catch {
    // Never let logging failure mask the moderation failure.
  }
  console.error(`[moderation] ${reason}:`, error?.message ?? "(no message)");
}

/**
 * Run OpenAI moderation on text.
 * Fails CLOSED: on API error, timeout, or malformed response the message is
 * blocked so unscreened content never reaches chat completion.
 *
 * Returns:
 *   { allowed, blocked, blockedCategories, flagged, categories, categoryScores }
 *   On failure also includes { failureReason: "MODERATION_UNAVAILABLE" }
 */
async function moderateText(text) {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return {
      allowed: true,
      blocked: false,
      blockedCategories: [],
      flagged: false,
      categories: {},
      categoryScores: {},
    };
  }

  try {
    const response = await Promise.race([
      openai.moderations.create({
        model: "omni-moderation-latest",
        input: text,
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("MODERATION_TIMEOUT")),
          MODERATION_TIMEOUT_MS
        )
      ),
    ]);

    const result = response?.results?.[0];
    if (!result) {
      logModerationFailure({ text, reason: "MALFORMED_RESPONSE" });
      return {
        allowed: false,
        blocked: true,
        failureReason: "MODERATION_UNAVAILABLE",
        blockedCategories: [],
        flagged: false,
        categories: {},
        categoryScores: {},
      };
    }

    const blockedCategories = BLOCKING_CATEGORIES.filter(
      (cat) => result.categories?.[cat] === true
    );
    const blocked = blockedCategories.length > 0;

    return {
      allowed: !blocked,
      blocked,
      blockedCategories,
      flagged: Boolean(result.flagged),
      categories: result.categories || {},
      categoryScores: result.category_scores || {},
    };
  } catch (err) {
    logModerationFailure({ error: err, text, reason: "API_ERROR" });
    return {
      allowed: false,
      blocked: true,
      failureReason: "MODERATION_UNAVAILABLE",
      blockedCategories: [],
      flagged: false,
      categories: {},
      categoryScores: {},
    };
  }
}

/**
 * Persist a moderation event to MongoDB.
 * Fire-and-forget — only logs if the message was flagged or blocked.
 */
async function logModeration({ userId, email, inputText, result, conversationId, requestId, locale }) {
  if (!result.flagged && !result.blocked) return;

  try {
    await ModerationLog.create({
      userId: userId || null,
      email: email || null,
      inputText: inputText.slice(0, 2000),
      inputLength: inputText.length,
      flagged: result.flagged,
      blocked: result.blocked,
      categories: result.categories,
      categoryScores: result.categoryScores,
      blockedCategories: result.blockedCategories,
      reason: result.failureReason ?? null,
      conversationId: conversationId || null,
      requestId: requestId || null,
      locale: locale || null,
    });
  } catch (err) {
    console.error("[moderation] failed to log:", err?.message);
  }
}

module.exports = { moderateText, logModeration, BLOCKING_CATEGORIES };
