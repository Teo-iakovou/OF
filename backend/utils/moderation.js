const OpenAI = require("openai");
const ModerationLog = require("../models/moderationLog");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TIMEOUT_TEXT_MS = 5000;
const TIMEOUT_IMAGE_MS = 8000;
const RETRY_IMAGE = 1; // one retry on transient failures for larger payloads

const TEXT_BLOCKING_CATEGORIES = [
  "sexual/minors",           // child safety — absolute
  "self-harm/intent",        // legal liability
  "self-harm/instructions",
  "violence/graphic",        // illegal/harmful content
  "hate/threatening",        // threats — illegal in many jurisdictions
  "illicit/violent",         // weapons, etc.
  // Note: "sexual" deliberately omitted — echo-fy niches overlap this category.
];

const IMAGE_BLOCKING_CATEGORIES = [
  "sexual/minors",           // child safety — absolute
  "self-harm",
  "self-harm/intent",        // legal liability
  "self-harm/instructions",
  "violence/graphic",        // illegal/harmful content
  "hate/threatening",        // threats
  "illicit/violent",         // weapons, illegal acts
  // Note: "sexual" deliberately omitted — same reasoning as text.
];

// ── Shared private helpers ────────────────────────────────────────────────────

async function callOpenAIWithTimeout(payload, timeoutMs) {
  const result = await Promise.race([
    openai.moderations.create(payload),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("MODERATION_TIMEOUT")), timeoutMs)
    ),
  ]);
  const entry = result?.results?.[0];
  if (!entry) throw new Error("MALFORMED_RESPONSE");
  return entry;
}

function evaluateResult(result, blockingCategories) {
  const blockedCategories = blockingCategories.filter(
    (cat) => result.categories?.[cat] === true
  );
  return {
    allowed: blockedCategories.length === 0,
    blocked: blockedCategories.length > 0,
    blockedCategories,
    flagged: Boolean(result.flagged),
    categories: result.categories ?? {},
    categoryScores: result.category_scores ?? {},
  };
}

function logModerationFailure({ error, text, imageRef, inputType = "text", reason }) {
  try {
    ModerationLog.create({
      inputType,
      inputText: typeof text === "string" ? text.slice(0, 2000) : "",
      imageRef: imageRef ?? null,
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
  console.error(`[moderation] ${inputType} ${reason}:`, error?.message ?? "(no message)");
}

// ── Public: moderate text ─────────────────────────────────────────────────────

/**
 * Run OpenAI moderation on text.
 * Fails CLOSED: on API error, timeout, or malformed response the message is
 * blocked so unscreened content never reaches chat completion.
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
    const result = await callOpenAIWithTimeout(
      { model: "omni-moderation-latest", input: text },
      TIMEOUT_TEXT_MS
    );
    return evaluateResult(result, TEXT_BLOCKING_CATEGORIES);
  } catch (err) {
    const reason =
      err.message === "MODERATION_TIMEOUT" ? "TIMEOUT"
      : err.message === "MALFORMED_RESPONSE" ? "MALFORMED_RESPONSE"
      : "API_ERROR";
    logModerationFailure({ error: err, text, inputType: "text", reason });
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

// ── Public: moderate image ────────────────────────────────────────────────────

/**
 * Run OpenAI moderation on an image.
 * Accepts a base64 data URL ("data:image/jpeg;base64,...") or a public HTTPS URL.
 * Retries once with 4s backoff on transient failures (larger payloads are more
 * susceptible to timeouts). Fails CLOSED on exhaustion.
 *
 * Returns:
 *   { allowed, blocked, blockedCategories, flagged, categories, categoryScores }
 *   On failure also includes { failureReason: "MODERATION_UNAVAILABLE" }
 */
async function moderateImage(imageDataUrlOrUrl, { imageRef = null } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= RETRY_IMAGE; attempt++) {
    try {
      const result = await callOpenAIWithTimeout(
        {
          model: "omni-moderation-latest",
          input: [{ type: "image_url", image_url: { url: imageDataUrlOrUrl } }],
        },
        TIMEOUT_IMAGE_MS
      );
      return evaluateResult(result, IMAGE_BLOCKING_CATEGORIES);
    } catch (err) {
      lastErr = err;
      if (attempt < RETRY_IMAGE) {
        await new Promise((r) => setTimeout(r, 4000));
      }
    }
  }
  const reason =
    lastErr.message === "MODERATION_TIMEOUT" ? "TIMEOUT"
    : lastErr.message === "MALFORMED_RESPONSE" ? "MALFORMED_RESPONSE"
    : "API_ERROR";
  logModerationFailure({ error: lastErr, imageRef, inputType: "image", reason });
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

// ── Public: log a moderation event ───────────────────────────────────────────

/**
 * Persist a moderation event to MongoDB.
 * Fire-and-forget — only logs if the image/text was flagged or blocked.
 * Backward-compatible: callers that don't pass inputType default to "text".
 */
async function logModeration({
  userId,
  email,
  inputType = "text",
  inputText,
  imageRef,
  result,
  conversationId,
  requestId,
  locale,
}) {
  if (!result.flagged && !result.blocked) return;

  try {
    await ModerationLog.create({
      userId: userId || null,
      email: email || null,
      inputType,
      inputText: inputType === "text" && typeof inputText === "string"
        ? inputText.slice(0, 2000)
        : "",
      imageRef: inputType === "image" ? (imageRef ?? null) : null,
      inputLength: typeof inputText === "string" ? inputText.length : 0,
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

module.exports = {
  moderateText,
  moderateImage,
  logModeration,
  TEXT_BLOCKING_CATEGORIES,
  IMAGE_BLOCKING_CATEGORIES,
  // Backward-compat alias for any code that imported BLOCKING_CATEGORIES directly
  BLOCKING_CATEGORIES: TEXT_BLOCKING_CATEGORIES,
};
