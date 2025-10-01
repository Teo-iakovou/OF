const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION || "us-east-1";
const bucket = process.env.S3_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

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
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key });
  // For get-signed-URL, we actually need a GetObjectCommand; import lazily
  const { GetObjectCommand } = require("@aws-sdk/client-s3");
  const getCmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(s3, getCmd, { expiresIn: ttlSeconds });
}

module.exports = { s3, putObject, signUrl, bucket, region, endpoint };

