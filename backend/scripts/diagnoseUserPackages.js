// backend/scripts/diagnoseUserPackages.js
// READ-ONLY diagnostic: show full quota state for a user by email or userId.
//
// Usage:
//   MONGO_URI=... node backend/scripts/diagnoseUserPackages.js --email user@example.com
//   MONGO_URI=... node backend/scripts/diagnoseUserPackages.js --userId 64abc123...
//
// Output: JSON lines to stdout, human-readable summary to stderr.
// No writes are performed.

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../models/user");
const PackageInstance = require("../models/packageInstance");

// ── CLI args ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const emailIdx = args.indexOf("--email");
const userIdIdx = args.indexOf("--userId");
const targetEmail = emailIdx >= 0 ? args[emailIdx + 1] : null;
const targetUserId = userIdIdx >= 0 ? args[userIdIdx + 1] : null;

if (!targetEmail && !targetUserId) {
  console.error("Usage: node diagnoseUserPackages.js --email <email>  OR  --userId <id>");
  process.exit(1);
}

// ── Plan-limit helpers (mirrors backend logic — DO NOT call production modules
//    to avoid side-effects; hardcode the same constants here for read-only use) ──
const PLAN_TOKEN_LIMITS = { lite: 10000, pro: 100000, ultimate: 500000 };
const PLAN_UPLOAD_LIMITS = { lite: 5, pro: 20, ultimate: 100 };
const SADTALKER_PLAN_LIMITS = {
  lite: Number(process.env.SADTALKER_LITE_LIMIT || 10),
  pro: Number(process.env.SADTALKER_PRO_LIMIT || 50),
  ultimate: 0,
};

function expectedTokenLimit(planKey) {
  return PLAN_TOKEN_LIMITS[planKey] ?? null;
}
function expectedUploadLimit(planKey) {
  return PLAN_UPLOAD_LIMITS[planKey] ?? null;
}
function expectedVideoLimit(planKey) {
  return SADTALKER_PLAN_LIMITS[planKey] ?? null;
}

function resolveEffectiveTokenLimit(instance) {
  const planDefault = expectedTokenLimit(instance.planKey || "lite") ?? 10000;
  const stored = typeof instance.tokensLimit === "number" ? instance.tokensLimit : null;
  if (stored !== null && stored > 0) return stored;
  const legacy = typeof instance.chatMonthlyLimit === "number" ? instance.chatMonthlyLimit : null;
  if (legacy !== null && legacy > 0) return legacy;
  return planDefault;
}

function resolveEffectiveUploadLimit(instance) {
  const base = typeof instance.uploadLimit === "number" ? instance.uploadLimit : 0;
  const addons = (instance.addons && typeof instance.addons.uploads === "number")
    ? instance.addons.uploads : 0;
  return base === 0 ? 0 : base + addons;
}

function resolveEffectiveVideoLimit(instance) {
  const planDefault = expectedVideoLimit(instance.planKey) ?? 0;
  const stored = typeof instance.sadtalkerVideoLimit === "number" ? instance.sadtalkerVideoLimit : null;
  const base = (stored !== null && stored > 0) ? stored : planDefault;
  const addons = (instance.addons && typeof instance.addons.sadtalkerVideos === "number")
    ? instance.addons.sadtalkerVideos : 0;
  return base === 0 ? 0 : base + addons;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI or MONGODB_URI env var required.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.error("[diagnose] Connected to MongoDB:", mongoose.connection.name);

  // 1. Find the user
  let user;
  if (targetEmail) {
    user = await User.findOne({ email: targetEmail.toLowerCase().trim() }).lean();
  } else {
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      console.error("Invalid userId:", targetUserId);
      process.exit(1);
    }
    user = await User.findById(targetUserId).lean();
  }

  if (!user) {
    console.error("[diagnose] User not found.");
    process.exit(1);
  }

  // 2. Fetch ALL instances for this user (all statuses, newest first)
  const allInstances = await PackageInstance.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .lean();

  const activeInstances = allInstances.filter((i) => i.status === "active");
  const pointedInstanceId = user.activePackageInstanceId
    ? user.activePackageInstanceId.toString()
    : null;
  const pointedInstance = allInstances.find(
    (i) => i._id.toString() === pointedInstanceId
  ) || null;

  // 3. Detect problems
  const problems = [];

  if (!pointedInstanceId) {
    problems.push("POINTER_NULL: user.activePackageInstanceId is null — no active package.");
  } else if (!pointedInstance) {
    problems.push(
      `POINTER_ORPHANED: user.activePackageInstanceId (${pointedInstanceId}) does not match any PackageInstance.`
    );
  } else if (pointedInstance.status !== "active") {
    problems.push(
      `POINTER_INACTIVE: pointed instance has status="${pointedInstance.status}" — not "active".`
    );
  }

  if (pointedInstance && activeInstances.length > 1) {
    const otherActive = activeInstances.filter(
      (i) => i._id.toString() !== pointedInstanceId
    );
    for (const other of otherActive) {
      problems.push(
        `MULTI_ACTIVE_INSTANCE: instance ${other._id} (plan=${other.planKey}) is also "active" but not selected. ` +
        `If this is a higher tier than the pointed instance (${pointedInstance.planKey}), the user may be under-served.`
      );
    }
  }

  if (pointedInstance) {
    const expectedTokens = expectedTokenLimit(pointedInstance.planKey);
    const effectiveTokens = resolveEffectiveTokenLimit(pointedInstance);
    if (expectedTokens !== null && effectiveTokens !== expectedTokens) {
      problems.push(
        `WRONG_TOKEN_LIMIT: instance ${pointedInstance._id} (plan=${pointedInstance.planKey}) ` +
        `has effectiveTokenLimit=${effectiveTokens}, expected=${expectedTokens}. ` +
        `Stored tokensLimit=${pointedInstance.tokensLimit}, chatMonthlyLimit=${pointedInstance.chatMonthlyLimit}.`
      );
    }

    const expectedUploads = expectedUploadLimit(pointedInstance.planKey);
    const storedUploads = typeof pointedInstance.uploadLimit === "number" ? pointedInstance.uploadLimit : null;
    if (expectedUploads !== null && storedUploads !== null && storedUploads !== 0 && storedUploads !== expectedUploads) {
      problems.push(
        `WRONG_UPLOAD_LIMIT: instance ${pointedInstance._id} (plan=${pointedInstance.planKey}) ` +
        `has uploadLimit=${storedUploads}, expected=${expectedUploads}.`
      );
    }
  }

  // 4. Build report
  const instanceSummaries = allInstances.map((inst) => {
    const isPointed = inst._id.toString() === pointedInstanceId;
    const effectiveTokens = resolveEffectiveTokenLimit(inst);
    const effectiveUploads = resolveEffectiveUploadLimit(inst);
    const effectiveVideos = resolveEffectiveVideoLimit(inst);
    const expectedTokens = expectedTokenLimit(inst.planKey);
    const tokenLimitOk = expectedTokens === null || effectiveTokens === expectedTokens;
    return {
      id: inst._id.toString(),
      planKey: inst.planKey,
      status: inst.status,
      isActivePointer: isPointed,
      createdAt: inst.createdAt,
      stripeCheckoutSessionId: inst.stripeCheckoutSessionId || null,
      quotas: {
        uploads: {
          storedBase: inst.uploadLimit,
          addons: inst.addons?.uploads ?? 0,
          effective: effectiveUploads,
          used: inst.uploadsUsed ?? 0,
          remaining: effectiveUploads === 0 ? "unlimited" : Math.max(0, effectiveUploads - (inst.uploadsUsed || 0)),
        },
        tokens: {
          storedTokensLimit: inst.tokensLimit,
          storedChatMonthlyLimit: inst.chatMonthlyLimit,
          addons: inst.addons?.chat ?? 0,
          effective: effectiveTokens,
          expectedForPlan: expectedTokens,
          limitOk: tokenLimitOk,
          used: inst.tokensUsed ?? inst.chatUsedThisCycle ?? 0,
          cycleEndsAt: inst.chatCycleEndsAt || null,
        },
        videos: {
          storedBase: inst.sadtalkerVideoLimit,
          addons: inst.addons?.sadtalkerVideos ?? 0,
          effective: effectiveVideos,
          used: inst.sadtalkerVideosUsed ?? 0,
          remaining: effectiveVideos === 0 ? "unlimited" : Math.max(0, effectiveVideos - (inst.sadtalkerVideosUsed || 0)),
        },
      },
      faceEnrolled: inst.faceEnrolled ?? false,
      personaKey: inst.personaKey ?? null,
    };
  });

  const report = {
    user: {
      id: user._id.toString(),
      email: user.email,
      purchasedPackage: user.purchasedPackage || null,
      activePackageInstanceId: pointedInstanceId,
    },
    summary: {
      totalInstances: allInstances.length,
      activeInstances: activeInstances.length,
      pointedPlan: pointedInstance ? pointedInstance.planKey : null,
      pointedStatus: pointedInstance ? pointedInstance.status : null,
      problemCount: problems.length,
      problems,
    },
    instances: instanceSummaries,
  };

  // 5. Output
  // Machine-readable JSON to stdout
  console.log(JSON.stringify(report, null, 2));

  // Human-readable summary to stderr
  console.error("\n=== DIAGNOSIS SUMMARY ===");
  console.error(`User:     ${user.email} (${user._id})`);
  console.error(`Pointer:  ${pointedInstanceId || "null"}`);
  console.error(`Pointed plan: ${report.summary.pointedPlan || "none"}`);
  console.error(`All instances (${allInstances.length} total, ${activeInstances.length} active):`);
  for (const inst of instanceSummaries) {
    const marker = inst.isActivePointer ? " <-- ACTIVE POINTER" : "";
    console.error(
      `  [${inst.status}] ${inst.planKey} (${inst.id}) created=${new Date(inst.createdAt).toISOString()}${marker}`
    );
    console.error(
      `         uploads: ${inst.quotas.uploads.effective === 0 ? "unlimited" : inst.quotas.uploads.effective} limit, ${inst.quotas.uploads.used} used, ${inst.quotas.uploads.remaining} remaining`
    );
    const tokenOk = inst.quotas.tokens.limitOk ? "OK" : `WRONG (expected ${inst.quotas.tokens.expectedForPlan})`;
    console.error(
      `         tokens:  ${inst.quotas.tokens.effective} limit [${tokenOk}], ${inst.quotas.tokens.used} used`
    );
    console.error(
      `         videos:  ${inst.quotas.videos.effective === 0 ? "unlimited" : inst.quotas.videos.effective} limit, ${inst.quotas.videos.used} used, ${inst.quotas.videos.remaining} remaining`
    );
  }

  if (problems.length === 0) {
    console.error("\n[OK] No problems detected.");
  } else {
    console.error(`\n[PROBLEMS FOUND] ${problems.length} issue(s):`);
    for (const p of problems) {
      console.error("  !", p);
    }
  }
  console.error("=========================\n");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[diagnose] Fatal error:", err?.message || err);
  process.exit(1);
});
