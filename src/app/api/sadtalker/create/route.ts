import { Buffer } from "buffer";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { getSadTalkerQueue } from "../_lib/queue";
import { SadTalkerJobOptions, SadTalkerJobPayload } from "../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SERVER_BASE_URL = process.env.API_URL || "http://localhost:5001";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ai_session";

// File validation constants
const MAX_IMAGE_SIZE_MB = 10;
const MAX_AUDIO_SIZE_MB = 15;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav"];

type CreateBody = SadTalkerJobPayload & {
  priority?: number;
};

function makeRequestId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseFloatInRange(value: unknown, min: number, max: number): number | undefined {
  const num = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (Number.isFinite(num)) {
    return Math.min(max, Math.max(min, num));
  }
  return undefined;
}

function parseInteger(value: unknown): number | undefined {
  const num = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (Number.isInteger(num)) {
    return num;
  }
  return undefined;
}

function parseBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "y", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "n", "off"].includes(normalized)) return false;
  }
  return fallback;
}

function parseIntList(value: unknown): number[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    const parsed = value
      .map((item) => Number(item))
      .filter((num) => Number.isFinite(num));
    return parsed.length ? parsed : undefined;
  }
  if (typeof value === "string") {
    const parsed = value
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((num) => Number.isFinite(num));
    return parsed.length ? parsed : undefined;
  }
  return undefined;
}

function sanitizeOptions(options: unknown): SadTalkerJobOptions | undefined {
  if (!options || typeof options !== "object") return undefined;
  const input = options as Record<string, unknown>;
  const resolution = input.resolution === "256p" ? "256p" : "512p";
  const enhancer = sanitizeString(input.enhancer) ?? null;
  const backgroundEnhancer = sanitizeString(input.backgroundEnhancer) ?? null;
  const preprocess = sanitizeString(input.preprocess) ?? null;
  const poseStyle = parseInteger(input.poseStyle);
  const expressionScale = parseFloatInRange(input.expressionScale, 0.1, 2);
  const still = parseBoolean(input.still, false);
  const batchSize = parseInteger(input.batchSize);
  const inputYaw = parseIntList(input.inputYaw) ?? null;
  const inputPitch = parseIntList(input.inputPitch) ?? null;
  const inputRoll = parseIntList(input.inputRoll) ?? null;
  return {
    resolution,
    enhancer,
    backgroundEnhancer,
    preprocess,
    poseStyle: poseStyle ?? undefined,
    expressionScale,
    still,
    batchSize: batchSize ?? undefined,
    inputYaw,
    inputPitch,
    inputRoll,
  };
}

async function fileToPayload(file: File | null | undefined) {
  if (!file) return undefined;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return {
    filename: file.name || "upload.bin",
    contentType: file.type || "application/octet-stream",
    data: buffer.toString("base64"),
    size: buffer.length,
  };
}

function hashBufferSha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

async function hashFile(file: File | null | undefined): Promise<string | undefined> {
  if (!file) return undefined;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return hashBufferSha256(buffer);
}

function validateUrl(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("must be a non-empty string");
  }
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("unsupported protocol");
    }
  } catch (err) {
    throw new Error(`invalid URL (${(err as Error).message})`);
  }
  return trimmed;
}

async function handleJsonPayload(body: Partial<CreateBody>) {
  const requestId = makeRequestId();
  if (!body || typeof body !== "object") {
    return {
      error: NextResponse.json(
        { error: "Invalid JSON body", errorCode: "VALIDATION_ERROR", requestId },
        { status: 400 }
      ),
    };
  }
  const { imageUrl, audioUrl, userId, webhookUrl, metadata, options } = body;
  if (!userId || typeof userId !== "string") {
    return {
      error: NextResponse.json(
        { error: "userId is required", errorCode: "VALIDATION_ERROR", requestId },
        { status: 400 }
      ),
    };
  }

  let image: string;
  let audio: string;
  try {
    image = validateUrl(imageUrl);
    audio = validateUrl(audioUrl);
  } catch (err) {
    return {
      error: NextResponse.json(
        { error: `Invalid input: ${(err as Error).message}`, errorCode: "VALIDATION_ERROR", requestId },
        { status: 400 }
      ),
    };
  }

  let webhook: string | null = null;
  if (webhookUrl) {
    try {
      webhook = validateUrl(webhookUrl);
    } catch (err) {
      return {
        error: NextResponse.json(
          { error: `Invalid webhookUrl: ${(err as Error).message}`, errorCode: "VALIDATION_ERROR", requestId },
          { status: 400 }
        ),
      };
    }
  }

  if (!image.toLowerCase().match(/\.(png|jpg|jpeg)$/)) {
    return {
      error: NextResponse.json(
        { error: "imageUrl must point to a .png or .jpg file", errorCode: "VALIDATION_ERROR", requestId },
        { status: 400 }
      ),
    };
  }
  if (!audio.toLowerCase().match(/\.(mp3|wav)$/)) {
    return {
      error: NextResponse.json(
        { error: "audioUrl must point to a .mp3 or .wav file", errorCode: "VALIDATION_ERROR", requestId },
        { status: 400 }
      ),
    };
  }

  const payload: SadTalkerJobPayload = {
    userId,
    imageUrl: image,
    audioUrl: audio,
    webhookUrl: webhook,
    metadata: metadata && typeof metadata === "object" ? metadata : undefined,
    options: sanitizeOptions(options),
  };

  return {
    payload,
    priority: typeof body.priority === "number" ? body.priority : undefined,
    requestId: sanitizeString(body.requestId) || requestId,
  };
}

async function handleFormPayload(req: NextRequest) {
  const requestId = makeRequestId();
  const form = await req.formData();

  const sourceImage = form.get("source_image");
  const drivenAudio = form.get("driven_audio");

  if (!(sourceImage instanceof File) || sourceImage.size === 0) {
    return {
      error: NextResponse.json(
        { error: "source_image file is required", errorCode: "VALIDATION_ERROR", requestId },
        { status: 400 }
      ),
    };
  }
  if (!(drivenAudio instanceof File) || drivenAudio.size === 0) {
    return {
      error: NextResponse.json(
        { error: "driven_audio file is required", errorCode: "VALIDATION_ERROR", requestId },
        { status: 400 }
      ),
    };
  }

  // File validation - image
  if (!ALLOWED_IMAGE_TYPES.includes(sourceImage.type)) {
    return {
      error: NextResponse.json(
        {
          error: "Invalid image type. Only PNG and JPEG are supported.",
          errorCode: "VALIDATION_ERROR",
          requestId,
        },
        { status: 400 }
      ),
    };
  }
  if (sourceImage.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return {
      error: NextResponse.json(
        {
          error: `Image file too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`,
          errorCode: "VALIDATION_ERROR",
          requestId,
        },
        { status: 400 }
      ),
    };
  }

  // File validation - audio
  if (!ALLOWED_AUDIO_TYPES.includes(drivenAudio.type)) {
    return {
      error: NextResponse.json(
        {
          error: "Invalid audio type. Only MP3 and WAV are supported.",
          errorCode: "VALIDATION_ERROR",
          requestId,
        },
        { status: 400 }
      ),
    };
  }
  if (drivenAudio.size > MAX_AUDIO_SIZE_MB * 1024 * 1024) {
    return {
      error: NextResponse.json(
        {
          error: `Audio file too large. Maximum size is ${MAX_AUDIO_SIZE_MB}MB.`,
          errorCode: "VALIDATION_ERROR",
          requestId,
        },
        { status: 400 }
      ),
    };
  }

  const preprocess = sanitizeString(form.get("preprocess")) ?? "full";
  const enhancer = sanitizeString(form.get("enhancer"));
  const backgroundEnhancer = sanitizeString(form.get("background_enhancer"));
  const expressionScale = parseFloatInRange(form.get("expression_scale"), 0.1, 2);
  const poseStyle = parseInteger(form.get("pose_style"));
  const batchSize = parseInteger(form.get("batch_size"));
  const still = parseBoolean(form.get("still"), false);
  const inputYaw = parseIntList(form.get("input_yaw")) ?? null;
  const inputPitch = parseIntList(form.get("input_pitch")) ?? null;
  const inputRoll = parseIntList(form.get("input_roll")) ?? null;

  const userIdField = sanitizeString(form.get("userId"));
  const userId = userIdField || "web-client";
  const imageHash = await hashFile(sourceImage as File);

  const imagePayload = await fileToPayload(sourceImage);
  const audioPayload = await fileToPayload(drivenAudio);

  const payload: SadTalkerJobPayload = {
    userId,
    imageFile: imagePayload,
    audioFile: audioPayload,
    options: {
      preprocess,
      enhancer: enhancer ?? null,
      backgroundEnhancer: backgroundEnhancer ?? null,
      expressionScale,
      poseStyle,
      batchSize,
      still,
      resolution: form.get("resolution") === "256p" ? "256p" : "512p",
      inputYaw,
      inputPitch,
      inputRoll,
    },
  };

  const webhook = sanitizeString(form.get("webhookUrl"));
  if (webhook) {
    try {
      payload.webhookUrl = validateUrl(webhook);
    } catch (err) {
      return { error: NextResponse.json({ error: `Invalid webhookUrl: ${(err as Error).message}` }, { status: 400 }) };
    }
  }

  return {
    payload,
    priority: parseInteger(form.get("priority")),
    requestId,
    imageHash,
  };
}

async function ensureSadTalkerQuota(req: NextRequest, imageHash?: string, imageBase64?: string) {
  const localRequestId = makeRequestId();
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Unauthorized", errorCode: "UNAUTHORIZED", requestId: localRequestId },
        { status: 401 }
      ),
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    cookie: `${SESSION_COOKIE_NAME}=${token}`,
  };

  try {
    let body;
    let contentType = "application/json";
    if (imageBase64) {
      body = JSON.stringify({ imageHash, imageBase64 });
    } else {
      body = JSON.stringify(imageHash ? { imageHash } : {});
    }
    const resp = await fetch(`${SERVER_BASE_URL}/api/user/sadtalker/consume`, {
      method: "POST",
      headers: { ...headers, "Content-Type": contentType },
      body,
      cache: "no-store",
    });

    const text = await resp.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (resp.status === 401) {
      return {
        ok: false as const,
        response: NextResponse.json(
          { error: "Unauthorized", errorCode: "UNAUTHORIZED", requestId: data?.requestId ?? localRequestId },
          { status: 401 }
        ),
      };
    }

    if (resp.status === 402) {
      return {
        ok: false as const,
        response: NextResponse.json(
          {
            error: data?.error || "Video limit reached for your plan",
            action: data?.action || "upgrade",
            code: data?.code,
            feature: data?.feature,
            plan: data?.plan ?? null,
            remaining: data?.remaining ?? null,
            limit: data?.limit ?? null,
            requestId: data?.requestId ?? localRequestId,
          },
          { status: 402 },
        ),
      };
    }

    if (resp.status === 403) {
      return {
        ok: false as const,
        response: NextResponse.json(
          {
            error:
              data?.error ||
              "Your current plan only allows videos for a single face. Please reuse your original photo or upgrade your plan.",
            code: data?.errorCode || data?.code,
            errorCode: data?.errorCode,
            feature: data?.feature,
            plan: data?.plan ?? null,
            remaining: data?.remaining ?? null,
            limit: data?.limit ?? null,
            requestId: data?.requestId ?? localRequestId,
          },
          { status: 403 },
        ),
      };
    }
    if (resp.status === 409) {
      return {
        ok: false as const,
        response: NextResponse.json(
          {
            error: data?.error || data?.message || "Face verification required",
            code: data?.errorCode || data?.code,
            errorCode: data?.errorCode || data?.code,
            requestId: data?.requestId ?? localRequestId,
          },
          { status: 409 }
        ),
      };
    }

    if (!resp.ok || !data?.ok || typeof data.userId !== "string") {
      console.error("[sadtalker:create] quota response unexpected", {
        status: resp.status,
        body: data,
      });
      return {
        ok: false as const,
        response: NextResponse.json(
          {
            error: data?.error || "Failed to verify video quota",
            errorCode: data?.errorCode || data?.code || "INTERNAL_ERROR",
            requestId: data?.requestId ?? localRequestId,
          },
          { status: resp.status || 500 }
        ),
      };
    }

    return {
      ok: true as const,
      userId: data.userId as string,
      packageInstanceId: typeof data.packageInstanceId === "string" ? data.packageInstanceId : null,
      personaKey: typeof data.personaKey === "string" ? data.personaKey : null,
    };
  } catch (err) {
    console.error("[sadtalker:create] quota request failed", err);
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Failed to verify video quota", errorCode: "INTERNAL_ERROR", requestId: localRequestId },
        { status: 500 }
      ),
    };
  }
}

export async function POST(req: NextRequest) {
  const routeRequestId = makeRequestId();
  try {
    const contentType = req.headers.get("content-type") || "";
    let parsed:
      | {
          payload?: SadTalkerJobPayload;
          priority?: number;
          requestId?: string;
          error?: NextResponse;
        }
      | undefined;

    if (contentType.includes("multipart/form-data")) {
      parsed = await handleFormPayload(req);
    } else {
      const body = (await req.json().catch(() => null)) as Partial<CreateBody> | null;
      parsed = await handleJsonPayload(body ?? {});
    }

    if (!parsed || parsed.error) {
      return (
        parsed?.error ??
        NextResponse.json(
          { error: "Invalid payload", errorCode: "VALIDATION_ERROR", requestId: routeRequestId },
          { status: 400 }
        )
      );
    }
    if (!parsed.payload) {
      return NextResponse.json(
        { error: "Payload missing", errorCode: "VALIDATION_ERROR", requestId: routeRequestId },
        { status: 400 }
      );
    }

    // Enforce per-plan SadTalker limits and single-face restriction (for non-ultimate plans).
    const imageHash = (parsed as any).imageHash as string | undefined;
    const imageBase64 = (parsed as any)?.payload?.imageFile?.data;
    const quota = await ensureSadTalkerQuota(req, imageHash, imageBase64);
    if (!quota.ok) {
      return quota.response;
    }

    // Always use the authenticated user id for job/user bookkeeping, ignoring any client-provided userId.
    parsed.payload.userId = quota.userId;
    if (quota.packageInstanceId) {
      parsed.payload.packageInstanceId = quota.packageInstanceId;
    }
    if (quota.personaKey) {
      parsed.payload.personaKey = quota.personaKey;
    }

    const queue = getSadTalkerQueue();
    const job = await queue.add(
      "generate",
      parsed.payload,
      {
        priority: parsed.priority,
        jobId: parsed.requestId,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 10000,
        },
      },
    );

    return NextResponse.json(
      { jobId: job.id, state: "queued", requestId: parsed.requestId || routeRequestId },
      { status: 202 }
    );
  } catch (err) {
    console.error("[sadtalker:create] error", err);
    return NextResponse.json(
      { error: "Failed to enqueue SadTalker job", errorCode: "INTERNAL_ERROR", requestId: routeRequestId },
      { status: 500 }
    );
  }
}
