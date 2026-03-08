const fs = require("fs/promises");
const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");
const { analyzeImageBufferWithGoogleVision } = require("../utils/analyzeImageWithGoogleVision");
const { verifyFaceMatches } = require("../utils/rekognition");
const { sendErr } = require("../utils/sendErr");

const loadImageBuffer = async (req) => {
  if (req.file?.buffer) return req.file.buffer;
  if (req.file?.path) {
    return fs.readFile(req.file.path);
  }
  const base64 = req.body?.imageBase64;
  if (typeof base64 === "string" && base64.trim()) {
    return Buffer.from(base64, "base64");
  }
  return null;
};

const verifyPersonaFace = async (req, res, next) => {
  const requestId = req.requestId || null;
  const startedAt = Date.now();
  const logStage = (stage, extra = {}) =>
    console.log(
      JSON.stringify({
        requestId,
        stage,
        duration_ms: Date.now() - startedAt,
        userId: req.user?.id || null,
        ...extra,
      })
    );
  if (!req.user || !req.user.id) {
    return sendErr(req, res, 401, "Unauthorized", {
      errorCode: "UNAUTHORIZED",
      message: "Unauthorized",
    });
  }

  try {
    logStage("sadtalker_face_gate_start");
    const user = req._user || await User.findById(req.user.id);
    if (!user || !user.activePackageInstanceId) {
      logStage("sadtalker_face_gate_blocked", { reason: "ACTIVE_INSTANCE_REQUIRED" });
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    const instance = req._activePackageInstance || await PackageInstance.findOne({
      _id: user.activePackageInstanceId,
      userId: user._id,
      status: "active",
    });
    if (!instance) {
      logStage("sadtalker_face_gate_blocked", { reason: "ACTIVE_INSTANCE_REQUIRED" });
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }
    if (!instance.faceEnrolled || !instance.rekognitionFaceId) {
      logStage("sadtalker_face_gate_blocked", {
        reason: "FACE_NOT_ENROLLED",
        packageInstanceId: instance?._id?.toString?.() || null,
      });
      return sendErr(req, res, 409, "Face enrollment required.", {
        errorCode: "FACE_NOT_ENROLLED",
        code: "FACE_NOT_ENROLLED",
        message: "Face enrollment required.",
      });
    }

    logStage("sadtalker_face_instance_ok", {
      packageInstanceId: instance?._id?.toString?.() || null,
    });

    const imageBuffer = await loadImageBuffer(req);
    if (!imageBuffer) {
      logStage("sadtalker_face_gate_blocked", {
        reason: "FACE_REQUIRED_FOR_ENROLLMENT",
        packageInstanceId: instance?._id?.toString?.() || null,
      });
      return sendErr(req, res, 409, "No face detected.", {
        errorCode: "FACE_REQUIRED_FOR_ENROLLMENT",
        code: "FACE_REQUIRED_FOR_ENROLLMENT",
      });
    }

    logStage("sadtalker_face_vision_start", {
      packageInstanceId: instance?._id?.toString?.() || null,
    });

    const visionData = await analyzeImageBufferWithGoogleVision(imageBuffer, { requestId });
    const faceCount =
      typeof visionData?.faceCount === "number"
        ? visionData.faceCount
        : Array.isArray(visionData?.faces)
          ? visionData.faces.length
          : visionData?.hasFace
            ? 1
            : 0;
    logStage("sadtalker_face_vision_done", {
      packageInstanceId: instance?._id?.toString?.() || null,
      faceCount,
    });
    if (!visionData?.hasFace || faceCount <= 0) {
      logStage("sadtalker_face_gate_blocked", {
        reason: "FACE_REQUIRED_FOR_ENROLLMENT",
        packageInstanceId: instance?._id?.toString?.() || null,
      });
      return sendErr(req, res, 409, "No face detected.", {
        errorCode: "FACE_REQUIRED_FOR_ENROLLMENT",
        code: "FACE_REQUIRED_FOR_ENROLLMENT",
      });
    }
    if (faceCount > 1) {
      logStage("sadtalker_face_gate_blocked", {
        reason: "MULTIPLE_FACES_NOT_ALLOWED",
        packageInstanceId: instance?._id?.toString?.() || null,
      });
      return sendErr(req, res, 409, "Multiple faces detected.", {
        errorCode: "MULTIPLE_FACES_NOT_ALLOWED",
        code: "MULTIPLE_FACES_NOT_ALLOWED",
      });
    }

    logStage("sadtalker_face_rekognition_start", {
      packageInstanceId: instance?._id?.toString?.() || null,
    });
    const enrolledFaceId = instance.rekognitionFaceId || null;
    const {
      matched,
      similarity,
      matchedFaceId,
      threshold,
      reason,
      topSimilarity,
      topFaceId,
      topExternalImageId,
      matchCount,
      acceptedBy,
      foreignTopSkipped,
      allMatchExternalImageIdsSample,
    } = await verifyFaceMatches(
      imageBuffer,
      enrolledFaceId,
      { requestId, expectedExternalImageId: instance._id?.toString?.() || null }
    );
    logStage("sadtalker_face_rekognition_done", {
      packageInstanceId: instance?._id?.toString?.() || null,
      matched: matched === true,
      matchedFaceId: matchedFaceId || null,
      similarity: typeof similarity === "number" ? similarity : null,
      threshold: typeof threshold === "number" ? threshold : null,
      topFaceId: topFaceId || null,
      topSimilarity: typeof topSimilarity === "number" ? topSimilarity : null,
      topExternalImageId: topExternalImageId || null,
      expectedExternalImageId: instance?._id?.toString?.() || null,
      matchCount: typeof matchCount === "number" ? matchCount : null,
      acceptedBy: acceptedBy || null,
      foreignTopSkipped: !!foreignTopSkipped,
      allMatchExternalImageIdsSample: allMatchExternalImageIdsSample || [],
      collection: process.env.REKOGNITION_COLLECTION_ID || null,
    });
    if (matched !== true) {
      const code =
        reason === "NO_FACE_FOUND"
          ? "NO_FACE_FOUND"
          : reason === "FACE_MISMATCH_BELOW_THRESHOLD"
            ? "FACE_MISMATCH_BELOW_THRESHOLD"
            : "FACE_MATCH_NOT_FOUND";
      logStage("sadtalker_face_gate_blocked", {
        reason: code,
        packageInstanceId: instance?._id?.toString?.() || null,
      });
      return sendErr(
        req,
        res,
        409,
        code === "NO_FACE_FOUND"
          ? "No face found in image."
          : code === "FACE_MISMATCH_BELOW_THRESHOLD"
            ? "Face mismatch (below threshold)."
            : "No matching enrolled face found.",
        {
        errorCode: code,
        code,
        ...(process.env.NODE_ENV !== "production"
          ? {
              debug: {
                expectedFaceId: enrolledFaceId,
                matchedFaceId: matchedFaceId || null,
                similarity: typeof similarity === "number" ? similarity : null,
                topFaceId: topFaceId || null,
                topSimilarity: typeof topSimilarity === "number" ? topSimilarity : null,
                topExternalImageId: topExternalImageId || null,
                expectedExternalImageId: instance?._id?.toString?.() || null,
                acceptedBy: acceptedBy || null,
                matchCount: typeof matchCount === "number" ? matchCount : null,
                foreignTopSkipped: !!foreignTopSkipped,
                allMatchExternalImageIdsSample: allMatchExternalImageIdsSample || [],
                threshold: typeof threshold === "number" ? threshold : null,
                reason: reason || null,
              },
            }
          : {}),
      }
      );
    }

    logStage("sadtalker_face_verified", {
      packageInstanceId: instance?._id?.toString?.() || null,
    });
    req.faceConfidence = typeof similarity === "number" ? similarity : null;
    return next();
  } catch (err) {
    console.error("[persona] verify-face failed:", err?.message || err);
    logStage("sadtalker_face_gate_error", {
      errName: err?.name || null,
      errMessage: err?.message || null,
    });
    return sendErr(req, res, 500, "Face verification failed.", {
      errorCode: "INTERNAL_ERROR",
      message: "Face verification failed.",
    });
  }
};

module.exports = { verifyPersonaFace };
