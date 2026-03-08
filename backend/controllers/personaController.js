const User = require("../models/user");
const mongoose = require("mongoose");
const PackageInstance = require("../models/packageInstance");
const faceEngine = require("../utils/faceEngine");
const {
  cleanupFacesForExternalImageId,
  cleanupFacesForExternalImageIds,
} = require("../utils/rekognition");
const { sendErr } = require("../utils/sendErr");

const enrollFace = async (req, res) => {
  const requestId = req.requestId || null;
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized", requestId });
  }

  try {
    const requestedPackageInstanceId =
      typeof req.body?.packageInstanceId === "string" ? req.body.packageInstanceId : null;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found", requestId });
    if (!user.activePackageInstanceId && !requestedPackageInstanceId) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }
    const selectedInstanceId =
      requestedPackageInstanceId && mongoose.Types.ObjectId.isValid(requestedPackageInstanceId)
        ? requestedPackageInstanceId
        : user.activePackageInstanceId;
    const instance = await PackageInstance.findOne({ _id: selectedInstanceId, userId: user._id, status: "active" });
    if (!instance) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }
    const image = req.file;
    if (!image || !image.buffer) {
      return res.status(400).json({ error: "FACE_REQUIRED_FOR_ENROLLMENT", requestId });
    }

    const externalImageId = instance._id?.toString?.() || null;
    let result;
    try {
      result = await faceEngine.enroll({
        imageBuffer: image.buffer,
        externalImageId,
      });
    } catch (err) {
      const code = err?.code;
      if (code === "FACE_REQUIRED_FOR_ENROLLMENT" || code === "MULTIPLE_FACES_NOT_ALLOWED") {
        return res.status(400).json({ error: code, requestId });
      }
      throw err;
    }

    instance.rekognitionFaceId = result.faceId;
    instance.faceEnrolled = true;
    instance.faceEnrolledAt = new Date();
    await instance.save();

    const lineageFilter = {
      userId: user._id,
      _id: { $ne: instance._id },
      ...(instance.personaKey
        ? { personaKey: instance.personaKey }
        : {
            $or: [{ personaKey: null }, { personaKey: { $exists: false } }],
            planKey: instance.planKey,
          }),
    };
    const lineageInstances = await PackageInstance.find(lineageFilter)
      .select({ _id: 1, rekognitionFaceId: 1, faceEnrolled: 1 })
      .lean();
    const staleExternalImageIds = lineageInstances
      .map((row) => row?._id?.toString?.() || null)
      .filter(Boolean);

    try {
      // Keep exactly one active Rekognition face per package instance binding.
      await cleanupFacesForExternalImageId(externalImageId, result.faceId, { requestId });
      if (staleExternalImageIds.length > 0) {
        // Remove old lineage records that can win search results for this user/persona.
        await cleanupFacesForExternalImageIds(staleExternalImageIds, { requestId });
        await PackageInstance.updateMany(
          { _id: { $in: lineageInstances.map((row) => row._id) } },
          {
            $set: {
              faceEnrolled: false,
              rekognitionFaceId: null,
              faceEnrolledAt: null,
            },
          }
        );
      }
    } catch (cleanupErr) {
      console.warn(
        "[persona] enroll-face cleanup failed:",
        cleanupErr?.message || cleanupErr
      );
    }
    console.log(
      JSON.stringify({
        requestId,
        stage: "enroll_face_success",
        requestedPackageInstanceId: requestedPackageInstanceId || null,
        activePackageInstanceId: user?.activePackageInstanceId?.toString?.() || null,
        packageInstanceId: instance?._id?.toString?.() || null,
        personaKey: instance?.personaKey || null,
        staleLineageInstanceCount: staleExternalImageIds.length,
        faceEnrolled: !!instance?.faceEnrolled,
        rekognitionFaceId: instance?.rekognitionFaceId || null,
        collection: process.env.REKOGNITION_COLLECTION_ID || null,
      })
    );

    return res.json({ ok: true, faceId: result.faceId, requestId });
  } catch (err) {
    console.error("[persona] enroll-face failed:", err?.message || err);
    return res.status(500).json({ error: "ENROLL_FACE_FAILED", requestId });
  }
};

module.exports = { enrollFace };
