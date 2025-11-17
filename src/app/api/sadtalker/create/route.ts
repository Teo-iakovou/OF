import { Buffer } from "buffer";
import { NextRequest, NextResponse } from "next/server";

import { getSadTalkerQueue } from "../_lib/queue";
import { SadTalkerJobOptions, SadTalkerJobPayload } from "../types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateBody = SadTalkerJobPayload & {
  priority?: number;
};

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
  if (!body || typeof body !== "object") {
    return { error: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) };
  }
  const { imageUrl, audioUrl, userId, webhookUrl, metadata, options } = body;
  if (!userId || typeof userId !== "string") {
    return { error: NextResponse.json({ error: "userId is required" }, { status: 400 }) };
  }

  let image: string;
  let audio: string;
  try {
    image = validateUrl(imageUrl);
    audio = validateUrl(audioUrl);
  } catch (err) {
    return { error: NextResponse.json({ error: `Invalid input: ${(err as Error).message}` }, { status: 400 }) };
  }

  let webhook: string | null = null;
  if (webhookUrl) {
    try {
      webhook = validateUrl(webhookUrl);
    } catch (err) {
      return { error: NextResponse.json({ error: `Invalid webhookUrl: ${(err as Error).message}` }, { status: 400 }) };
    }
  }

  if (!image.toLowerCase().match(/\.(png|jpg|jpeg)$/)) {
    return { error: NextResponse.json({ error: "imageUrl must point to a .png or .jpg file" }, { status: 400 }) };
  }
  if (!audio.toLowerCase().match(/\.(mp3|wav)$/)) {
    return { error: NextResponse.json({ error: "audioUrl must point to a .mp3 or .wav file" }, { status: 400 }) };
  }

  const payload: SadTalkerJobPayload = {
    userId,
    imageUrl: image,
    audioUrl: audio,
    webhookUrl: webhook,
    metadata: metadata && typeof metadata === "object" ? metadata : undefined,
    options: sanitizeOptions(options),
  };

  return { payload, priority: typeof body.priority === "number" ? body.priority : undefined, requestId: body.requestId };
}

async function handleFormPayload(req: NextRequest) {
  const form = await req.formData();

  const sourceImage = form.get("source_image");
  const drivenAudio = form.get("driven_audio");

  if (!(sourceImage instanceof File) || sourceImage.size === 0) {
    return { error: NextResponse.json({ error: "source_image file is required" }, { status: 400 }) };
  }
  if (!(drivenAudio instanceof File) || drivenAudio.size === 0) {
    return { error: NextResponse.json({ error: "driven_audio file is required" }, { status: 400 }) };
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
    requestId: sanitizeString(form.get("requestId")),
  };
}

export async function POST(req: NextRequest) {
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
      return parsed?.error ?? NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    if (!parsed.payload) {
      return NextResponse.json({ error: "Payload missing" }, { status: 400 });
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

    return NextResponse.json({ jobId: job.id, state: "queued" }, { status: 202 });
  } catch (err) {
    console.error("[sadtalker:create] error", err);
    return NextResponse.json({ error: "Failed to enqueue SadTalker job" }, { status: 500 });
  }
}
