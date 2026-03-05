const {
  RekognitionClient,
  IndexFacesCommand,
  SearchFacesByImageCommand,
  DescribeCollectionCommand,
  CreateCollectionCommand,
} = require("@aws-sdk/client-rekognition");

const region = process.env.REKOGNITION_REGION || process.env.AWS_REGION || process.env.S3_REGION || "us-east-1";
const collectionId = process.env.REKOGNITION_COLLECTION_ID;
const matchThreshold = Number(process.env.REKOGNITION_MATCH_THRESHOLD || 90);
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error("[rekognition] AWS credentials missing: set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY");
}

const rekognition = new RekognitionClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

async function ensureRekognitionCollection() {
  if (!collectionId) {
    console.log("[rekognition] REKOGNITION_COLLECTION_ID not set; skipping init");
    return { status: "skipped" };
  }
  try {
    await rekognition.send(new DescribeCollectionCommand({ CollectionId: collectionId }));
    console.log(`[rekognition] collection ready: ${collectionId}`);
    return { status: "exists" };
  } catch (err) {
    if (err?.name !== "ResourceNotFoundException") {
      console.error("[rekognition] describe failed:", err?.message || err);
      return { status: "error" };
    }
    try {
      await rekognition.send(new CreateCollectionCommand({ CollectionId: collectionId }));
      console.log(`[rekognition] collection created: ${collectionId}`);
      return { status: "created" };
    } catch (createErr) {
      console.error("[rekognition] create failed:", createErr?.message || createErr);
      return { status: "error" };
    }
  }
}

async function indexFaceFromBuffer(buffer, { externalImageId, requestId } = {}) {
  if (!collectionId) {
    throw new Error("REKOGNITION_COLLECTION_ID not set");
  }
  const cmd = new IndexFacesCommand({
    CollectionId: collectionId,
    Image: { Bytes: buffer },
    ExternalImageId: externalImageId,
    MaxFaces: 5,
    QualityFilter: "AUTO",
  });
  const resp = await rekognition.send(cmd);
  const records = Array.isArray(resp.FaceRecords) ? resp.FaceRecords : [];
  const faceCount = records.length;
  const faceId = records[0]?.Face?.FaceId || null;
  return { faceId, faceCount, requestId };
}

async function verifyFaceMatches(buffer, faceId, { requestId, expectedExternalImageId } = {}) {
  if (!collectionId) {
    throw new Error("REKOGNITION_COLLECTION_ID not set");
  }
  console.log(
    JSON.stringify({
      requestId: requestId || null,
      stage: "rekognition_search_before",
      faceId: faceId || null,
      matchThreshold,
      collectionId: collectionId || null,
      region,
      bufferBytes: typeof buffer?.byteLength === "number" ? buffer.byteLength : null,
    })
  );
  const cmd = new SearchFacesByImageCommand({
    CollectionId: collectionId,
    Image: { Bytes: buffer },
    MaxFaces: 5,
    FaceMatchThreshold: matchThreshold,
  });
  const resp = await rekognition.send(cmd);
  const matches = Array.isArray(resp.FaceMatches) ? resp.FaceMatches : [];
  if (matches.length === 0) {
    return {
      matched: false,
      similarity: null,
      matchedFaceId: null,
      requestId,
      threshold: matchThreshold,
      reason: "NO_FACE_DETECTED",
    };
  }
  const best = matches[0];
  const bestFaceId = best?.Face?.FaceId ?? null;
  const bestSimilarity = typeof best?.Similarity === "number" ? best.Similarity : null;
  console.log(
    JSON.stringify({
      requestId: requestId || null,
      stage: "rekognition_search_snapshot",
      faceMatchesCount: matches.length || 0,
      firstMatchSimilarity: bestSimilarity,
      firstMatchFaceId: bestFaceId,
      allMatchFaceIdsSample: matches.map((m) => m?.Face?.FaceId || null).filter(Boolean).slice(0, 3),
    })
  );
  const exact = matches.find((m) => m?.Face?.FaceId === faceId) || null;
  const exactSimilarity = typeof exact?.Similarity === "number" ? exact.Similarity : null;
  const exactExternalImageId = exact?.Face?.ExternalImageId || null;
  const matchedFaceId = exact?.Face?.FaceId || null;
  const similarity = exactSimilarity;
  console.log(
    JSON.stringify({
      requestId: requestId || null,
      stage: "rekognition_search_after",
      faceMatchesCount: matches.length || 0,
      bestFaceId: matchedFaceId,
      bestSimilarity: similarity,
      bestExternalImageId: best?.Face?.ExternalImageId || null,
      exactFound: !!exact,
      exactSimilarity,
      exactExternalImageId,
      responseFaceIdListSample: matches
        .map((m) => m?.Face?.FaceId || null)
        .filter(Boolean)
        .slice(0, 3),
    })
  );
  const matched =
    matchedFaceId === faceId &&
    typeof similarity === "number" &&
    similarity >= matchThreshold;
  console.log(
    JSON.stringify({
      requestId: requestId || null,
      stage: "rekognition_match_eval",
      expectedFaceId: faceId || null,
      matchedFaceId,
      similarity,
      threshold: matchThreshold,
      matched,
    })
  );
  return {
    matched,
    similarity,
    matchedFaceId,
    requestId,
    threshold: matchThreshold,
  };
}

module.exports = {
  rekognition,
  ensureRekognitionCollection,
  indexFaceFromBuffer,
  verifyFaceMatches,
};
