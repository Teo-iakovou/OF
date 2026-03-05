const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");
const { sendErr } = require("../utils/sendErr");

function guardActiveInstanceAndFace(options = {}) {
  const { requireFaceEnrolled = false } = options;

  return async function guard(req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized", requestId: req.requestId || null });
      }

      const user = req._user || (await User.findById(req.user.id));
      if (!user || !user.activePackageInstanceId) {
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

      if (requireFaceEnrolled && (!instance.faceEnrolled || !instance.rekognitionFaceId)) {
        return res.status(409).json({
          errorCode: "FACE_ENROLLMENT_REQUIRED",
          message: "Face enrollment required.",
          requestId: req.requestId || null,
        });
      }

      req._user = user;
      req._activePackageInstance = instance;
      return next();
    } catch (err) {
      console.error("[guardActiveInstanceAndFace] failed:", err?.message || err);
      return sendErr(req, res, 500, "Failed to validate active instance");
    }
  };
}

module.exports = { guardActiveInstanceAndFace };
