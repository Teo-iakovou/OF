"use strict";

const HEYGEN_API_BASE = "https://api.heygen.com";
const HEYGEN_UPLOAD_BASE = "https://upload.heygen.com";

const talkingPhotoCache = new Map(); // key: imageHash, value: talking_photo_id
const POLL_INTERVAL_MS = 5_000;          // 5 seconds between polls
const TIMEOUT_MS = 10 * 60 * 1_000;     // 10-minute hard deadline

/**
 * Submit a lip-sync video request to HeyGen and poll until completion.
 *
 * @param {{ imageUrl: string, audioUrl: string, imageMimeType?: string }} params
 * @returns {Promise<{ ok: true, videoUrl: string }>}
 * @throws {Error} on API failure, bad response, "failed" status, or timeout
 */
async function generateLipSyncVideo({ imageUrl, audioUrl, imageMimeType, imageHash, talkingPhotoId: providedTalkingPhotoId }) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    throw new Error("[heygen] HEYGEN_API_KEY environment variable is not set");
  }

  // ── Step 1: Get talking_photo_id (provided / cache / upload) ────────────────
  let talkingPhotoId;

  let freshlyUploadedTalkingPhotoId = null; // set only when a new upload occurs

  if (providedTalkingPhotoId) {
    talkingPhotoId = providedTalkingPhotoId;
    console.log("[heygen] Step 1: Skipped — using provided talkingPhotoId", { talkingPhotoId });
  } else if (imageHash && talkingPhotoCache.has(imageHash)) {
    talkingPhotoId = talkingPhotoCache.get(imageHash);
    console.log("[heygen] Step 1: Using cached talking_photo_id", { imageHash, talkingPhotoId });
  } else {
    console.log("[heygen] Step 1: Fetching image from URL", { imageUrl });

    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error(`[heygen] Failed to fetch image from URL (${imageRes.status}): ${imageUrl}`);
    }
    const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
    const contentType = imageMimeType || imageRes.headers.get("content-type") || "image/jpeg";

    console.log("[heygen] Step 1: Uploading image to HeyGen talking_photo", {
      bytes: imageBuffer.length,
      contentType,
    });

    const uploadRes = await fetch(`${HEYGEN_UPLOAD_BASE}/v1/talking_photo`, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": contentType,
      },
      body: imageBuffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text().catch(() => "");
      throw new Error(
        `[heygen] talking_photo upload failed with status ${uploadRes.status}: ${errText}`
      );
    }

    const uploadData = await uploadRes.json().catch(() => null);
    talkingPhotoId = uploadData?.data?.talking_photo_id;

    if (!talkingPhotoId) {
      throw new Error(
        `[heygen] No talking_photo_id in upload response: ${JSON.stringify(uploadData)}`
      );
    }

    if (imageHash) {
      talkingPhotoCache.set(imageHash, talkingPhotoId);
    }

    freshlyUploadedTalkingPhotoId = talkingPhotoId;
    console.log("[heygen] Step 1: Image uploaded successfully", { talkingPhotoId });
  }

  // ── Step 2: Submit video generation request ──────────────────────────────────
  console.log("[heygen] Step 2: Submitting video generation request", {
    talkingPhotoId,
    audioUrl,
  });

  const generateRes = await fetch(`${HEYGEN_API_BASE}/v2/video/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify({
      video_inputs: [
        {
          character: {
            type: "talking_photo",
            talking_photo_id: talkingPhotoId,
          },
          voice: {
            type: "audio",
            audio_url: audioUrl,
          },
        },
      ],
      dimension: { width: 512, height: 512 },
    }),
  });

  if (!generateRes.ok) {
    const errText = await generateRes.text().catch(() => "");
    throw new Error(
      `[heygen] Generation request failed with status ${generateRes.status}: ${errText}`
    );
  }

  const generateData = await generateRes.json().catch(() => null);
  // HeyGen v2 wraps results in a `data` envelope
  const videoId =
    generateData?.data?.video_id ||
    generateData?.video_id;

  if (!videoId) {
    throw new Error(
      `[heygen] No video_id in generation response: ${JSON.stringify(generateData)}`
    );
  }

  console.log("[heygen] Step 2: Video submitted successfully, starting status polling", { videoId });

  // ── Step 3: Poll for completion ────────────────────────────────────────────
  const deadline = Date.now() + TIMEOUT_MS;

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    console.log("[heygen] Step 3: Polling status", { videoId, remainingMs: deadline - Date.now() });

    const statusRes = await fetch(
      `${HEYGEN_API_BASE}/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`,
      {
        headers: { "X-Api-Key": apiKey },
      }
    );

    if (!statusRes.ok) {
      const errText = await statusRes.text().catch(() => "");
      console.error("[heygen] Status poll returned non-OK", {
        videoId,
        status: statusRes.status,
        body: errText,
      });
      // Non-fatal: retry on next tick
      continue;
    }

    const statusData = await statusRes.json().catch(() => null);
    const status = statusData?.data?.status || statusData?.status;

    console.log("[heygen] Poll response", { videoId, status });

    if (status === "completed") {
      const videoUrl =
        statusData?.data?.video_url ||
        statusData?.video_url;

      if (!videoUrl) {
        throw new Error(
          `[heygen] Status is "completed" but no video_url found: ${JSON.stringify(statusData)}`
        );
      }

      console.log("[heygen] Video generation completed", { videoId, videoUrl });
      return { ok: true, videoUrl, talkingPhotoId: freshlyUploadedTalkingPhotoId };
    }

    if (status === "failed") {
      console.log("[heygen] Step 3: Video failed, full response:", JSON.stringify(statusData, null, 2));
      throw new Error(
        `[heygen] Video generation failed: ${JSON.stringify(statusData?.data?.error || statusData?.error || statusData)}`
      );
    }

    // Any other status (pending, processing, etc.) — keep polling
  }

  throw new Error(
    `[heygen] Timeout: video ${videoId} did not complete within 10 minutes`
  );
}

module.exports = { generateLipSyncVideo, talkingPhotoCache };
