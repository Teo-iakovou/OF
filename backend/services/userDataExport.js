const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");
const Conversation = require("../models/conversation");
const Result = require("../models/result");
const ApiUsage = require("../models/apiUsage");
const HeygenVideo = require("../models/heygenVideo");
const OutputFeedback = require("../models/outputFeedback");
const ConsentLog = require("../models/consentLog");
const ModerationLog = require("../models/moderationLog");
const PromoCode = require("../models/promoCode");
const RenderJob = require("../models/renderJob");
const { listAllObjects } = require("../utils/r2Cleanup");
const { s3, bucket } = require("../utils/s3");
const { PRIVACY_EMAIL } = require("../config/contact");

const REDACTED_USER_FIELDS = new Set(["passwordHash", "isAdmin", "__v", "deletedAt"]);

function redact(doc) {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  for (const key of REDACTED_USER_FIELDS) delete obj[key];
  return obj;
}

async function exportUserData(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  const userEmail = user.email;

  const profile = redact(user);

  const packageInstances = (await PackageInstance.find({ userId })).map(redact);

  // Conversation uses `user` field (not `userId`)
  const conversations = (await Conversation.find({ user: userId })).map(redact);

  const results = (await Result.find({ userId })).map(redact);

  const heygenVideos = (await HeygenVideo.find({ userId })).map(redact);

  // RenderJob uses userEmail as the reference
  const renderJobs = (await RenderJob.find({ userEmail })).map(redact);

  const outputFeedback = (await OutputFeedback.find({ userId })).map(redact);

  const apiUsage = (await ApiUsage.find({ userId })).map(redact);

  const consents = (await ConsentLog.find({ userId })).map(redact);

  // Moderation events — strip internal category scores
  const moderationEvents = (await ModerationLog.find({ userId })).map((d) => {
    const r = redact(d);
    delete r.categoryScores;
    return r;
  });

  // Promo codes the user redeemed — include only the user-facing fields
  const redeemedPromoCodes = (await PromoCode.find({ usedBy: userId })).map((doc) => {
    const obj = doc.toObject();
    return {
      code: obj.code,
      planKey: obj.planKey,
      createdAt: obj.createdAt,
    };
  });

  let r2Manifest = [];
  try {
    if (bucket) {
      const keys = await listAllObjects(s3, bucket, `uploads/${String(userId)}/`);
      r2Manifest = keys.map((key) => ({ key }));
    } else {
      r2Manifest = [{ note: "R2_NOT_CONFIGURED" }];
    }
  } catch (err) {
    r2Manifest = [{ error: "R2_LIST_FAILED", message: err.message }];
  }

  return {
    exportFormat: "echofy-data-export-v1",
    exportedAt: new Date().toISOString(),
    exportFor: { userId: String(userId), email: userEmail },
    profile,
    packageInstances,
    conversations,
    results,
    heygenVideos,
    renderJobs,
    outputFeedback,
    apiUsage,
    consents,
    moderationEvents,
    redeemedPromoCodes,
    r2Manifest,
    notes: {
      r2: `Storage objects listed by key only. To request the actual file contents, contact ${PRIVACY_EMAIL}.`,
      stripe: `Payment history is maintained by Stripe directly. To request your Stripe records, contact ${PRIVACY_EMAIL}.`,
      retentionPolicy: "Some logs (moderation, promo redemption) are retained for legitimate interests per GDPR Art. 6(1)(f) and Art. 17(3)(e).",
    },
  };
}

module.exports = { exportUserData };
