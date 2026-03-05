#!/usr/bin/env node
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local"), override: true });

const fs = require("fs/promises");

const {
  RekognitionClient,
  ListFacesCommand,
  SearchFacesByImageCommand,
} = require("@aws-sdk/client-rekognition");

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


function parseArgs(argv) {
  const out = {};
  for (const raw of argv.slice(2)) {
    if (!raw.startsWith("--")) continue;
    const [k, ...rest] = raw.slice(2).split("=");
    out[k] = rest.join("=");
  }
  return out;
}

async function listFacesAll(collectionId) {
  const all = [];
  let nextToken;

  do {
    const resp = await rekognition.send(
      new ListFacesCommand({
        CollectionId: collectionId,
        MaxResults: 4096,
        ...(nextToken ? { NextToken: nextToken } : {}),
      })
    );

    const faces = Array.isArray(resp.Faces) ? resp.Faces : [];
    all.push(...faces);
    nextToken = resp.NextToken;
  } while (nextToken);

  return all;
}

function usageAndExit(msg) {
  if (msg) console.error(msg);
  console.error(
    "Usage: node backend/scripts/rekognition-check-face.js --faceId=<FACE_ID> [--collectionId=<COLLECTION_ID>] [--file=<PATH_TO_IMAGE>]"
  );
  process.exit(1);
}

async function main() {
  const args = parseArgs(process.argv);
  const faceId = args.faceId;
  const collectionId = args.collectionId || process.env.REKOGNITION_COLLECTION_ID;
  const fileArg = args.file;
  const threshold = Number(process.env.REKOGNITION_MATCH_THRESHOLD || 90);

  if (!faceId) usageAndExit("Missing required --faceId");
  if (!collectionId) usageAndExit("Missing collectionId (provide --collectionId or set REKOGNITION_COLLECTION_ID)");

  const faces = await listFacesAll(collectionId);
  const faceIdFound = faces.some((f) => f?.FaceId === faceId);

  console.log("[rekognition-check] list-faces", {
    collectionId,
    facesCount: faces.length,
    faceIdFound,
  });

  if (fileArg) {
    const absolutePath = path.resolve(process.cwd(), fileArg);
    const bytes = await fs.readFile(absolutePath);

    const resp = await rekognition.send(
      new SearchFacesByImageCommand({
        CollectionId: collectionId,
        Image: { Bytes: bytes },
        MaxFaces: 5,
        FaceMatchThreshold: threshold,
      })
    );

    console.log("[rekognition-check] search-faces-by-image", {
      collectionId,
      file: absolutePath,
      threshold,
      searchedFace: {
        confidence:
          typeof resp?.SearchedFaceConfidence === "number"
            ? resp.SearchedFaceConfidence
            : null,
        boundingBox: resp?.SearchedFaceBoundingBox || null,
      },
      faceMatchesLength: Array.isArray(resp?.FaceMatches)
        ? resp.FaceMatches.length
        : 0,
    });

    const matches = Array.isArray(resp?.FaceMatches) ? resp.FaceMatches : [];
    for (const match of matches) {
      console.log("[rekognition-check] match", {
        faceId: match?.Face?.FaceId || null,
        similarity:
          typeof match?.Similarity === "number" ? match.Similarity : null,
      });
    }
  }
}

main().catch((err) => {
  console.error("[rekognition-check] error", {
    message: err?.message || String(err),
    name: err?.name || null,
  });
  process.exit(1);
});
