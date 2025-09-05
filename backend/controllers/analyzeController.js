// backend/controllers/analyzeController.js
const path = require("path");
const fs = require("fs/promises");
const sharp = require("sharp");
const crypto = require("crypto");
const { z } = require("zod");
mongoose = require("mongoose");
const Result = require("../models/result");
const User = require("../models/user");

const { analyzeImageBufferWithGoogleVision } = require("../utils/analyzeImageWithGoogleVision");
const { buildPromotionBlueprint } = require("../utils/buildPromotionBlueprint");
const { generateCaptionWithOpenAI } = require("../utils/generateCaptionWithOpenAI");
const { isNearDuplicate } = require("../utils/textDiversity");
// --- helpers ---
const sendErr = (res, status, msg, detail) => {
  const payload = { error: msg };
  if (process.env.DEBUG_ERRORS === "true" && detail) payload.detail = detail;
  return res.status(status).json(payload);
};

const makeRequestId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const log = (requestId, stage, extra = {}) =>
  console.log(JSON.stringify({ requestId, stage, ...extra }));

const analyzeReqSchema = z.object({
  email: z.string().email(),
  goal: z.enum(["subs", "ppv", "customs"]).optional(),
  linkBase: z.string().url().optional(),
  timezone: z.string().optional(),
  captions: z.string().optional(), // from query (?captions=false)
});

// --- controller: POST /api/analyze ---
const analyzeImage = async (req, res) => {
  const requestId = makeRequestId();
  const t0 = Date.now();

  const { file } = req;
  const email = req.user?.email;
  const captionsParam = String(req.query?.captions ?? "").toLowerCase();
  const skipCaptions = captionsParam === "false";

  // Validate body/query
  const parsed = analyzeReqSchema.safeParse({
    email,
    goal: req.body?.goal,
    linkBase: req.body?.linkBase,
    timezone: req.body?.timezone,
    captions: captionsParam || undefined,
  });
  if (!parsed.success) {
    return sendErr(res, 400, "Invalid input.", parsed.error?.flatten?.());
  }

  if (!file || !email) return sendErr(res, 400, "Image and email are required.");
  if (typeof file.size === "number" && file.size > 7 * 1024 * 1024) {
    return sendErr(res, 400, "File too large (max 7MB).");
  }

  const filePath = path.resolve(__dirname, "../", file.path);

  try {
    // 0) User checks
    let user;
    try {
      if (!req.user || !req.user.id) return sendErr(res, 401, "Unauthorized");
      user = await User.findById(req.user.id);
      if (!user) return sendErr(res, 403, "User not found.");
      if (!user.isAdmin && user.uploadsUsed >= user.uploadLimit) {
        return sendErr(res, 403, "Upload limit reached.");
      }
    } catch (e) {
      log(requestId, "user_lookup_error", { message: e?.message });
      return sendErr(res, 500, "Failed to analyze image", { stage: "user_lookup", message: e?.message });
    }

    // 1) Read bytes & detect/convert format
    let inputBuffer;
    let detected = null;
    try {
      inputBuffer = await fs.readFile(filePath);

      // dynamic import for ESM
      const { fileTypeFromBuffer } = await import("file-type");
      detected = await fileTypeFromBuffer(inputBuffer);

      if (!detected) {
        try {
          const meta = await sharp(inputBuffer).metadata();
          if (meta?.format) {
            const map = {
              jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
              webp: "image/webp", heic: "image/heic", heif: "image/heif",
              tiff: "image/tiff", gif: "image/gif", bmp: "image/bmp",
              avif: "image/avif"
            };
            detected = { ext: meta.format.toLowerCase(), mime: map[meta.format.toLowerCase()] || "" };
          }
        } catch {}
      }

      const ext = (detected?.ext || "").toLowerCase();
      const allowed = new Set(["png", "jpg", "jpeg", "webp"]);
      const convertible = new Set(["heic", "heif", "gif", "tiff", "bmp", "avif"]);

      if (!allowed.has(ext) && !convertible.has(ext)) {
        return sendErr(
          res,
          400,
          "Unsupported file type. Use PNG, JPG/JPEG, WEBP (HEIC/HEIF/AVIF/GIF/TIFF/BMP are auto-converted).",
          { stage: "type_check", detected }
        );
      }

      if (!allowed.has(ext)) {
        try {
          inputBuffer = await sharp(inputBuffer).jpeg({ quality: 85 }).toBuffer();
        } catch (convErr) {
          log(requestId, "convert_error", { message: convErr?.message });
          return sendErr(
            res,
            415,
            "Could not convert image (decoder not available). Please upload JPG/PNG/WEBP.",
            { stage: "convert", detected, message: convErr?.message }
          );
        }
      }
    } catch (e) {
      log(requestId, "read_detect_error", { message: e?.message });
      return sendErr(res, 500, "Failed to analyze image", { stage: "read_detect", message: e?.message });
    }

    // 1b) Dedup via SHA-256 (on normalized bytes)
    let imageHash = "";
    try {
      imageHash = crypto.createHash("sha256").update(inputBuffer).digest("hex");
      const existing = await Result.findOne({ email, imageHash }).sort({ createdAt: -1 });
      if (existing) {
        log(requestId, "dedup_hit", { imageHash, resultId: existing._id.toString() });
        return res.json({
          message: "Duplicate image detected — returning existing analysis.",
          insights: existing.toObject(),
          duplicate: true,
          requestId,
        });
      }
    } catch (e) {
      log(requestId, "hash_error", { message: e?.message });
      // continue without dedup if hashing fails
    }

    // 2) Vision
    const tVision0 = Date.now();
    let visionData;
    try {
      visionData = await analyzeImageBufferWithGoogleVision(inputBuffer, { requestId });
      if (!visionData) {
        return sendErr(res, 502, "Vision analysis failed.", { stage: "vision_null" });
      }
    } catch (e) {
      log(requestId, "vision_throw", { message: e?.message });
      return sendErr(res, 502, "Vision analysis failed.", { stage: "vision_throw", message: e?.message });
    }
    log(requestId, "vision_done", { duration_ms: Date.now() - tVision0 });

    // 3) Build blueprint
    const ctx = {
      goal: req.body?.goal || "subs",
      timezone: typeof user?.timezone === "string" && user.timezone ? user.timezone : "Europe/Athens",
      linkBase: req.body?.linkBase,
    };

    let promotion, meta;
    try {
      const out = buildPromotionBlueprint(visionData, ctx);
      log(requestId, "blueprint_done", {
  niche: promotion?.niche,
  csl: promotion?.contentSafety?.csl,
  policiesVersion: meta?.policiesVersion,
  engineVersion: meta?.engineVersion,
  platforms: (promotion?.recommendedPlatforms || []).map(r => r.platform),
});
      promotion = out.promotion;
      meta = out.meta;
      if (!promotion) {
        return sendErr(res, 500, "Failed to build promotion plan.", { stage: "blueprint", out });
      }
    } catch (e) {
      log(requestId, "blueprint_error", { message: e?.message });
      return sendErr(res, 500, "Failed to build promotion plan.", { stage: "blueprint_throw", message: e?.message });
    }

   // 4) Captions (optional)
const tCap0 = Date.now();
try {
  if (!skipCaptions && Array.isArray(promotion.recommendedPlatforms)) {
    // gather user’s recent captions to avoid repeats
    const recent = await Result.find({ email }).sort({ createdAt: -1 }).limit(50);
    const recentCaps = recent
      .flatMap(r => (r.promotion?.recommendedPlatforms || [])
        .map(x => x.caption)
        .filter(Boolean));

    const withCaptions = await Promise.all(
      promotion.recommendedPlatforms.map(async (rec) => {
        try {
          const dynamicForPlatform = {
            platform: rec.platform,
            bestPostTime: (rec.bestTimesLocal && rec.bestTimesLocal[0]) || "18:00",
            tip: (promotion.ctaVariants && promotion.ctaVariants[0]) || "",
            hashtags: rec.hashtags || [],
          };

          // attempt 1
          let caption = await generateCaptionWithOpenAI(visionData, dynamicForPlatform, { requestId });

          // if too similar, regenerate once with directive + avoid list
          if (caption && recentCaps.some(c => isNearDuplicate(caption, c))) {
            caption = await generateCaptionWithOpenAI(
              visionData,
              dynamicForPlatform,
              {
                requestId,
                styleDirective: "Use a different structure and hook than previous posts.",
                avoidPhrases: recentCaps.slice(0, 12)
              }
            );
            log(requestId, "caption_similarity_blocked", { blocked: true });
          }

          return { ...rec, caption: caption || rec.caption || "" };
        } catch (e) {
          log(requestId, "caption_error", { platform: rec.platform, message: e?.message });
          return rec;
        }
      })
    );
    promotion.recommendedPlatforms = withCaptions;
  }
} catch (e) {
  log(requestId, "caption_loop_error", { message: e?.message });
}
log(requestId, "captions_done", { skipped: !!skipCaptions, duration_ms: Date.now() - tCap0 });

    // 5) Save
    let newResult;
    try {
      newResult = await Result.create({
        email,
        csl: promotion?.contentSafety?.csl ?? 0,
        niche: promotion?.niche || "general",
        hasFace: !!promotion?.hasFace,
        status: "ready",
        stage: "done",
        imageHash,
        captionsGenerated: !skipCaptions,
        promotion,
        meta,
      });
    } catch (e) {
      log(requestId, "db_save_error", { message: e?.message });
      return sendErr(res, 500, "Failed to save result.", { stage: "db_save", message: e?.message });
    }

    // 6) Update quota
    try {
      if (!user.isAdmin) {
        user.uploadsUsed += 1;
        await user.save();
      }
    } catch (e) {
      log(requestId, "quota_update_error", { message: e?.message });
    }

    // 7) Done
    return res.json({
      message: "Image analyzed successfully!",
      requestId,
      insights: newResult.toObject(),
      durations: { total_ms: Date.now() - t0, vision_ms: Date.now() - tVision0, captions_ms: skipCaptions ? 0 : (Date.now() - tCap0) },
    });
  } catch (error) {
    log(requestId, "top_level_error", { message: error?.message });
    return sendErr(res, 500, "Failed to analyze image", { stage: "top_level", message: error?.message });
  } finally {
    try { await fs.unlink(filePath); } catch {}
  }
};

// GET /api/analyze?email=&page=&limit=
const fetchAnalysisHistory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  if (!req.user || !req.user.id) return sendErr(res, 401, "Unauthorized");

  try {
    const email = req.user.email;
    const results = await Result.find({ email })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Result.countDocuments({ email });
    res.json({ results, total });
  } catch (error) {
    return sendErr(res, 500, "Failed to fetch results", { message: error?.message });
  }
};


const deleteAnalysisResult = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Result.findByIdAndDelete(id);
    if (!result) return sendErr(res, 404, "Result not found");
    res.json({ message: "Result deleted successfully", result });
  } catch (error) {
    return sendErr(res, 500, "Failed to delete result", { message: error?.message });
  }
};


// GET /api/analyze/:id
const getAnalysisById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  try {
    const doc = await Result.findById(id);
    if (!doc) return res.status(404).json({ error: "Result not found" });
    return res.json(doc);
  } catch (e) {
    console.error("getAnalysisById error:", e);
    return res.status(500).json({ error: "Failed to fetch result" });
  }
};

// PATCH /api/analyze/:id
const updateAnalysisResult = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  // whitelist updatable fields
  const set = {};
  if (req.body && typeof req.body === "object") {
    if (req.body.promotion) set.promotion = req.body.promotion; // captions/hashtags edits, etc.
    if (req.body.meta?.userNotes !== undefined) set["meta.userNotes"] = req.body.meta.userNotes;
  }

  try {
    const updated = await Result.findByIdAndUpdate(id, { $set: set }, { new: true });
    if (!updated) return res.status(404).json({ error: "Result not found" });
    return res.json(updated);
  } catch (e) {
    console.error("updateAnalysisResult error:", e);
    return res.status(500).json({ error: "Failed to update result" });
  }
};

module.exports = { analyzeImage, fetchAnalysisHistory, getAnalysisById, deleteAnalysisResult, updateAnalysisResult };
