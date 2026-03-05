const cookie = require("cookie");
const { verifyToken, SESSION_COOKIE_NAME } = require("../utils/jwt");
const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");

const getUserIdFromCookie = (req) => {
  const header = req.headers["cookie"] || "";
  const cookies = header ? cookie.parse(header) : {};
  const token = cookies[SESSION_COOKIE_NAME];
  if (!token) return null;
  const v = verifyToken(token);
  if (!v.ok || !v.payload?.sub) return null;
  return String(v.payload.sub);
};

const debugWhoami = async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ error: "Not Found" });
  }

  const requestId = req.requestId || null;
  const header = req.headers["cookie"] || "";
  const cookies = header ? cookie.parse(header) : {};
  const cookieNames = Object.keys(cookies);
  const hasCookie = cookieNames.length > 0;
  const userIdFromCookie = getUserIdFromCookie(req);

  let userDoc = req._user || null;
  if (!userDoc && userIdFromCookie) {
    try {
      userDoc = await User.findById(userIdFromCookie);
    } catch {}
  }

  const resolvedEmail = userDoc?.email || req.user?.email || null;
  const activePackageInstanceId =
    userDoc?.activePackageInstanceId?.toString?.() || null;

  let activeInstanceSummary = null;
  if (activePackageInstanceId) {
    try {
      const instance = await PackageInstance.findById(activePackageInstanceId);
      if (instance) {
        activeInstanceSummary = {
          planKey: instance.planKey,
          status: instance.status,
          personaKey: instance.personaKey || null,
        };
      }
    } catch {}
  }

  const payload = {
    requestId,
    hasCookie,
    cookieNames,
    userId: userIdFromCookie,
    userEmail: resolvedEmail,
    activePackageInstanceId,
    activeInstance: activeInstanceSummary,
  };

  try {
    console.log("[debug-whoami]", payload);
  } catch {}

  return res.json(payload);
};

const repairFaceId = async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ error: "Not Found" });
  }

  const requestId = req.requestId || null;
  const adminSecret = process.env.ADMIN_SECRET || "";
  const headerSecret = req.headers["admin_secret"] || req.headers["x-admin-secret"] || "";
  if (!adminSecret || headerSecret !== adminSecret) {
    return res.status(403).json({ error: "Forbidden", requestId });
  }

  const packageInstanceId = req.body?.packageInstanceId;
  const newFaceId = req.body?.newFaceId;
  if (!packageInstanceId || !newFaceId) {
    return res.status(400).json({ error: "packageInstanceId and newFaceId are required", requestId });
  }

  const instance = await PackageInstance.findById(packageInstanceId);
  if (!instance) {
    return res.status(404).json({ error: "Package instance not found", requestId });
  }

  instance.rekognitionFaceId = newFaceId;
  await instance.save();

  return res.json({
    ok: true,
    requestId,
    packageInstanceId: instance._id.toString(),
    rekognitionFaceId: instance.rekognitionFaceId,
  });
};

module.exports = { debugWhoami, repairFaceId };
