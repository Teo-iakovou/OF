// Production origins are hardcoded and cannot be widened via env vars.
// This prevents a misconfigured ALLOWED_ORIGINS from opening CORS in prod.
const PRODUCTION_ORIGINS = [
  "https://echo-fy.com",
  "https://www.echo-fy.com",
];

// Additional origins only active in non-production environments.
const DEVELOPMENT_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3002",
];

const isProd = process.env.NODE_ENV === "production";

// In production: hardcoded list only — ALLOWED_ORIGINS env var is ignored.
// In development: hardcoded list + dev origins + any ALLOWED_ORIGINS additions.
const allowedOrigins = isProd
  ? PRODUCTION_ORIGINS
  : [
      ...PRODUCTION_ORIGINS,
      ...DEVELOPMENT_ORIGINS,
      ...String(process.env.ALLOWED_ORIGINS || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ].filter((v, i, a) => a.indexOf(v) === i); // dedupe

module.exports = allowedOrigins;
