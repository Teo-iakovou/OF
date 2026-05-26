const axios = require("axios");
const ApiUsage = require("../models/apiUsage");
const { calculateOpenAICost } = require("./cost");

const MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4-turbo";

function getPlatformToneGuide(platform) {
  const guides = {
    Instagram: `Aspirational, polished, lifestyle-driven. Allow longer captions with storytelling. Emoji used purposefully, never random. Hashtags fine in body or grouped at end. Audience: visual aesthetes.`,
    TikTok: `Hooky, urgent, energetic. "POV", "wait for it", "tell me why", "this is your sign". Lowercase casual style OK. Hashtags inline minimal. Audience: scrollers — first 3 words decide if they stop.`,
    Twitter: `Witty one-liner. Controversial takes, hot takes, observations. Short, punchy. No hashtags or 1 max. Sound like a real person, not a brand. Audience: irony-pilled.`,
    Reddit: `Conversational, lowercase, no marketing tone. Talk WITH the subreddit, not AT them. No hashtags, no emojis (rare exceptions). Audience: forum-native, allergic to ads.`,
    Telegram: `Personal, community-feeling. Direct address to fans/subscribers. Subtle exclusivity ("for my close circle..."). Audience: opt-in community.`,
    OnlyFans: `Enticing, exclusive, hint-driven. Tease without showing. "Just posted...", "members are loving...". Build anticipation. Audience: paid subscribers expecting reward.`,
  };
  return guides[platform] || `Adapt tone to ${platform}'s typical audience. Keep it natural, not corporate.`;
}

function getMaxWordsForPlatform(platform) {
  const limits = {
    Twitter: 20,
    TikTok: 25,
    Reddit: 30,
    Instagram: 40,
    Telegram: 35,
    OnlyFans: 30,
  };
  return limits[platform] || 25;
}

async function generateCaptionsWithOpenAI(visionData = {}, dynamicData = {}, {
  requestId,
  attempts = 2,
  timeoutMs = 12000,
  temperature = 0.8,
  avoidPhrases = [],
  languageName = "English",
  niche = null,
  recentCaptions = [],
  userId = null,
  packageInstanceId = null,
  email = null,
} = {}) {
  const objects = (visionData.objects || []).map(o => o.name).slice(0, 8).join(", ");
  const colors  = (visionData.dominantColors || [])
    .slice(0, 5)
    .map(c => `rgb(${c.r},${c.g},${c.b})`)
    .join(", ");
  const themes  = (visionData.webEntities || []).map(w => w.description).slice(0, 8).join(", ");
  const hashtags = Array.isArray(dynamicData.hashtags) ? dynamicData.hashtags.slice(0, 10) : [];
  const platform = dynamicData.platform || "Instagram";
  const avoidBlock = Array.isArray(avoidPhrases)
    ? avoidPhrases.filter(Boolean).slice(0, 10).map(p => `"${p}"`).join(", ")
    : "";
  const recentBlock = Array.isArray(recentCaptions) && recentCaptions.length > 0
    ? recentCaptions.slice(0, 5).map(c => `"${String(c).slice(0, 80)}"`).join(" | ")
    : "no history yet";
  const maxWords = getMaxWordsForPlatform(platform);

  const prompt = `You are a creative social media strategist generating 3 caption variants.

IMAGE CONTEXT
- Emotion: ${visionData.emotion || "Neutral"}
- Objects: ${objects || "n/a"}
- Dominant colors: ${colors || "n/a"}
- Web themes: ${themes || "n/a"}

CREATOR CONTEXT
- Niche: ${niche || "general lifestyle"}
- Platform: ${platform}
- Recent caption style (last 5): ${recentBlock}

PLATFORM TONE GUIDE
${getPlatformToneGuide(platform)}

LANGUAGE
Write all 3 captions in ${languageName}. Keep platform names (TikTok, Instagram, OnlyFans) in English. For hashtags: ${languageName} where natural; English where universal in niche (e.g. #fitness).

TASK
Generate 3 DISTINCT caption variants with different angles:
1. "hook" — A scroll-stopping opener. Question, bold claim, or unexpected take.
2. "aspirational" — Lifestyle-driven. Paint a feeling, an outcome, an identity.
3. "cta" — Direct call-to-action. Clear value prop + reason to engage now.

Each caption must:
- Be ≤ ${maxWords} words
- Match the recent caption style above (similar voice, energy, formality)
- Avoid these recent phrases: ${avoidBlock || "none"}
- Naturally include 2-3 hashtags from this pool: ${hashtags.length ? hashtags.join(" ") : "none"}
- Be platform-appropriate (avoid banned words on discovery platforms)

OUTPUT FORMAT
Return ONLY valid JSON, no markdown, no commentary:
[
  {"angle": "hook", "text": "..."},
  {"angle": "aspirational", "text": "..."},
  {"angle": "cta", "text": "..."}
]`;

  const payload = {
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature,
    max_tokens: 400,
  };

  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    const t0Caption = Date.now();
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
      const raw = data.choices?.[0]?.message?.content?.trim() || "";
      const usageData = data.usage || {};
      const promptTokens     = usageData.prompt_tokens     || 0;
      const completionTokens = usageData.completion_tokens || 0;
      const totalTokens      = usageData.total_tokens      || promptTokens + completionTokens;

      let variants = [];
      try {
        const cleaned = raw
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/```\s*$/, "")
          .trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          variants = parsed
            .filter(v => v && typeof v.text === "string" && v.text.trim().length > 0)
            .map(v => ({
              angle: String(v.angle || "default").trim(),
              text: String(v.text).trim(),
            }))
            .slice(0, 3);
        }
      } catch (parseErr) {
        console.error(JSON.stringify({
          requestId, stage: "caption_parse_failed", raw: raw.slice(0, 200), error: parseErr.message,
        }));
      }

      if (variants.length === 0 && raw) {
        variants = [{ angle: "default", text: raw }];
      }

      if (userId) {
        ApiUsage.create({
          userId,
          email: email || null,
          packageInstanceId: packageInstanceId || null,
          provider: "openai",
          endpoint: "caption",
          model: MODEL,
          promptTokens,
          completionTokens,
          totalTokens,
          costUsd: calculateOpenAICost({ model: MODEL, promptTokens, completionTokens }),
          requestId: requestId || null,
          success: true,
          latencyMs: Date.now() - t0Caption,
        }).catch((err) => {
          console.error("[caption] api_usage_log_failed:", err?.message);
        });
      }

      return { variants, raw };
    } catch (err) {
      lastErr = err;
      const wait = 300 * Math.pow(2, i - 1);
      console.error(JSON.stringify({
        requestId, stage: "openai_caption", attempt: i, error: err?.response?.data || err?.message,
      }));
      if (i < attempts) await new Promise(r => setTimeout(r, wait));
    }
  }

  return { variants: [], raw: "" };
}

// Backward-compat wrapper: returns single string like the old function did.
async function generateCaptionWithOpenAI(visionData = {}, dynamicData = {}, opts = {}) {
  const { variants } = await generateCaptionsWithOpenAI(visionData, dynamicData, opts);
  return variants[0]?.text || "";
}

module.exports = { generateCaptionsWithOpenAI, generateCaptionWithOpenAI };
