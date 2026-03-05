const { S3Client, PutObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION || "auto";
const bucket = process.env.S3_BUCKET;
const publicAssetBaseUrl = process.env.PUBLIC_ASSET_BASE_URL;
const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

if (process.env.NODE_ENV !== "production") {
  console.log("[s3] using keys", {
    accessLen: accessKeyId?.length || 0,
    endpoint: process.env.S3_ENDPOINT,
    bucket: process.env.S3_BUCKET,
  });
}

if (!bucket) {
  console.warn("[s3] S3_BUCKET not set; S3 uploads will fail until configured.");
}

const s3 = new S3Client({
  region,
  endpoint,
  forcePathStyle: !!endpoint && !endpoint.includes("amazonaws.com"),
  credentials:
    accessKeyId && secretAccessKey
      ? { accessKeyId, secretAccessKey }
      : undefined,
});

async function putObject(key, body, contentType) {
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType });
  await s3.send(cmd);
}

async function signUrl(key, ttlSeconds = 3600) {
  // For get-signed-URL, we actually need a GetObjectCommand; import lazily
  const { GetObjectCommand } = require("@aws-sdk/client-s3");
  const getCmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(s3, getCmd, { expiresIn: ttlSeconds });
}

async function objectExists(key) {
  if (!key) return false;
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

function buildPublicUrl(key) {
  const cleanKey = String(key || "").replace(/^\/+/, "");
  if (!cleanKey) return null;

  if (publicAssetBaseUrl) {
    const base = String(publicAssetBaseUrl).replace(/\/+$/, "");
    return `${base}/${cleanKey}`;
  }

  return null;
}

module.exports = { s3, putObject, signUrl, objectExists, buildPublicUrl, bucket, region, endpoint };
