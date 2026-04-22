/**
 * POST /api/heygen/create
 *
 * Accepts multipart/form-data with:
 *   source_image  - PNG/JPEG, max 10 MB
 *   driven_audio  - MP3/WAV,  max 15 MB
 *   confirmed     - "true" | "false"  (multi-credit confirmation)
 *
 * Flow:
 *   1. Validate files
 *   2. Estimate audio duration → creditsToConsume
 *   3. If creditsToConsume > 1 and confirmed !== "true" → return warning
 *   4. Consume quota   POST {SERVER_BASE_URL}/api/user/heygen/consume
 *   5. Upload files to R2
 *   6. Call backend    POST {SERVER_BASE_URL}/api/heygen/generate
 *   7. Return { jobId, state, videoUrl, creditsConsumed, requestId }
 *
 * NOTE: @aws-sdk/client-s3 must be available in this project.
 *       Run: npm install @aws-sdk/client-s3
 */

import { Buffer } from "buffer";
import { createHash, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Config ────────────────────────────────────────────────────────────────────

const SERVER_BASE_URL = process.env.API_URL || "http://localhost:5001";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ai_session";
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || "";

const MAX_IMAGE_SIZE_MB = 10;
const MAX_AUDIO_SIZE_MB = 15;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav"];

// R2 / S3-compatible storage (reuses the same env vars as backend/utils/s3.js)
const s3 = new S3Client({
  region: process.env.S3_REGION || "auto",
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});
const S3_BUCKET = process.env.S3_BUCKET || "";
const PUBLIC_ASSET_BASE_URL = (process.env.PUBLIC_ASSET_BASE_URL || "").replace(/\/+$/, "");

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function hashBuffer(buf: Buffer): string {
  return createHash("sha256").update(buf).digest("hex");
}

/**
 * Rough audio duration estimate from file size alone (no decoding needed).
 * MP3  ≈ 128 kbps → 16 000 bytes/s
 * WAV  ≈ 44 100 Hz × 16-bit mono → 88 200 bytes/s
 * Returns whole seconds, minimum 1.
 */
function estimateDurationSeconds(sizeBytes: number, mimeType: string): number {
  const bytesPerSecond = mimeType === "audio/wav" ? 88_200 : 16_000;
  return Math.max(1, Math.ceil(sizeBytes / bytesPerSecond));
}

/** 1 credit = 1 minute of audio, rounded up. */
function calcCredits(durationSeconds: number): number {
  return Math.max(1, Math.ceil(durationSeconds / 60));
}

async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  await s3.send(
    new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, Body: body, ContentType: contentType })
  );
  if (PUBLIC_ASSET_BASE_URL) {
    return `${PUBLIC_ASSET_BASE_URL}/${key}`;
  }
  // Fallback: construct URL from S3_ENDPOINT + bucket + key
  const endpoint = (process.env.S3_ENDPOINT || "").replace(/\/+$/, "");
  return `${endpoint}/${S3_BUCKET}/${key}`;
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const requestId = makeRequestId();

  // ── 1. Parse + validate files ─────────────────────────────────────────────
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart/form-data body", requestId },
      { status: 400 }
    );
  }

  const sourceImage = form.get("source_image");
  const drivenAudio = form.get("driven_audio");
  const confirmed = String(form.get("confirmed") || "").toLowerCase() === "true";

  if (!(sourceImage instanceof File) || sourceImage.size === 0) {
    return NextResponse.json(
      { error: "source_image file is required", errorCode: "VALIDATION_ERROR", requestId },
      { status: 400 }
    );
  }
  if (!(drivenAudio instanceof File) || drivenAudio.size === 0) {
    return NextResponse.json(
      { error: "driven_audio file is required", errorCode: "VALIDATION_ERROR", requestId },
      { status: 400 }
    );
  }
  if (!ALLOWED_IMAGE_TYPES.includes(sourceImage.type)) {
    return NextResponse.json(
      { error: "Invalid image type. Only PNG and JPEG are supported.", errorCode: "VALIDATION_ERROR", requestId },
      { status: 400 }
    );
  }
  if (sourceImage.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return NextResponse.json(
      { error: `Image too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`, errorCode: "VALIDATION_ERROR", requestId },
      { status: 400 }
    );
  }
  if (!ALLOWED_AUDIO_TYPES.includes(drivenAudio.type)) {
    return NextResponse.json(
      { error: "Invalid audio type. Only MP3 and WAV are supported.", errorCode: "VALIDATION_ERROR", requestId },
      { status: 400 }
    );
  }
  if (drivenAudio.size > MAX_AUDIO_SIZE_MB * 1024 * 1024) {
    return NextResponse.json(
      { error: `Audio too large. Maximum size is ${MAX_AUDIO_SIZE_MB}MB.`, errorCode: "VALIDATION_ERROR", requestId },
      { status: 400 }
    );
  }

  // ── 2. Estimate duration + credits ────────────────────────────────────────
  const durationSeconds = estimateDurationSeconds(drivenAudio.size, drivenAudio.type);
  const creditsToConsume = calcCredits(durationSeconds);

  // ── 3. Multi-credit warning gate ─────────────────────────────────────────
  if (creditsToConsume > 1 && !confirmed) {
    return NextResponse.json(
      {
        warning: true,
        creditsToConsume,
        durationSeconds,
        message: `This video will use ${creditsToConsume} credits (estimated ${durationSeconds}s of audio). Send again with confirmed=true to proceed.`,
        requestId,
      },
      { status: 200 }
    );
  }

  // ── 4. Verify session + consume quota ─────────────────────────────────────
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized", errorCode: "UNAUTHORIZED", requestId },
      { status: 401 }
    );
  }

  const imageBuffer = Buffer.from(await sourceImage.arrayBuffer());
  const imageHash = hashBuffer(imageBuffer);
  const consumeForm = new FormData();
  consumeForm.append("image", sourceImage);
  consumeForm.append("imageHash", imageHash);
  consumeForm.append("creditsToConsume", String(creditsToConsume));

  const consumeRes = await fetch(`${SERVER_BASE_URL}/api/user/heygen/consume`, {
    method: "POST",
    headers: {
      cookie: `${SESSION_COOKIE_NAME}=${token}`,
    },
    body: consumeForm,
    cache: "no-store",
  });

  const consumeText = await consumeRes.text();
  let consumeData: Record<string, unknown>;
  try {
    consumeData = consumeText ? JSON.parse(consumeText) : {};
  } catch {
    consumeData = {};
  }

  if (!consumeRes.ok) {
    return NextResponse.json(
      {
        error: consumeData.error || "Failed to verify video quota",
        errorCode: consumeData.errorCode || consumeData.code || "QUOTA_ERROR",
        creditsRequired: consumeData.creditsRequired ?? creditsToConsume,
        remaining: consumeData.remaining ?? null,
        requestId: consumeData.requestId ?? requestId,
      },
      { status: consumeRes.status }
    );
  }

  if (!consumeData.ok || typeof consumeData.userId !== "string") {
    return NextResponse.json(
      { error: "Unexpected quota response", errorCode: "INTERNAL_ERROR", requestId },
      { status: 500 }
    );
  }

  const userId = consumeData.userId as string;
  const packageInstanceId = typeof consumeData.packageInstanceId === "string"
    ? consumeData.packageInstanceId
    : null;

  // ── 5. Upload files to R2 ─────────────────────────────────────────────────
  const timestamp = Date.now();
  const imageExt = sourceImage.type === "image/png" ? "png" : "jpg";
  const audioExt = drivenAudio.type === "audio/wav" ? "wav" : "mp3";

  const imageKey = `heygen-inputs/${userId}/${timestamp}-image.${imageExt}`;
  const audioKey = `heygen-inputs/${userId}/${timestamp}-audio.${audioExt}`;

  const audioBuffer = Buffer.from(await drivenAudio.arrayBuffer());

  let imageUrl: string;
  let audioUrl: string;
  try {
    [imageUrl, audioUrl] = await Promise.all([
      uploadToR2(imageKey, imageBuffer, sourceImage.type),
      uploadToR2(audioKey, audioBuffer, drivenAudio.type),
    ]);
  } catch (err) {
    console.error("[heygen:create] R2 upload failed", err);
    return NextResponse.json(
      { error: "Failed to upload input files", errorCode: "UPLOAD_ERROR", requestId },
      { status: 500 }
    );
  }

  // ── 6. Call backend HeyGen generate endpoint ──────────────────────────────
  let generateData: Record<string, unknown>;
  try {
    const generateRes = await fetch(`${SERVER_BASE_URL}/api/heygen/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({ imageUrl, audioUrl, userId, packageInstanceId, imageHash }),
      cache: "no-store",
    });

    const generateText = await generateRes.text();
    try {
      generateData = generateText ? JSON.parse(generateText) : {};
    } catch {
      generateData = {};
    }

    if (!generateRes.ok || !generateData.ok) {
      return NextResponse.json(
        {
          error: generateData.error || "Video generation failed",
          errorCode: "GENERATION_ERROR",
          requestId,
        },
        { status: generateRes.ok ? 500 : generateRes.status }
      );
    }
  } catch (err) {
    console.error("[heygen:create] Backend generate call failed", err);
    return NextResponse.json(
      { error: "Failed to reach video generation service", errorCode: "INTERNAL_ERROR", requestId },
      { status: 500 }
    );
  }

  // ── 7. Return result ──────────────────────────────────────────────────────
  return NextResponse.json(
    {
      jobId: randomUUID(),
      state: "completed",
      videoUrl: generateData.videoUrl,
      creditsConsumed: creditsToConsume,
      requestId,
    },
    { status: 200 }
  );
}
