type RequiredEnv = "SADTALKER_REDIS_URL";

function requireEnv(name: RequiredEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[sadtalker-config] Missing required env var ${name}`);
  }
  return value;
}

export const sadTalkerConfig = {
  redisUrl: requireEnv("SADTALKER_REDIS_URL"),
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
