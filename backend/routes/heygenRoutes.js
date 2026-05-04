"use strict";

const express = require("express");
const { generateLipSyncVideo } = require("../services/heygen/heygenService");
const PackageInstance = require("../models/packageInstance");
const HeygenVideo = require("../models/heygenVideo");

const router = express.Router();

/**
 * Verify that the request comes from our own Next.js API layer.
 * The caller must supply X-Internal-Secret matching process.env.INTERNAL_SECRET.
 */
function verifyInternalSecret(req, res, next) {
  const secret = process.env.INTERNAL_SECRET;
  if (!secret) {
    console.error("[heygen] INTERNAL_SECRET is not configured on the server");
    return res.status(500).json({ error: "Server misconfiguration: INTERNAL_SECRET not set" });
  }
  if (req.headers["x-internal-secret"] !== secret) {
    return res.status(403).json({ error: "Forbidden: invalid internal secret" });
  }
  return next();
}

/**
 * POST /api/heygen/generate
 *
 * Called exclusively by the Next.js /api/heygen/create route after:
 *   1. Validating the user session + quota (via /api/user/heygen/consume)
 *   2. Uploading input files to R2 and obtaining public URLs
 *
 * Body: { imageUrl, audioUrl, userId, packageInstanceId, imageHash, talkingPhotoId }
 *
 * DB-backed talking photo cache:
 *   - If PackageInstance.heygenTalkingPhotoId is set, skip the HeyGen upload step.
 *   - If upload happens, persist the returned talkingPhotoId to the PackageInstance.
 */
router.post("/generate", verifyInternalSecret, async (req, res) => {
  const { imageUrl, audioUrl, userId, packageInstanceId, imageHash, talkingPhotoId } = req.body || {};
  const incomingHash =
    typeof imageHash === "string" && imageHash.trim().length > 0 ? imageHash.trim() : null;

  if (!talkingPhotoId && (!imageUrl || typeof imageUrl !== "string")) {
    return res.status(400).json({ ok: false, error: "imageUrl or talkingPhotoId is required" });
  }
  if (!audioUrl || typeof audioUrl !== "string") {
    return res.status(400).json({ ok: false, error: "audioUrl is required" });
  }

  // ── Check DB for persisted talking photo ID ────────────────────────────────
  let resolvedTalkingPhotoId = talkingPhotoId || null;
  let pkg = null;

  if (packageInstanceId && !resolvedTalkingPhotoId) {
    try {
      pkg = await PackageInstance.findById(packageInstanceId).select(
        "heygenTalkingPhotoId heygenTalkingPhotoHash"
      );
      const shouldReuse = Boolean(
        pkg?.heygenTalkingPhotoId &&
          pkg?.heygenTalkingPhotoHash &&
          incomingHash &&
          pkg.heygenTalkingPhotoHash === incomingHash
      );
      if (shouldReuse) {
        resolvedTalkingPhotoId = pkg.heygenTalkingPhotoId;
        console.log("[heygen] /generate reusing persisted talkingPhotoId (hash match)", {
          packageInstanceId,
          talkingPhotoId: resolvedTalkingPhotoId,
          incomingHash,
        });
      } else {
        console.log("[heygen] /generate creating new talkingPhotoId (hash differs or missing)", {
          packageInstanceId,
          hasStoredTalkingPhotoId: !!pkg?.heygenTalkingPhotoId,
          storedHash: pkg?.heygenTalkingPhotoHash || null,
          incomingHash,
        });
      }
    } catch (err) {
      console.warn("[heygen] /generate DB lookup failed, proceeding with upload", { message: err.message });
    }
  }

  console.log("[heygen] /generate invoked", {
    userId: userId || null,
    packageInstanceId: packageInstanceId || null,
    imageUrl: imageUrl || null,
    talkingPhotoId: resolvedTalkingPhotoId || null,
    audioUrl,
  });

  try {
    const result = await generateLipSyncVideo({
      imageUrl,
      audioUrl,
      imageHash: incomingHash || undefined,
      talkingPhotoId: resolvedTalkingPhotoId || undefined,
    });

    // ── Persist talkingPhotoId to DB if it was freshly uploaded ───────────────
    if (packageInstanceId && result.talkingPhotoId && !resolvedTalkingPhotoId) {
      try {
        if (!pkg) {
          pkg = await PackageInstance.findById(packageInstanceId).select(
            "heygenTalkingPhotoId heygenTalkingPhotoHash"
          );
        }
        if (pkg) {
          pkg.heygenTalkingPhotoId = result.talkingPhotoId;
          pkg.heygenTalkingPhotoHash = incomingHash;
          await pkg.save();
        } else {
          await PackageInstance.findByIdAndUpdate(packageInstanceId, {
            $set: {
              heygenTalkingPhotoId: result.talkingPhotoId,
              heygenTalkingPhotoHash: incomingHash,
            },
          });
        }
        console.log("[heygen] /generate persisted talkingPhotoId to DB", {
          packageInstanceId,
          talkingPhotoId: result.talkingPhotoId,
          talkingPhotoHash: incomingHash,
        });
      } catch (err) {
        console.warn("[heygen] /generate failed to persist talkingPhotoId", { message: err.message });
      }
    }

    // ── Persist video record to MongoDB ───────────────────────────────────────
    try {
      await HeygenVideo.create({
        userId: userId,
        packageInstanceId: packageInstanceId,
        videoUrl: result.videoUrl,
        videoId: result.videoId || null,
        imageUrl: imageUrl || null,
        audioUrl: audioUrl || null,
      });
    } catch (err) {
      console.warn("[heygen] /generate failed to save HeygenVideo record", { message: err.message });
    }

    return res.json({ ok: true, videoUrl: result.videoUrl });
  } catch (err) {
    console.error("[heygen] /generate error", { message: err.message });
    return res.status(500).json({ ok: false, error: err.message || "Video generation failed" });
  }
});

/**
 * GET /api/heygen/history?userId=...&limit=...
 */
router.get("/history", verifyInternalSecret, async (req, res) => {
  const userId = typeof req.query.userId === "string" ? req.query.userId.trim() : "";
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const items = await HeygenVideo.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const mapped = items.map((doc) => ({
      jobId: String(doc._id),
      videoUrl: doc.videoUrl,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
      options: {
        thumbnailUrl: doc.imageUrl || null,
      },
    }));

    return res.json({ items: mapped });
  } catch (err) {
    console.error("[heygen] /history error", { message: err.message });
    return res.status(500).json({ error: "Failed to load history" });
  }
});

/**
 * DELETE /api/heygen/history/:id
 */
router.delete("/history/:id", verifyInternalSecret, async (req, res) => {
  const { id } = req.params;
  const userId = req.headers["x-user-id"] || "";

  try {
    const result = await HeygenVideo.deleteOne({ _id: id, userId });
    return res.json({ removed: result.deletedCount > 0 });
  } catch (err) {
    console.error("[heygen] /history/:id delete error", { message: err.message });
    return res.status(500).json({ error: "Failed to delete history item" });
  }
});

module.exports = router;
