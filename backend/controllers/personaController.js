const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");
const faceEngine = require("../utils/faceEngine");
const { sendErr } = require("../utils/sendErr");

const enrollFace = async (req, res) => {
  const requestId = req.requestId || null;
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized", requestId });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found", requestId });
    if (!user.activePackageInstanceId) {
      return sendErr(req, res, 409, "No active package instance.", {
        errorCode: "ACTIVE_INSTANCE_REQUIRED",
        message: "No active package instance.",
      });
    }

    const instance = await PackageInstance.findOne({
      _id: user.activePackageInstanceId,
      userId: user._id,
      status: "active",
    });
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

    let result;
    try {
      result = await faceEngine.enroll({
        imageBuffer: image.buffer,
        externalImageId: instance._id?.toString?.() || null,
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

    return res.json({ ok: true, faceId: result.faceId, requestId });
  } catch (err) {
    console.error("[persona] enroll-face failed:", err?.message || err);
    return res.status(500).json({ error: "ENROLL_FACE_FAILED", requestId });
  }
};

module.exports = { enrollFace };
