const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const { putObject, signUrl } = require("../utils/s3");
const axios = require("axios");
const { analyzeImageBufferWithGoogleVision } = require("../utils/analyzeImageWithGoogleVision");
const RenderJob = require("../models/renderJob");

const router = express.Router();
const upload = multer({ dest: path.resolve(__dirname, "../uploads") });

// POST /api/render/generate
// multipart/form-data: image file + fields: text, voiceId, consent
router.post("/generate", upload.single("image"), async (req, res) => {
  try {
    const email = req.user?.email;
    const { text, voiceId, consent } = req.body || {};
    if (!email) return res.status(401).json({ error: "Unauthorized" });
    if (!consent || String(consent) !== "true") return res.status(400).json({ error: "Consent is required" });
    if (!text || typeof text !== "string") return res.status(400).json({ error: "Text is required" });
    if (text.length > 1200) return res.status(400).json({ error: "Text exceeds 1,200 character limit" });
    if (!req.file) return res.status(400).json({ error: "Image file is required" });
    if (req.file.size > 10 * 1024 * 1024) return res.status(400).json({ error: "Image too large (max 10MB)" });

    const mime = req.file.mimetype || "";
    if (!/^image\/(jpeg|png)$/i.test(mime)) {
      return res.status(400).json({ error: "Only JPEG/PNG are allowed" });
    }

    // Upload image to S3
    const ext = mime.toLowerCase().includes("png") ? "png" : "jpg";
    const ts = Date.now();
    const key = `inputs/${encodeURIComponent(email)}/${ts}.${ext}`;
    const filePath = req.file.path;
    const buffer = await fs.readFile(filePath);

    // Optional: preflight face/safety check (guarded by env flag)
    if (String(process.env.RENDER_PREFLIGHT_FACE_CHECK).toLowerCase() === "true") {
      try {
        const analysis = await analyzeImageBufferWithGoogleVision(buffer, { requestId: req.id });
        if (!analysis) return res.status(400).json({ error: "Image analysis failed" });
        if (!analysis.hasFace) return res.status(400).json({ error: "No face detected in the image" });
        const adult = analysis.safeSearch?.adult || "VERY_UNLIKELY";
        const violence = analysis.safeSearch?.violence || "VERY_UNLIKELY";
        const racy = analysis.safeSearch?.racy || "VERY_UNLIKELY";
        const isUnsafe = [adult, violence, racy].some(l => ["LIKELY", "VERY_LIKELY"].includes(l));
        if (isUnsafe) return res.status(400).json({ error: "Image failed safety checks" });
      } catch (e) {
        console.error("[render:preflight] error", e?.response?.data || e?.message || e);
        return res.status(400).json({ error: "Image preflight check failed" });
      }
    }
    await putObject(key, buffer, mime);

    // Optional: generate TTS in API and store to S3 for worker consumption
    // If ELEVENLABS_API_KEY is configured, synthesize MP3 and upload
    let audioKey = null;
    try {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (apiKey) {
        const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
        const defaultVoice = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Rachel
        // Translate friendly ids (e.g., 'en_female_1') to actual ElevenLabs voice ids
        const { resolveVoiceId } = require("../utils/voices");
        const vid = resolveVoiceId(voiceId, defaultVoice);
        const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(vid)}?optimize_streaming_latency=3&output_format=mp3_44100_128`;
        const resp = await axios.post(
          url,
          { text, model_id: modelId, voice_settings: { stability: 0.5, similarity_boost: 0.75 } },
          { headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg", "Accept-Encoding": "identity" }, responseType: "arraybuffer", timeout: 60000 }
        );
        const audioBytes = Buffer.from(resp.data);
        if (audioBytes && audioBytes.length > 1024) {
          audioKey = `audio/${encodeURIComponent(email)}/${ts}.mp3`;
          await putObject(audioKey, audioBytes, "audio/mpeg");
        }
      }
    } catch (e) {
      console.error("[render:tts] API-side TTS failed; worker will synthesize", e?.response?.data || e?.message || e);
      audioKey = null; // ensure unset on failure
    }

    // Create job in Mongo
    const job = await RenderJob.create({
      userEmail: email,
      kind: "talking-head",
      status: "queued",
      input: { imageKey: key, text, voiceId, audioKey: audioKey || undefined, consent: true },
      requestMeta: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    });

    // Cleanup temp file
    try { await fs.unlink(filePath); } catch {}

    return res.json({ jobId: String(job._id) });
  } catch (e) {
    console.error("/api/render/generate error", e);
    return res.status(500).json({ error: "Failed to create render job" });
  }
});

// GET /api/render/jobs/:id
router.get("/jobs/:id", async (req, res) => {
  try {
    const job = await RenderJob.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.userEmail !== req.user?.email && !req._user?.isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (job.status === "succeeded" && job.output?.videoKey) {
      const url = await signUrl(job.output.videoKey, 3600);
      return res.json({ status: job.status, videoUrl: url, durationSec: job.output.durationSec });
    }
    if (job.status === "failed") {
      return res.json({ status: job.status, error: job.error || "failed" });
    }
    return res.json({ status: job.status });
  } catch (e) {
    console.error("/api/render/jobs/:id error", e);
    return res.status(500).json({ error: "Failed to fetch job" });
  }
});

module.exports = router;
