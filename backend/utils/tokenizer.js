const { encoding_for_model, get_encoding } = require("tiktoken");

// Cache encoders to avoid re-creating them per call
const encoderCache = new Map();

function getEncoder(model) {
  if (encoderCache.has(model)) return encoderCache.get(model);

  try {
    const enc = encoding_for_model(model);
    encoderCache.set(model, enc);
    return enc;
  } catch {
    // Unknown model — use cl100k_base (covers gpt-4o, gpt-4-turbo, gpt-3.5-turbo)
    try {
      const enc = get_encoding("cl100k_base");
      encoderCache.set(model, enc);
      return enc;
    } catch (err2) {
      console.error("[tokenizer] failed to load encoder:", err2?.message);
      return null;
    }
  }
}

/**
 * Count tokens in a single string.
 * Falls back to char/4 if tiktoken fails to load.
 */
function countTokens(text, model = "gpt-4o") {
  if (!text || typeof text !== "string") return 0;

  const enc = getEncoder(model);
  if (!enc) return Math.ceil(text.length / 4);

  try {
    return enc.encode(text).length;
  } catch {
    return Math.ceil(text.length / 4);
  }
}

/**
 * Count tokens for a chat messages array.
 * Adds ~3 tokens per message for OpenAI role/wrapping overhead, plus 3 for assistant priming.
 */
function countMessagesTokens(messages, model = "gpt-4o") {
  if (!Array.isArray(messages) || messages.length === 0) return 0;

  let total = 0;
  for (const m of messages) {
    if (typeof m?.content === "string") {
      total += countTokens(m.content, model);
      total += 3; // per-message overhead
    }
  }
  total += 3; // assistant priming
  return total;
}

module.exports = { countTokens, countMessagesTokens };
