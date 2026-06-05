const Stripe = require("stripe");
const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");
const Conversation = require("../models/conversation");
const Result = require("../models/result");
const ApiUsage = require("../models/apiUsage");
const ModerationLog = require("../models/moderationLog");
const PromoCode = require("../models/promoCode");
const HeygenVideo = require("../models/heygenVideo");
const RenderJob = require("../models/renderJob");
const OutputFeedback = require("../models/outputFeedback");
const DeletionLog = require("../models/deletionLog");
const { deleteAllObjectsForUser } = require("../utils/r2Cleanup");
const { cleanupFacesForExternalImageId } = require("../utils/rekognition");
const { s3, bucket } = require("../utils/s3");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function runStep(log, stepName, fn) {
  const start = Date.now();
  try {
    const detail = await fn();
    log.steps.push({
      step: stepName,
      status: "ok",
      detail: typeof detail === "string" ? detail.slice(0, 500) : String(detail ?? "").slice(0, 500),
      duration_ms: Date.now() - start,
    });
    return { ok: true };
  } catch (err) {
    log.steps.push({
      step: stepName,
      status: "failed",
      detail: (err?.message ?? "unknown").slice(0, 500),
      duration_ms: Date.now() - start,
    });
    return { ok: false };
  }
}

async function deleteUserAccount(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.deletedAt) throw new Error("Account deletion already in progress");

  // Phase 1: soft-delete (point of no return — auth middleware rejects from here on)
  user.deletedAt = new Date();
  await user.save();

  const userEmail = user.email;
  const stripeCustomerId = user.stripeCustomerId || null;

  const log = await DeletionLog.create({
    userId: user._id,
    email: userEmail,
    requestedAt: new Date(),
    steps: [],
  });

  let allOk = true;

  // Phase 2: external resource cleanup per PackageInstance
  const instances = await PackageInstance.find({ userId: user._id });

  for (const inst of instances) {
    // HeyGen talking_photo delete
    if (inst.heygenTalkingPhotoId) {
      const r = await runStep(log, `heygen:${inst._id}`, async () => {
        const res = await fetch(
          `https://api.heygen.com/v2/talking_photo/${inst.heygenTalkingPhotoId}`,
          {
            method: "DELETE",
            headers: { "X-Api-Key": process.env.HEYGEN_API_KEY },
          }
        );
        if (res.status === 404) return "already_deleted";
        if (!res.ok) throw new Error(`HeyGen ${res.status}: ${(await res.text()).slice(0, 200)}`);
        return "deleted";
      });
      if (!r.ok) allOk = false;
    }

    // Rekognition face vector cleanup
    if (inst.rekognitionFaceId || inst.faceEnrolled) {
      const r = await runStep(log, `rekognition:${inst._id}`, async () => {
        const result = await cleanupFacesForExternalImageId(String(inst._id));
        return `deleted ${result.deleted}`;
      });
      if (!r.ok) allOk = false;
    }
  }

  // R2 object sweep — single prefix covers all instances
  {
    const r = await runStep(log, "r2_objects", async () => {
      if (!bucket) throw new Error("S3_BUCKET not configured");
      const { deletedCount } = await deleteAllObjectsForUser(s3, bucket, String(userId));
      return `deleted ${deletedCount} objects`;
    });
    if (!r.ok) allOk = false;
  }

  // Stripe customer redaction (NOT delete — preserves payment history per GDPR Art. 17(3)(e))
  if (stripeCustomerId) {
    const r = await runStep(log, "stripe_customer", async () => {
      const subs = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: "active",
        limit: 100,
      });
      for (const sub of subs.data) {
        await stripe.subscriptions.cancel(sub.id);
      }
      const pms = await stripe.paymentMethods.list({ customer: stripeCustomerId, limit: 100 });
      for (const pm of pms.data) {
        await stripe.paymentMethods.detach(pm.id);
      }
      await stripe.customers.update(stripeCustomerId, {
        email: "deleted@deleted.invalid",
        name: "Deleted User",
        metadata: { echofy_deleted: "true", echofy_deletedAt: new Date().toISOString() },
      });
      return "redacted";
    });
    if (!r.ok) allOk = false;
  }

  // MongoDB cascade
  await runStep(log, "package_instances", async () => {
    const { deletedCount } = await PackageInstance.deleteMany({ userId: user._id });
    return `deleted ${deletedCount}`;
  });

  await runStep(log, "conversations", async () => {
    const { deletedCount } = await Conversation.deleteMany({ userId: user._id });
    return `deleted ${deletedCount}`;
  });

  await runStep(log, "results", async () => {
    const { deletedCount } = await Result.deleteMany({ userId: user._id });
    return `deleted ${deletedCount}`;
  });

  await runStep(log, "api_usage", async () => {
    const { deletedCount } = await ApiUsage.deleteMany({ userId: user._id });
    return `deleted ${deletedCount}`;
  });

  await runStep(log, "heygen_videos", async () => {
    const { deletedCount } = await HeygenVideo.deleteMany({ userId: user._id });
    return `deleted ${deletedCount}`;
  });

  await runStep(log, "output_feedback", async () => {
    const { deletedCount } = await OutputFeedback.deleteMany({ userId: user._id });
    return `deleted ${deletedCount}`;
  });

  // RenderJob stores userEmail, not userId
  if (userEmail) {
    await runStep(log, "render_jobs", async () => {
      const { deletedCount } = await RenderJob.deleteMany({ userEmail });
      return `deleted ${deletedCount}`;
    });
  }

  // Anonymize — retain for safety/fraud audit (GDPR Art. 17(3)(e))
  await runStep(log, "moderation_log_anonymize", async () => {
    const res = await ModerationLog.updateMany(
      { userId: user._id },
      { $set: { userId: null, email: null } }
    );
    return `anonymized ${res.modifiedCount}`;
  });

  // PromoCode uses usedBy array — pull user from each code they redeemed
  await runStep(log, "promo_code_anonymize", async () => {
    const res = await PromoCode.updateMany(
      { usedBy: user._id },
      { $pull: { usedBy: user._id } }
    );
    return `updated ${res.modifiedCount}`;
  });

  // Phase 3: hard-delete User only if all steps succeeded
  if (allOk) {
    await runStep(log, "user_hard_delete", async () => {
      await User.deleteOne({ _id: user._id });
      return "deleted";
    });
    log.hardDeleted = true;
  } else {
    log.steps.push({
      step: "user_hard_delete",
      status: "skipped",
      detail: "deferred: prior steps failed; ops manual review required",
      duration_ms: 0,
    });
  }

  log.completedAt = new Date();
  log.completedCleanup = allOk;
  await log.save();

  // Phase 4: email confirmation — no email infrastructure in this project.
  // TODO(backlog): send deletion confirmation email once transactional email service is added.

  return { ok: allOk, logId: log._id };
}

module.exports = { deleteUserAccount };
