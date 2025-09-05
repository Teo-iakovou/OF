const axios = require("axios");

const ELEVEN_API = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_VOICE = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Rachel

function bad(res, code, msg) {
  return res.status(code).json({ error: msg });
}

async function synthesizePost(req, res) {
  return synthesizeCommon({
    text: req.body?.text,
    voiceId: req.body?.voiceId,
    modelId: req.body?.modelId,
    format: req.body?.format,
  }, res);
}

async function synthesizeGet(req, res) {
  return synthesizeCommon({
    text: req.query?.text,
    voiceId: req.query?.voiceId,
    modelId: req.query?.modelId,
    format: req.query?.format,
  }, res);
}

async function synthesizeCommon(params, res) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) return bad(res, 500, "Missing ELEVENLABS_API_KEY");

    const text = String(params.text || "");
    const voiceId = params.voiceId || DEFAULT_VOICE;
    const modelId = params.modelId || "eleven_multilingual_v2";
    const format = params.format || "mp3";

    if (!text || typeof text !== "string" || text.trim().length < 1) return bad(res, 400, "text is required");
    if (text.length > 5000) return bad(res, 400, "text too long (max 5000 chars)");

    // Request low-latency streaming from ElevenLabs and pipe directly to client
    const url = `${ELEVEN_API}/${encodeURIComponent(voiceId)}?optimize_streaming_latency=3`;
    const response = await axios.post(
      url,
      {
        text,
        model_id: modelId,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      },
      {
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "stream",
        timeout: 60000,
      }
    );

    res.setHeader("Content-Type", format === "mp3" ? "audio/mpeg" : "application/octet-stream");
    res.setHeader("Cache-Control", "no-store");
    response.data.pipe(res);
  } catch (e) {
    const status = e?.response?.status || 500;
    const detail = e?.response?.data || e?.message;
    console.error("TTS error:", status, detail);
    return bad(res, 502, "TTS synthesis failed");
  }
}

module.exports = { synthesizePost, synthesizeGet };
