const OpenAI = require("openai");
const ModerationLog = require("../models/moderationLog");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
 * Run OpenAI moderation on text.
 * Fails open: if the moderation API is down, returns allowed=true so legitimate users aren't blocked.
 *
 * Returns:
 *   { allowed, blocked, blockedCategories, flagged, categories, categoryScores }
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
    const response = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: text,
    });

    const result = response.results?.[0];
    if (!result) {
      return {
        allowed: true,
        blocked: false,
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
    console.error("[moderation] API call failed:", err?.message);
    return {
      allowed: true,
      blocked: false,
      blockedCategories: [],
      flagged: false,
      categories: {},
      categoryScores: {},
      error: err?.message,
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
      conversationId: conversationId || null,
      requestId: requestId || null,
      locale: locale || null,
    });
  } catch (err) {
    console.error("[moderation] failed to log:", err?.message);
  }
}

module.exports = { moderateText, logModeration, BLOCKING_CATEGORIES };
