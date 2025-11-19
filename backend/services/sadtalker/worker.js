/* eslint-disable no-console */
require("dotenv").config({ path: process.env.ENV_FILE || ".env" });
require("dotenv").config({ path: ".env.local", override: true });

const { Worker } = require("bullmq");
const Redis = require("ioredis");
const axios = require("axios");
const FormData = require("form-data");
const { randomUUID } = require("crypto");

const QUEUE_NAME = "sadtalker-jobs";
const REDIS_URL = process.env.SADTALKER_REDIS_URL || process.env.REDIS_URL;
if (!REDIS_URL) {
  throw new Error("SADTALKER_REDIS_URL (or REDIS_URL) is required");
}

const DOWNLOAD_TIMEOUT_MS = Number(process.env.SADTALKER_DOWNLOAD_TIMEOUT_MS || 30_000);
const GENERATION_TIMEOUT_MS = Number(process.env.SADTALKER_JOB_TIMEOUT_MS || 8 * 60_000);
const MAX_IMAGE_BYTES = Number(process.env.SADTALKER_MAX_IMAGE_BYTES || 10 * 1024 * 1024);
const MAX_AUDIO_BYTES = Number(process.env.SADTALKER_MAX_AUDIO_BYTES || 15 * 1024 * 1024);
const API_KEY_HEADER = process.env.SADTALKER_REMOTE_API_KEY || undefined;
const RUNPOD_STATIC_ENDPOINTS = parseRunPodEndpoints(process.env.SADTALKER_RUNPOD_ENDPOINTS);
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY || process.env.SADTALKER_RUNPOD_API_KEY;
const RUNPOD_ENDPOINT_IDS = String(process.env.RUNPOD_ENDPOINT_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
const ENDPOINT_REFRESH_MS = Number(process.env.SADTALKER_RUNPOD_REFRESH_MS || 60_000);
const REMOTE_CREATE_PATH = process.env.SADTALKER_REMOTE_CREATE_PATH || "/v1/jobs";
const REMOTE_STATUS_PATH = process.env.SADTALKER_REMOTE_STATUS_PATH || "/v1/jobs";
const TOKEN_QUERY_ENABLED = String(process.env.SADTALKER_TOKEN_QUERY || "false").toLowerCase() === "true";
const HISTORY_LIMIT = Number(process.env.SADTALKER_HISTORY_LIMIT || 50);

const redis = new Redis(REDIS_URL, { maxRetriesPerRequest: null });

let roundRobinIndex = 0;
let cachedDynamicEndpoints = [];
let lastEndpointFetch = 0;

async function loadRunPodEndpoints() {
  const now = Date.now();
  const shouldFetch =
    RUNPOD_API_KEY &&
    RUNPOD_ENDPOINT_IDS.length > 0 &&
    (now - lastEndpointFetch > ENDPOINT_REFRESH_MS || !cachedDynamicEndpoints.length);

  if (!shouldFetch) {
    return cachedDynamicEndpoints.length ? cachedDynamicEndpoints : RUNPOD_STATIC_ENDPOINTS;
  }

  try {
    const refreshed = [];
    for (const endpointId of RUNPOD_ENDPOINT_IDS) {
      const details = await fetchRunPodEndpoints(endpointId);
      if (details.length) {
        refreshed.push(...details);
      }
    }
    if (refreshed.length) {
      cachedDynamicEndpoints = refreshed;
      lastEndpointFetch = now;
      return cachedDynamicEndpoints;
    }
    console.warn("[sadtalker-worker] Dynamic RunPod fetch returned no endpoints. Falling back to static list.");
  } catch (err) {
    console.warn("[sadtalker-worker] Failed to refresh RunPod endpoints:", err?.message || err);
  }

  return cachedDynamicEndpoints.length ? cachedDynamicEndpoints : RUNPOD_STATIC_ENDPOINTS;
}

async function nextEndpoint() {
  const endpoints = await loadRunPodEndpoints();
  if (!endpoints.length) return null;
  const idx = roundRobinIndex % endpoints.length;
  roundRobinIndex += 1;
  return endpoints[idx];
}

async function downloadAsset(url, kind) {
  const resp = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: DOWNLOAD_TIMEOUT_MS,
  });
  const bytes = Buffer.from(resp.data);
  const limit = kind === "image" ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
  if (bytes.length > limit) {
    throw new Error(`${kind} exceeds limit (${bytes.length} bytes > ${limit})`);
  }
  const contentType = resp.headers["content-type"] || (kind === "image" ? "image/jpeg" : "audio/mpeg");
  return { bytes, contentType, filename: undefined };
}

function decodeFilePayload(payload, kind) {
  if (!payload || !payload.data) return undefined;
  const bytes = Buffer.from(payload.data, "base64");
  const limit = kind === "image" ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
  if (bytes.length > limit) {
    throw new Error(`${kind} exceeds limit (${bytes.length} bytes > ${limit})`);
  }
  return {
    bytes,
    contentType: payload.contentType || (kind === "image" ? "image/jpeg" : "audio/mpeg"),
    filename: payload.filename || (kind === "image" ? "source.jpg" : "audio.mp3"),
  };
}

async function resolveImage(job) {
  if (job.data?.imageFile) {
    return decodeFilePayload(job.data.imageFile, "image");
  }
  if (job.data?.imageUrl) {
    return downloadAsset(job.data.imageUrl, "image");
  }
  throw new Error("Job missing image file or URL");
}

async function resolveAudio(job) {
  if (job.data?.audioFile) {
    return decodeFilePayload(job.data.audioFile, "audio");
  }
  if (job.data?.audioUrl) {
    return downloadAsset(job.data.audioUrl, "audio");
  }
  throw new Error("Job missing audio file or URL");
}

async function callRunPod(job, endpoint) {
  const { options, webhookUrl } = job.data;

  const image = await resolveImage(job);
  const audio = await resolveAudio(job);

  const form = new FormData();
  form.append("source_image", image.bytes, {
    filename: image.filename || `source-${job.id}.jpg`,
    contentType: image.contentType,
  });
  form.append("driven_audio", audio.bytes, {
    filename: audio.filename || `audio-${job.id}.mp3`,
    contentType: audio.contentType,
  });
  if (options?.resolution === "256p") {
    form.append("default_size", "256");
  }
  if (typeof options?.poseStyle === "number") {
    form.append("pose_style", String(options.poseStyle));
  }
  if (typeof options?.expressionScale === "number") {
    form.append("expression_scale", String(options.expressionScale));
  }
  if (typeof options?.still === "boolean") {
    form.append("still", options.still ? "true" : "false");
  }
  if (options?.enhancer) {
    form.append("enhancer", options.enhancer);
  }
  if (options?.backgroundEnhancer) {
    form.append("background_enhancer", options.backgroundEnhancer);
  }
  if (options?.preprocess) {
    form.append("preprocess", options.preprocess);
  }
  if (typeof options?.batchSize === "number") {
    form.append("batch_size", String(options.batchSize));
  }
  if (Array.isArray(options?.inputYaw) && options.inputYaw.length) {
    form.append("input_yaw", options.inputYaw.join(","));
  }
  if (Array.isArray(options?.inputPitch) && options.inputPitch.length) {
    form.append("input_pitch", options.inputPitch.join(","));
  }
  if (Array.isArray(options?.inputRoll) && options.inputRoll.length) {
    form.append("input_roll", options.inputRoll.join(","));
  }
  form.append("keep_intermediate", "false");
  if (webhookUrl) {
    form.append("webhook_url", webhookUrl);
  }

  const headers = {
    ...form.getHeaders(),
  };
  if (API_KEY_HEADER) {
    headers["X-API-Key"] = API_KEY_HEADER;
  } else if (endpoint.apiKey) {
    headers["X-API-Key"] = endpoint.apiKey;
  }
  if (!TOKEN_QUERY_ENABLED && endpoint.token) {
    headers.Authorization = `Bearer ${endpoint.token}`;
  }

  const createUrl = buildRemoteUrl(endpoint.url, REMOTE_CREATE_PATH, endpoint.token);

  const resp = await axios.post(createUrl, form, {
    headers,
    timeout: GENERATION_TIMEOUT_MS,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  if (resp.status >= 400) {
    throw new Error(`RunPod returned ${resp.status}`);
  }

  const jobId = resp.data?.jobId || resp.data?.id;
  if (jobId) {
    return { remoteJobId: jobId };
  }

  const directUrl =
    resp.data?.download_url ||
    resp.data?.downloadUrl ||
    resp.data?.storage?.url ||
    resp.data?.video_path ||
    resp.data?.videoPath;

  if (directUrl) {
    return {
      remoteJobId: null,
      immediateResult: {
        videoUrl: directUrl,
        storage: resp.data?.storage,
      },
    };
  }

  throw new Error("RunPod response missing jobId or video URL");
}

async function handleJob(job) {
  const endpoint = await nextEndpoint();
  if (!endpoint) {
    throw new Error("No RunPod endpoints available");
  }

  const requestId = job.data?.requestId || randomUUID();
  const startedAt = Date.now();

  console.log(`[sadtalker-worker] job=${job.id} request=${requestId} -> ${endpoint.url}`);

  const createResult = await callRunPod(job, endpoint);

  if (!createResult.remoteJobId && createResult.immediateResult) {
    await job.updateProgress({ value: 100, remoteJobId: null, remoteState: "succeeded" });
    const finalResult = {
      videoUrl: createResult.immediateResult.videoUrl,
      remoteJobId: null,
      durationMs: Date.now() - startedAt,
      storage: createResult.immediateResult.storage,
    };
    await recordJobHistory(job, finalResult);
    return finalResult;
  }

  await job.updateProgress({ value: 25, remoteJobId: createResult.remoteJobId });

  let remoteState = "running";
  let videoUrl = null;
  let storage = null;
  let error = null;

  while (remoteState === "running" || remoteState === "queued") {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    if (Date.now() - startedAt > GENERATION_TIMEOUT_MS) {
      throw new Error("SadTalker job timed out");
    }
    const statusUrl = buildRemoteUrl(
      endpoint.url,
      `${REMOTE_STATUS_PATH.replace(/\/$/, "")}/${createResult.remoteJobId}`,
      endpoint.token,
    );
    try {
      const resp = await axios.get(statusUrl, {
        headers: {
          ...(API_KEY_HEADER ? { "X-API-Key": API_KEY_HEADER } : {}),
          ...(endpoint.apiKey ? { "X-API-Key": endpoint.apiKey } : {}),
          ...(endpoint.token ? { Authorization: `Bearer ${endpoint.token}` } : {}),
        },
        timeout: 20_000,
      });
      remoteState = resp.data?.status || resp.data?.state || "unknown";
      if (resp.data?.download_url || resp.data?.downloadUrl) {
        videoUrl = resp.data.download_url || resp.data.downloadUrl;
      } else if (resp.data?.storage?.url) {
        videoUrl = resp.data.storage.url;
        storage = resp.data.storage;
      }
      if (resp.data?.error) {
        error = resp.data.error;
      }
      const pct = remoteState === "succeeded" ? 100 : remoteState === "failed" ? 100 : 25;
      await job.updateProgress({ value: pct, remoteJobId: createResult.remoteJobId, remoteState });
    } catch (err) {
      console.warn(`[sadtalker-worker] poll failed job=${job.id}`, err?.message || err);
    }
  }

  if (!videoUrl && remoteState === "succeeded") {
    throw new Error("Remote job succeeded but no video URL returned");
  }

  const durationMs = Date.now() - startedAt;
  console.log(
    `[sadtalker-worker] done job=${job.id} remote=${createResult.remoteJobId} state=${remoteState} duration=${durationMs}ms`,
  );

  if (remoteState === "failed") {
    throw new Error(error?.message || error || "Remote job failed");
  }

  const finalResult = {
    videoUrl,
    remoteJobId: createResult.remoteJobId,
    durationMs,
    storage,
  };
  await recordJobHistory(job, finalResult);
  return finalResult;
}

async function recordJobHistory(job, payload) {
  try {
    if (!payload?.videoUrl) return;
    const rawUserId = job.data?.userId;
    const userId = typeof rawUserId === "string" && rawUserId.trim() ? rawUserId.trim() : "anonymous";
    const record = {
      jobId: job.id,
      remoteJobId: payload.remoteJobId || null,
      videoUrl: payload.videoUrl,
      durationMs: payload.durationMs || null,
      createdAt: new Date().toISOString(),
      options: job.data?.options || null,
    };
    const key = `sadtalker:history:${userId}`;
    await redis.lpush(key, JSON.stringify(record));
    if (HISTORY_LIMIT > 0) {
      await redis.ltrim(key, 0, HISTORY_LIMIT - 1);
    }
    if (process.env.NODE_ENV !== "production") {
      console.log("[sadtalker-worker] stored history", { userId, jobId: job.id });
    }
  } catch (err) {
    console.warn("[sadtalker-worker] history append failed", err?.message || err);
  }
}

function parseRunPodEndpoints(raw) {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      return arr
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const url = String(item.url || "").trim();
          const token = String(item.token || "").trim();
          const apiKey = item.apiKey ? String(item.apiKey).trim() : undefined;
          if (!url || !token) return null;
          return { url, token, apiKey };
        })
        .filter(Boolean);
    }
  } catch (err) {
    console.warn("[sadtalker-worker] Failed to parse SADTALKER_RUNPOD_ENDPOINTS as JSON:", err);
  }
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [url, token, apiKey] = entry.split("|").map((part) => part.trim());
      if (!url || !token) return null;
      return { url, token, apiKey: apiKey || undefined };
    })
    .filter(Boolean);
}

function extractRunPodEndpoints(source) {
  const entries = [];
  const seen = new Set();

  const maybeAdd = (url, token, apiKey) => {
    if (!url || !token) return;
    const normalizedUrl = String(url).trim();
    const normalizedToken = String(token).trim();
    if (!normalizedUrl || !normalizedToken) return;
    const key = `${normalizedUrl}|${normalizedToken}`;
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ url: normalizedUrl, token: normalizedToken, apiKey: apiKey ? String(apiKey).trim() : undefined });
  };

  const candidates = [
    source?.proxyUrls,
    source?.proxy_urls,
    source?.proxy,
    source?.httpProxy,
    source?.restProxy,
    source?.restProxyUrls,
  ];

  candidates.forEach((candidate) => {
    if (!candidate || typeof candidate !== "object") return;
    maybeAdd(candidate.http || candidate.https || candidate.url, candidate.token || candidate.authToken, candidate.apiKey);
  });

  const pods =
    source?.pods ||
    source?.podList ||
    source?.workers ||
    source?.workerNodes ||
    source?.instances ||
    source?.runningPods ||
    source?.data ||
    [];

  if (Array.isArray(pods)) {
    pods.forEach((pod) => {
      const nested = [
        pod?.proxyUrls,
        pod?.proxy_urls,
        pod?.proxy,
        pod?.httpProxy,
        pod?.restProxy,
        pod?.restProxyUrls,
      ];
      nested.forEach((candidate) => {
        if (!candidate || typeof candidate !== "object") return;
        maybeAdd(candidate.http || candidate.https || candidate.url, candidate.token || candidate.authToken, candidate.apiKey);
      });
      if (pod?.url && pod?.token) {
        maybeAdd(pod.url, pod.token, pod.apiKey);
      }
    });
  }

  return entries;
}

function buildRemoteUrl(base, path, token) {
  const url = new URL(path, base);
  if (TOKEN_QUERY_ENABLED && token) {
    const params = url.searchParams;
    if (!params.has("token")) {
      params.set("token", token);
    }
  }
  return url.toString();
}

async function fetchRunPodEndpoints(endpointId) {
  const headers = { Authorization: `Bearer ${RUNPOD_API_KEY}` };
  const urlsToTry = [
    `https://api.runpod.io/v2/endpoint/${endpointId}/status`,
    `https://api.runpod.io/v2/endpoint/${endpointId}`,
    `https://api.runpod.io/v2/pods/${endpointId}/status`,
    `https://api.runpod.io/v2/pods/${endpointId}`,
  ];

  for (const url of urlsToTry) {
    try {
      const resp = await axios.get(url, { headers, timeout: 15_000 });
      const data = resp.data?.data || resp.data;
      const extracted = extractRunPodEndpoints(data);
      if (extracted.length) {
        return extracted;
      }
    } catch (err) {
      if (err?.response?.status && urlsToTry.indexOf(url) < urlsToTry.length - 1) {
        continue;
      }
      console.warn("[sadtalker-worker] RunPod API error", url, err?.message || err);
    }
  }
  return [];
}

const concurrency = Number(process.env.SADTALKER_WORKER_CONCURRENCY || "1");

console.log("[sadtalker-worker] starting", {
  queue: QUEUE_NAME,
  dynamic: RUNPOD_ENDPOINT_IDS.length > 0,
  staticEndpoints: RUNPOD_STATIC_ENDPOINTS.map((e) => e.url),
  concurrency,
});

const worker = new Worker(QUEUE_NAME, handleJob, {
  connection: redis,
  concurrency,
  lockDuration: GENERATION_TIMEOUT_MS + 60_000,
});

worker.on("failed", (job, err) => {
  console.error("[sadtalker-worker] job failed", { id: job?.id, err: err?.message, stack: err?.stack });
});

worker.on("completed", (job) => {
  console.log("[sadtalker-worker] job completed", { id: job?.id });
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

let isShuttingDown = false;
function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`[sadtalker-worker] received ${signal}, closing...`);
  Promise.allSettled([worker.close(), redis.quit()])
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("[sadtalker-worker] shutdown error", err);
      process.exit(1);
    });
}
