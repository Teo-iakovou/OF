/* eslint-disable @typescript-eslint/no-require-imports */
const axios = require("axios");

const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY || process.env.SADTALKER_RUNPOD_API_KEY || "";
const RUNPOD_TEMPLATE_ID = process.env.RUNPOD_TEMPLATE_ID || "";
const RUNPOD_VOLUME_ID = process.env.RUNPOD_VOLUME_ID || "";
const RUNPOD_GPU_TYPES = parseGpuTypes(process.env.RUNPOD_GPU_TYPES || process.env.RUNPOD_GPU_TYPE || "");
const RUNPOD_ALLOW_CREATE = parseBool(process.env.RUNPOD_ALLOW_CREATE ?? "false");
const STATIC_ENDPOINTS = parseRunPodEndpoints(process.env.SADTALKER_RUNPOD_ENDPOINTS);

const RUNPOD_API_BASE_URL = (process.env.RUNPOD_API_BASE_URL || "https://rest.runpod.io/v1").replace(/\/+$/, "");
const ENDPOINT_CACHE_MS = parseDuration(process.env.RUNPOD_ENDPOINT_CACHE_MS, 30_000);
const START_TIMEOUT_MS = parseDuration(process.env.RUNPOD_START_TIMEOUT_MS, 8 * 60_000);
const POLL_INTERVAL_MS = parseDuration(process.env.RUNPOD_POLL_INTERVAL_MS, 10_000);

const dynamicEnabled = Boolean(RUNPOD_API_KEY);
const safeStaticEndpoints = STATIC_ENDPOINTS.map((endpoint) => ({ ...endpoint }));

let cachedEndpoint = null;
let cachedPodId = null;
let lastEndpointRefresh = 0;
let ensurePromise = null;
let staticEndpointIndex = 0;

const apiClient = dynamicEnabled
  ? axios.create({
      baseURL: RUNPOD_API_BASE_URL,
      headers: { Authorization: `Bearer ${RUNPOD_API_KEY}` },
      timeout: 30_000,
    })
  : null;

if (!dynamicEnabled && !safeStaticEndpoints.length) {
  console.warn(
    "[runpod-manager] RUNPOD_API_KEY/RUNPOD_TEMPLATE_ID missing and no SADTALKER_RUNPOD_ENDPOINTS fallback set. Jobs will fail.",
  );
} else if (!dynamicEnabled) {
  console.warn("[runpod-manager] RUNPOD_API_KEY or RUNPOD_TEMPLATE_ID missing. Falling back to static endpoints only.");
} else {
  console.log("[runpod-manager] dynamic RunPod management enabled", {
    templateId: RUNPOD_TEMPLATE_ID,
    volumeId: RUNPOD_VOLUME_ID || undefined,
    gpuTypes: RUNPOD_GPU_TYPES.length ? RUNPOD_GPU_TYPES : undefined,
    allowCreate: RUNPOD_ALLOW_CREATE,
  });
}

async function getEndpoint() {
  if (dynamicEnabled) {
    try {
      return await ensureDynamicEndpoint();
    } catch (err) {
      console.warn("[runpod-manager] dynamic endpoint lookup failed:", err?.message || err);
      clearCachedEndpoint();
      if (!safeStaticEndpoints.length) {
        throw err;
      }
    }
  }
  const fallback = nextStaticEndpoint();
  if (fallback) {
    return fallback;
  }
  throw new Error("No RunPod endpoints configured");
}

function markJobStart() {
}

function markJobEnd() {
}

function isDynamicEnabled() {
  return dynamicEnabled;
}

function getStaticEndpoints() {
  return safeStaticEndpoints.slice();
}

function getCurrentPodId() {
  return cachedPodId;
}

async function ensureDynamicEndpoint() {
  if (cachedEndpoint && Date.now() - lastEndpointRefresh < ENDPOINT_CACHE_MS) {
    return cachedEndpoint;
  }
  if (!ensurePromise) {
    ensurePromise = refreshDynamicEndpoint()
      .then((endpoint) => {
        cachedEndpoint = endpoint;
        lastEndpointRefresh = Date.now();
        return cachedEndpoint;
      })
      .finally(() => {
        ensurePromise = null;
      });
  }
  return ensurePromise;
}

async function refreshDynamicEndpoint() {
  const pod = await findOrCreateRunningPod();
  const endpoints = extractRunPodEndpoints(pod);
  let endpoint = null;
  if (endpoints.length) {
    endpoint = { ...endpoints[0], podId: getPodId(pod) };
  } else {
    const proxyUrl = buildProxyUrlFromPod(pod);
    if (proxyUrl) {
      endpoint = { url: proxyUrl, token: undefined, apiKey: undefined, podId: getPodId(pod) };
    }
  }
  if (!endpoint) {
    throw new Error("Dynamic pod is running but exposes no proxy URLs");
  }
  cachedPodId = endpoint.podId;
  return endpoint;
}

async function findOrCreateRunningPod() {
  const pods = await listPods();
  const running = pickBestPod(pods, ["RUNNING"]);
  if (running) {
    return running;
  }
  const booting = pickBestPod(pods, ["STARTING", "REQUESTED", "PENDING", "INITIALIZING", "PROVISIONING"]);
  if (booting) {
    console.log("[runpod-manager] waiting for existing pod to finish booting", {
      podId: getPodId(booting),
      status: getPodStatus(booting),
    });
    return waitForPodReady(getPodId(booting));
  }
  if (!RUNPOD_ALLOW_CREATE) {
    throw new Error(
      "No SadTalker pods are currently running. Start a pod manually in RunPod (with the correct template/volume) or enable RUNPOD_ALLOW_CREATE.",
    );
  }
  const created = await createPod();
  const podId = getPodId(created);
  console.log("[runpod-manager] launched new pod", { podId });
  return waitForPodReady(podId);
}

async function listPods() {
  if (!apiClient) return [];
  const params = [];
  if (RUNPOD_VOLUME_ID) {
    params.push(`networkVolumeId=${encodeURIComponent(RUNPOD_VOLUME_ID)}`);
  }
  if (RUNPOD_TEMPLATE_ID) {
    params.push(`templateId=${encodeURIComponent(RUNPOD_TEMPLATE_ID)}`);
  }
  const url = params.length ? `/pods?${params.join("&")}` : "/pods";
  try {
    const payload = await apiGet(url);
    try {
      console.log("[runpod-manager] pods response", JSON.stringify(payload, null, 2));
    } catch (err) {
      console.log("[runpod-manager] pods response (unserialized)", payload);
    }
    const pods = normalizePodList(payload);
    return pods;
  } catch (err) {
    console.warn("[runpod-manager] listPods failed", err?.response?.status || err?.message || err);
    return [];
  }
}

async function waitForPodReady(podId) {
  const startedAt = Date.now();
  while (true) {
    const pod = await fetchPod(podId);
    const endpoints = extractRunPodEndpoints(pod);
    if (endpoints.length) {
      return pod;
    }
    const status = getPodStatus(pod);
    if (status === "RUNNING") {
      return pod;
    }
    if (isTerminalStatus(status)) {
      throw new Error(`RunPod pod ${podId} entered terminal state ${status}`);
    }
    if (Date.now() - startedAt > START_TIMEOUT_MS) {
      throw new Error(`Timed out waiting for RunPod pod ${podId} to start`);
    }
    await sleep(POLL_INTERVAL_MS);
  }
}

async function fetchPod(podId) {
  const payload = await apiGet(`/pods/${encodeURIComponent(podId)}`);
  return normalizePod(payload);
}

async function createPod() {
  const podName = buildPodName();
  const body = {
    templateId: RUNPOD_TEMPLATE_ID,
    name: podName,
    cloudType: process.env.RUNPOD_CLOUD_TYPE || "COMMUNITY",
    // Attach a shared Network Volume if configured so that pods
    // created dynamically have access to pre-seeded SadTalker files.
    ...(RUNPOD_VOLUME_ID ? { networkVolumeId: RUNPOD_VOLUME_ID } : {}),
    // Optionally prefer specific GPU types, ordered by priority.
    ...(RUNPOD_GPU_TYPES.length ? { gpuTypeIds: RUNPOD_GPU_TYPES } : {}),
  };
  try {
    const payload = await apiPost("/pods", body);
    return normalizePod(payload);
  } catch (err) {
    console.error("[runpod-manager] createPod failed", {
      status: err?.response?.status,
      data: err?.response?.data,
      body,
    });
    if (err?.response?.data) {
      console.error("[runpod-manager] full error from RunPod:", JSON.stringify(err.response.data, null, 2));
    }
    throw err;
  }
}

function nextStaticEndpoint() {
  if (!safeStaticEndpoints.length) return null;
  const endpoint = safeStaticEndpoints[staticEndpointIndex % safeStaticEndpoints.length];
  staticEndpointIndex += 1;
  return { ...endpoint };
}

function clearCachedEndpoint() {
  cachedEndpoint = null;
  cachedPodId = null;
  lastEndpointRefresh = 0;
}

async function apiGet(path) {
  if (!apiClient) {
    throw new Error("RunPod API client is not configured");
  }
  console.log("[runpod-manager] calling GET", path);
  const resp = await apiClient.get(path);
  return resp.data?.data ?? resp.data;
}

async function apiPost(path, body) {
  if (!apiClient) {
    throw new Error("RunPod API client is not configured");
  }
  console.log("[runpod-manager] calling POST", path);
  const resp = await apiClient.post(path, body);
  return resp.data?.data ?? resp.data;
}

function normalizePodList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.pods)) return payload.pods;
  if (Array.isArray(payload?.items)) return payload.items;
  if (payload?.pod) return [payload.pod];
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  return [];
}

function normalizePod(payload) {
  if (!payload) return {};
  if (payload?.pod) return payload.pod;
  return payload;
}

function buildPodName() {
  const prefix = process.env.RUNPOD_POD_NAME_PREFIX || "sadtalker";
  return `${prefix}-${Date.now().toString(36)}`;
}

function buildProxyUrlFromPod(pod) {
  const ports = Array.isArray(pod?.ports) ? pod.ports : [];
  const hasHttp8888 = ports.some((entry) => {
    if (!entry) return false;
    if (typeof entry === "string") {
      return entry.startsWith("8888/http");
    }
    const portValue = entry.containerPort ?? entry.port ?? entry.id;
    if (!portValue) return false;
    return String(portValue).startsWith("8888");
  });
  if (!hasHttp8888) {
    return null;
  }
  const podId = getPodId(pod);
  if (!podId) return null;
  return `https://${podId}-8888.proxy.runpod.net`;
}

function pickBestPod(pods, statuses) {
  const desired = pods.filter((pod) => statuses.includes(getPodStatus(pod)));
  if (!desired.length) return null;
  desired.sort((a, b) => {
    const endpointsA = extractRunPodEndpoints(a).length;
    const endpointsB = extractRunPodEndpoints(b).length;
    if (endpointsB !== endpointsA) {
      return endpointsB - endpointsA;
    }
    const timeA = getPodStartTime(a);
    const timeB = getPodStartTime(b);
    if (timeB !== timeA) {
      return timeA - timeB;
    }
    return getPodId(a).localeCompare(getPodId(b));
  });
  return desired[0];
}

function getPodStartTime(pod) {
  const fields = [pod.startedAt, pod.started_at, pod.createdAt, pod.created_at, pod.creationTime];
  for (const field of fields) {
    const timestamp = Date.parse(field);
    if (!Number.isNaN(timestamp)) return timestamp;
  }
  return 0;
}

function getPodStatus(pod) {
  const status =
    pod?.status ||
    pod?.state ||
    pod?.podStatus ||
    pod?.pod_status ||
    pod?.desiredStatus ||
    pod?.runtime ||
    "";
  return String(status || "").toUpperCase();
}

function isTerminalStatus(status) {
  return ["FAILED", "TERMINATED", "DELETED", "ERROR", "CANCELLED"].includes(status);
}

function getPodId(pod) {
  return pod?.id || pod?.podId || pod?.pod_id || pod?.podID || pod?.identifier || "";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseDuration(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBool(value, fallback) {
  if (value === undefined || value === null) return fallback;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return fallback;
  if (["1", "true", "t", "yes", "y"].includes(normalized)) return true;
  if (["0", "false", "f", "no", "n"].includes(normalized)) return false;
  return fallback;
}

function parseGpuTypes(raw) {
  if (!raw) return [];

  const aliasMap = new Map(
    [
      ["RTX 4090", "NVIDIA GeForce RTX 4090"],
      ["GEFORCE RTX 4090", "NVIDIA GeForce RTX 4090"],
      ["RTX 5090", "NVIDIA GeForce RTX 5090"],
      ["GEFORCE RTX 5090", "NVIDIA GeForce RTX 5090"],
      ["RTX 4000 ADA", "NVIDIA RTX 4000 Ada Generation"],
      ["RTX 4000 ADA GENERATION", "NVIDIA RTX 4000 Ada Generation"],
    ].map(([k, v]) => [k.toUpperCase(), v]),
  );

  const tokens = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  const result = [];
  for (const token of tokens) {
    if (!token) continue;
    if (token.toUpperCase().startsWith("NVIDIA")) {
      result.push(token);
      continue;
    }
    const mapped = aliasMap.get(token.toUpperCase());
    if (mapped) {
      result.push(mapped);
    } else {
      console.warn(
        "[runpod-manager] Unknown RUNPOD_GPU_TYPES entry; expected full RunPod GPU name, got:",
        token,
      );
    }
  }
  return result;
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
    console.warn("[runpod-manager] Failed to parse SADTALKER_RUNPOD_ENDPOINTS as JSON:", err?.message || err);
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
    source?.network,
    source?.networkInterfaces,
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

module.exports = {
  getEndpoint,
  markJobStart,
  markJobEnd,
  isDynamicEnabled,
  getStaticEndpoints,
  getCurrentPodId,
};
