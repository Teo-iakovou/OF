const {
  RekognitionClient,
  IndexFacesCommand,
  SearchFacesByImageCommand,
} = require("@aws-sdk/client-rekognition");

const region = process.env.REKOGNITION_REGION || process.env.AWS_REGION || process.env.S3_REGION || "us-east-1";
const collectionId = process.env.REKOGNITION_COLLECTION_ID;
const matchThreshold = Number(process.env.REKOGNITION_MATCH_THRESHOLD || 90);
const verifyThreshold = Number(process.env.FACE_VERIFY_THRESHOLD || 90);
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const getRekognitionClient = () => {
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("[faceEngine] AWS credentials missing: set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY");
  }
  return new RekognitionClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
};

const requireCollectionId = () => {
  if (!collectionId) {
    throw new Error("[faceEngine] REKOGNITION_COLLECTION_ID not set");
  }
  return collectionId;
};

const makeError = (code, message) => {
  const err = new Error(message);
  err.code = code;
  return err;
};

async function enroll({ imageBuffer, externalImageId }) {
  if (!imageBuffer) {
    throw makeError("FACE_REQUIRED_FOR_ENROLLMENT", "Image buffer is required");
  }
  const rekognition = getRekognitionClient();
  const cmd = new IndexFacesCommand({
    CollectionId: requireCollectionId(),
    Image: { Bytes: imageBuffer },
    ...(externalImageId ? { ExternalImageId: externalImageId } : {}),
    MaxFaces: 5,
    QualityFilter: "AUTO",
  });
  const resp = await rekognition.send(cmd);
  const records = Array.isArray(resp.FaceRecords) ? resp.FaceRecords : [];
  if (records.length === 0) {
    throw makeError("FACE_REQUIRED_FOR_ENROLLMENT", "No face detected for enrollment");
  }
  if (records.length > 1) {
    throw makeError("MULTIPLE_FACES_NOT_ALLOWED", "Multiple faces detected for enrollment");
  }
  const faceId = records[0]?.Face?.FaceId || null;
  if (!faceId) {
    throw makeError("FACE_REQUIRED_FOR_ENROLLMENT", "FaceId missing from enrollment response");
  }
  return { faceId };
}

async function verify({ imageBuffer, faceId, expectedExternalImageId }) {
  if (!imageBuffer || !faceId) {
    throw makeError("VERIFY_INPUT_REQUIRED", "Image buffer and faceId are required");
  }
  const rekognition = getRekognitionClient();
  const cmd = new SearchFacesByImageCommand({
    CollectionId: requireCollectionId(),
    Image: { Bytes: imageBuffer },
    MaxFaces: 1,
    FaceMatchThreshold: matchThreshold,
  });
  const resp = await rekognition.send(cmd);
  const matches = Array.isArray(resp.FaceMatches) ? resp.FaceMatches : [];
  const filteredMatches = expectedExternalImageId
    ? matches.filter((m) => m?.Face?.ExternalImageId === expectedExternalImageId)
    : matches;
  const hasExternalIds = matches.some((m) => m?.Face?.ExternalImageId);
  const effectiveMatches =
    expectedExternalImageId && filteredMatches.length === 0 && !hasExternalIds ? matches : filteredMatches;
  const facesDetected = effectiveMatches.length;
  const best = effectiveMatches[0];
  const similarity = typeof best?.Similarity === "number" ? best.Similarity : 0;
  const matchedFaceId = best?.Face?.FaceId || null;
  const allMatchedFaceIds = effectiveMatches.map((m) => m?.Face?.FaceId || null);
  const allSimilarities = effectiveMatches.map((m) =>
    typeof m?.Similarity === "number" ? m.Similarity : null
  );
  const allMatches = effectiveMatches.map((m) => ({
    faceId: m?.Face?.FaceId || null,
    externalImageId: m?.Face?.ExternalImageId || null,
    similarity: typeof m?.Similarity === "number" ? m.Similarity : null,
  }));
  const matchAnyEnrolled = effectiveMatches.some(
    (m) => m?.Face?.FaceId === faceId && typeof m?.Similarity === "number" && m.Similarity >= verifyThreshold
  );
  const matchTop = typeof similarity === "number" && similarity >= verifyThreshold;
  const match = matchAnyEnrolled || matchTop;
  return {
    match,
    confidence: similarity,
    similarity,
    facesDetected,
    threshold: verifyThreshold,
    matchedFaceId,
    allMatchedFaceIds,
    allSimilarities,
    allMatches,
  };
}

module.exports = { enroll, verify };
