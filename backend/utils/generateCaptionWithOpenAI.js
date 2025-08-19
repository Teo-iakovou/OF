const axios = require("axios");

const MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4-turbo";

async function generateCaptionWithOpenAI(visionData = {}, dynamicData = {}, {
  requestId,
  attempts = 2,
  timeoutMs = 12000,
  temperature = 0.8,
} = {}) {
  const objects = (visionData.objects || []).map(o => o.name).slice(0, 8).join(", ");
  const colors  = (visionData.dominantColors || [])
    .slice(0, 5)
    .map(c => `rgb(${c.r},${c.g},${c.b})`)
    .join(", ");
  const themes  = (visionData.webEntities || []).map(w => w.description).slice(0, 8).join(", ");
  const hashtags = Array.isArray(dynamicData.hashtags) ? dynamicData.hashtags.slice(0, 10).join(" ") : "";
  const bestPostTime = dynamicData.bestPostTime || "18:00";
  const platform = dynamicData.platform || "Instagram";

  const prompt = `
You are a creative social media strategist.

Image context:
- Emotion: ${visionData.emotion || "Neutral"}
- Objects: ${objects || "n/a"}
- Dominant colors: ${colors || "n/a"}
- Web themes: ${themes || "n/a"}

Task:
- Target platform: ${platform}
- Tone: catchy but not cringe, no emojis unless natural
- Length: ≤ 20 words
- If hashtags provided, place 2–3 of them naturally (optional)
- Avoid banned words on discovery platforms; keep it platform-appropriate

Extra context:
- Suggested time: ${bestPostTime}
- Hashtag pool: ${hashtags}
`;

  const payload = {
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature,
    max_tokens: 80,
  };

  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const { data } = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: timeoutMs,
        }
      );
      return data.choices?.[0]?.message?.content?.trim() || "";
    } catch (err) {
      lastErr = err;
      const wait = 300 * Math.pow(2, i - 1);
      console.error(JSON.stringify({
        requestId, stage: "openai_caption", attempt: i, error: err?.response?.data || err?.message
      }));
      if (i < attempts) await new Promise(r => setTimeout(r, wait));
    }
  }
  // Graceful: return empty string on failure
  return "";
}

module.exports = { generateCaptionWithOpenAI };