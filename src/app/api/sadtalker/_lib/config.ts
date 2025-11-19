type RunPodEndpoint = {
  url: string;
  token: string;
  apiKey?: string;
};

type RequiredEnv = "SADTALKER_REDIS_URL";

function requireEnv(name: RequiredEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[sadtalker-config] Missing required env var ${name}`);
  }
  return value;
}

const isRunPodEndpoint = (value: RunPodEndpoint | null): value is RunPodEndpoint =>
  value !== null;

const toEndpoint = (value: unknown): RunPodEndpoint | null => {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const url = typeof record.url === "string" ? record.url.trim() : "";
  const token = typeof record.token === "string" ? record.token.trim() : "";
  const apiKey =
    typeof record.apiKey === "string" && record.apiKey.trim() ? record.apiKey.trim() : undefined;
  if (!url || !token) return null;
  return { url, token, apiKey };
};

function parseRunPodEndpoints(raw: string | undefined): RunPodEndpoint[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(toEndpoint).filter(isRunPodEndpoint);
    }
  } catch (err) {
    // fall through to delimiter parsing below
    if (process.env.NODE_ENV !== "production") {
      console.warn("[sadtalker-config] Failed to parse SADTALKER_RUNPOD_ENDPOINTS as JSON:", err);
    }
  }

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [url, token, apiKey] = entry.split("|").map((part) => part.trim());
      return toEndpoint({ url, token, apiKey });
    })
    .filter(isRunPodEndpoint);
}

export const sadTalkerConfig = {
  redisUrl: requireEnv("SADTALKER_REDIS_URL"),
  runPodEndpoints: parseRunPodEndpoints(process.env.SADTALKER_RUNPOD_ENDPOINTS),
  storageProvider: (process.env.SADTALKER_STORAGE_PROVIDER || "").toLowerCase() || undefined,
  r2Bucket: process.env.SADTALKER_R2_BUCKET,
  r2AccountId: process.env.SADTALKER_R2_ACCOUNT_ID,
  r2AccessKeyId: process.env.SADTALKER_R2_ACCESS_KEY_ID,
  r2SecretAccessKey: process.env.SADTALKER_R2_SECRET_ACCESS_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_KEY,
  supabaseBucket: process.env.SUPABASE_BUCKET || "sadtalker",
};

export type SadTalkerConfig = typeof sadTalkerConfig;
export type { RunPodEndpoint };
