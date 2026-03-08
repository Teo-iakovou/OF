const {
  RekognitionClient,
  IndexFacesCommand,
  SearchFacesByImageCommand,
  DescribeCollectionCommand,
  CreateCollectionCommand,
  ListFacesCommand,
  DeleteFacesCommand,
} = require("@aws-sdk/client-rekognition");

const region = process.env.REKOGNITION_REGION || process.env.AWS_REGION || process.env.S3_REGION || "us-east-1";
const collectionId = process.env.REKOGNITION_COLLECTION_ID;
const matchThreshold = Number(process.env.REKOGNITION_MATCH_THRESHOLD || 90);
const maxVerifyCandidates = Number(process.env.REKOGNITION_VERIFY_MAX_FACES || 25);
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
    MaxFaces: Number.isFinite(maxVerifyCandidates) && maxVerifyCandidates > 0 ? maxVerifyCandidates : 25,
    // Return top candidates and evaluate threshold ourselves so we can return
    // a precise reason instead of collapsing into "no match".
    FaceMatchThreshold: 0,
  });
  let resp;
  try {
    resp = await rekognition.send(cmd);
  } catch (err) {
    if (err?.name === "InvalidParameterException") {
      return {
        matched: false,
        similarity: null,
        matchedFaceId: null,
        topSimilarity: null,
        topFaceId: null,
        matchCount: 0,
        requestId,
        threshold: matchThreshold,
        reason: "NO_FACE_FOUND",
      };
    }
    throw err;
  }
  const matches = Array.isArray(resp.FaceMatches) ? resp.FaceMatches : [];
  if (matches.length === 0) {
    return {
      matched: false,
      similarity: null,
      matchedFaceId: null,
      topSimilarity: null,
      topFaceId: null,
      matchCount: 0,
      requestId,
      threshold: matchThreshold,
      reason: "FACE_MATCH_NOT_FOUND",
    };
  }
  const best = matches[0];
  const bestFaceId = best?.Face?.FaceId ?? null;
  const bestSimilarity = typeof best?.Similarity === "number" ? best.Similarity : null;
  const bestExternalImageId = best?.Face?.ExternalImageId || null;
  const allMatchExternalImageIdsSample = matches
    .map((m) => m?.Face?.ExternalImageId || null)
    .filter(Boolean)
    .slice(0, 8);
  console.log(
    JSON.stringify({
      requestId: requestId || null,
      stage: "rekognition_search_snapshot",
      faceMatchesCount: matches.length || 0,
      firstMatchSimilarity: bestSimilarity,
      firstMatchFaceId: bestFaceId,
      firstMatchExternalImageId: bestExternalImageId,
      allMatchFaceIdsSample: matches.map((m) => m?.Face?.FaceId || null).filter(Boolean).slice(0, 3),
      allMatchExternalImageIdsSample,
    })
  );
  const exact = matches.find((m) => m?.Face?.FaceId === faceId) || null;
  const exactSimilarity = typeof exact?.Similarity === "number" ? exact.Similarity : null;
  const exactExternalImageId = exact?.Face?.ExternalImageId || null;
  const externalCandidates = expectedExternalImageId
    ? matches.filter((m) => m?.Face?.ExternalImageId === expectedExternalImageId)
    : [];
  const externalBest = externalCandidates[0] || null;
  const externalBestSimilarity =
    typeof externalBest?.Similarity === "number" ? externalBest.Similarity : null;
  const externalBestFaceId = externalBest?.Face?.FaceId || null;
  const matchedFaceId = exact?.Face?.FaceId || bestFaceId || null;
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
  const exactMatched =
    !!exact &&
    matchedFaceId === faceId &&
    typeof similarity === "number" &&
    similarity >= matchThreshold;
  const externalBindingMatched =
    !!expectedExternalImageId &&
    !!externalBest &&
    typeof externalBestSimilarity === "number" &&
    externalBestSimilarity >= matchThreshold;
  const foreignTopSkipped =
    !!expectedExternalImageId &&
    !!bestExternalImageId &&
    bestExternalImageId !== expectedExternalImageId &&
    !!externalBest;
  const matched = exactMatched || externalBindingMatched;
  const acceptedBy = exactMatched
    ? "exactFaceId"
    : externalBindingMatched
      ? "externalImageIdBinding"
      : null;
  console.log(
    JSON.stringify({
      requestId: requestId || null,
      stage: "rekognition_match_eval",
      expectedFaceId: faceId || null,
      expectedExternalImageId: expectedExternalImageId || null,
      matchedFaceId,
      similarity,
      topFaceId: bestFaceId,
      topSimilarity: bestSimilarity,
      topExternalImageId: bestExternalImageId,
      externalBestFaceId,
      externalBestSimilarity,
      foreignTopSkipped,
      threshold: matchThreshold,
      matched,
      acceptedBy,
    })
  );
  return {
    matched,
    similarity,
    matchedFaceId,
    topSimilarity: bestSimilarity,
    topFaceId: bestFaceId,
    topExternalImageId: bestExternalImageId,
    matchCount: matches.length,
    acceptedBy,
    foreignTopSkipped,
    allMatchExternalImageIdsSample,
    requestId,
    threshold: matchThreshold,
    reason: matched
      ? "MATCHED"
      : !!externalBest
        ? "FACE_MISMATCH_BELOW_THRESHOLD"
        : !exact
        ? "FACE_MATCH_NOT_FOUND"
        : typeof similarity === "number" && similarity < matchThreshold
          ? "FACE_MISMATCH_BELOW_THRESHOLD"
          : "FACE_MATCH_NOT_FOUND",
  };
}

async function listFacesByExternalImageId(externalImageId) {
  if (!collectionId || !externalImageId) return [];
  const found = [];
  let nextToken = undefined;
  do {
    const resp = await rekognition.send(
      new ListFacesCommand({
        CollectionId: collectionId,
        MaxResults: 4096,
        NextToken: nextToken,
      })
    );
    const faces = Array.isArray(resp.Faces) ? resp.Faces : [];
    for (const face of faces) {
      if (face?.ExternalImageId === externalImageId && face?.FaceId) {
        found.push(face.FaceId);
      }
    }
    nextToken = resp.NextToken;
  } while (nextToken);
  return found;
}

async function cleanupFacesForExternalImageId(
  externalImageId,
  keepFaceId = null,
  { requestId } = {}
) {
  if (!collectionId || !externalImageId) return { deleted: 0, kept: keepFaceId ? 1 : 0 };
  const faceIds = await listFacesByExternalImageId(externalImageId);
  const toDelete = faceIds.filter((id) => id && id !== keepFaceId);
  if (toDelete.length > 0) {
    await rekognition.send(
      new DeleteFacesCommand({
        CollectionId: collectionId,
        FaceIds: toDelete,
      })
    );
  }
  console.log(
    JSON.stringify({
      requestId: requestId || null,
      stage: "rekognition_cleanup_external_image_id",
      collectionId: collectionId || null,
      externalImageId,
      totalFaces: faceIds.length,
      deleted: toDelete.length,
      keptFaceId: keepFaceId || null,
    })
  );
  return { deleted: toDelete.length, kept: keepFaceId ? 1 : 0 };
}

async function cleanupFacesForExternalImageIds(
  externalImageIds = [],
  { requestId } = {}
) {
  const unique = Array.from(
    new Set(
      externalImageIds
        .map((value) => String(value || "").trim())
        .filter(Boolean)
    )
  );
  let deleted = 0;
  for (const externalImageId of unique) {
    const result = await cleanupFacesForExternalImageId(externalImageId, null, { requestId });
    deleted += Number(result?.deleted || 0);
  }
  console.log(
    JSON.stringify({
      requestId: requestId || null,
      stage: "rekognition_cleanup_external_image_ids",
      externalImageIdsCount: unique.length,
      deleted,
    })
  );
  return { deleted, externalImageIdsCount: unique.length };
}

module.exports = {
  rekognition,
  ensureRekognitionCollection,
  indexFaceFromBuffer,
  verifyFaceMatches,
  cleanupFacesForExternalImageId,
  cleanupFacesForExternalImageIds,
};
