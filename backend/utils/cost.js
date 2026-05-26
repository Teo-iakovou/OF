// Prices in USD per 1M tokens — source: openai.com/api/pricing (2026-05)
const OPENAI_PRICING = {
  "gpt-4o":       { input: 2.50,  output: 10.00 },
  "gpt-4-turbo":  { input: 10.00, output: 30.00 },
  "gpt-3.5-turbo":{ input: 0.50,  output: 1.50  },
};

const GOOGLE_VISION_PRICE_PER_CALL = 0.0015; // $1.50 per 1000 calls

function calculateOpenAICost({ model, promptTokens, completionTokens }) {
  const pricing = OPENAI_PRICING[model];
  if (!pricing) return 0;

  const inputCost  = (promptTokens     / 1_000_000) * pricing.input;
  const outputCost = (completionTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

function calculateGoogleVisionCost(callCount = 1) {
  return callCount * GOOGLE_VISION_PRICE_PER_CALL;
}

module.exports = {
  calculateOpenAICost,
  calculateGoogleVisionCost,
  OPENAI_PRICING,
  GOOGLE_VISION_PRICE_PER_CALL,
};
