type RunPodEndpoint = {
  url: string;
  token: string;
  apiKey?: string;
};

const REQUIRED_ENV = ["SADTALKER_REDIS_URL"] as const;

function requireEnv(name: (typeof REQUIRED_ENV)[number]): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[sadtalker-config] Missing required env var ${name}`);
  }
  return value;
}

function parseRunPodEndpoints(raw: string | undefined): RunPodEndpoint[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const url = typeof (item as any).url === "string" ? (item as any).url.trim() : "";
          const token = typeof (item as any).token === "string" ? (item as any).token.trim() : "";
          const apiKey =
            typeof (item as any).apiKey === "string" && (item as any).apiKey.trim()
              ? (item as any).apiKey.trim()
              : undefined;
          if (!url || !token) return null;
          return { url, token, apiKey };
        })
        .filter((item): item is RunPodEndpoint => !!item);
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
      if (!url || !token) return null;
      return { url, token, apiKey: apiKey || undefined };
    })
    .filter((item): item is RunPodEndpoint => !!item);
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
