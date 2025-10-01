// Maps friendly UI voice ids to ElevenLabs voice IDs.
// You can override defaults with environment variables.

const DEFAULTS = {
  en_male_1: process.env.ELEVENLABS_VOICE_EN_MALE_1 || "EXAVITQu4vr4xnSDxMaL", // Adam (example)
  en_female_1: process.env.ELEVENLABS_VOICE_EN_FEMALE_1 || "21m00Tcm4TlvDq8ikWAM", // Rachel
};

function resolveVoiceId(input, fallback) {
  if (!input) return fallback;
  return DEFAULTS[input] || input;
}

module.exports = { resolveVoiceId };

