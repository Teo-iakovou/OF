# Quota Carry-Over Audit
**Symptom**: User who purchased Pro still sees Lite quota limits.
**Scope**: Read-only investigation — no source modifications.
**Date**: 2026-05-18

---

## 1. Architecture Overview

### How quota is resolved (every request)

```
Request arrives
  └─ requireAuth middleware → sets req.user (from JWT)
  └─ guardActiveInstanceAndFace / checkChatQuota / analyzeController / consumeSadtalkerCredit
       └─ User.findById(req.user.id) → user.activePackageInstanceId  ← SINGLE POINTER
       └─ PackageInstance.findOne({ _id: activePackageInstanceId, userId, status: "active" })
            └─ quota fields on that ONE instance drive all enforcement
```

**Key invariant**: quota is enforced against the single instance that `user.activePackageInstanceId` points to. If that pointer is wrong or stale, the wrong quota is enforced — regardless of what other instances exist in the DB.

### How a purchase creates an instance

```
Stripe Checkout paid
  └─ webhook: checkout.session.completed
       └─ WebhookEvent upsert (idempotency guard on event.id)
       └─ PackageInstance.create({ planKey, status:"active", uploadLimit, tokensLimit, ... })
       └─ user.activePackageInstanceId = newInstance._id
       └─ user.save()
  OR fallback: GET /api/checkout/verify-session (called by frontend on success redirect)
       └─ Finds existing instance by stripeCheckoutSessionId → "already applied" path
       └─ OR creates new instance if not found → user.activePackageInstanceId = newInstance._id
```

### Per-plan limits written at creation time

| Field | Lite | Pro | Ultimate | Source |
|---|---|---|---|---|
| `uploadLimit` | 5 | 20 | 100 | `UPLOAD_LIMITS` constant in `checkoutController.js:24` |
| `tokensLimit` | 10 000 | 100 000 | 500 000 | `planLimit()` in `chatLimits.js:66-70` |
| `sadtalkerVideoLimit` | env `SADTALKER_LITE_LIMIT` (default 10) | env `SADTALKER_PRO_LIMIT` (default 50) | 0 (unlimited) | `getSadTalkerPlanLimit()` in `userController.js:430` |

---

## 2. Root Cause A — Stale `user.activePackageInstanceId` Pointer (Primary)

### The pointer update is not atomic and has a silent failure mode

**File**: `backend/controllers/checkoutController.js`, lines 515–538 (webhook) and 710–731 (verify fallback)

After `PackageInstance.create(...)` succeeds, the webhook does:

```js
if (instance.userId && instance.userId.toString() === user._id.toString()) {
  user.activePackageInstanceId = instance._id;
  await user.save();  // ← if this throws a non-11000 error, it's caught below
}
```

The catch block at lines 548–557:
```js
} catch (err) {
  if (err?.code === 11000) {
    return res.json({ received: true });
  }
  // logs the error, then falls through to:
  return res.json({ received: true });  // ← Stripe sees "200 OK", will NOT retry
}
```

**Result**: The Pro `PackageInstance` is created in the DB, `user.activePackageInstanceId` is **not** updated to it, and Stripe never retries because it received HTTP 200. The user is stuck on the old Lite pointer indefinitely.

### The `verifyCheckoutSession` "already applied" path does not recover a stale pointer

**File**: `backend/controllers/checkoutController.js`, lines 614–620

```js
const existingInstance = await PackageInstance.findOne({ stripeCheckoutSessionId: sessionId });
if (existingInstance) {
  applied = true;
  activePackageInstanceId = existingInstance._id.toString();
  // user.activePackageInstanceId is NOT written here
}
```

If the webhook created the Pro instance but failed to update `user.activePackageInstanceId`, this verify path finds the instance, sets a local variable, and returns — leaving the DB pointer still on Lite.

### Combined failure scenario

1. Stripe delivers webhook → Pro instance created → `user.save()` throws (network timeout, optimistic lock, etc.)
2. Stripe sees HTTP 200 → does not retry
3. User lands on success page → frontend calls `verifyCheckoutSession`
4. Verify finds existing Pro instance (by `stripeCheckoutSessionId`) → `applied = true` → returns without fixing pointer
5. All subsequent quota checks resolve the Lite instance → user sees Lite limits despite owning Pro

---

## 3. Root Cause B — Wrong `tokensLimit` on the Pro Instance (Confirmed Historical)

**Evidence**: `backend/scripts/fixTokenLimits.js` exists — a one-time migration that reset Pro instances' `tokensLimit` from 10 000 to 100 000.

**How it can still bite**: `resolveTokensLimit` in `chatLimits.js:17-29`:

```js
function resolveTokensLimit(instance) {
  const planDefault = planLimit(instance?.planKey || "lite");  // pro → 100 000
  if (typeof instance?.tokensLimit === "number" && instance.tokensLimit >= 0) {
    const tokensLimit = Number(instance.tokensLimit);
    if (tokensLimit > 0 || planDefault === 0) return tokensLimit;  // returns 10 000 if that's what's stored
  }
  // ...fallback to planDefault only if tokensLimit === 0
}
```

A Pro instance with `tokensLimit: 10000` (wrong value from a bad deployment window) returns 10 000 — Lite limits — even if `user.activePackageInstanceId` correctly points to it. The plan default fallback is only reached when the stored value is `0`, not when it's a wrong non-zero value.

**Who is affected**: Instances created before `fixTokenLimits.js` was run AND after any future deployment that reintroduces this bug.

---

## 4. Root Cause C — No Instance Lifecycle Management (Structural)

When Pro is purchased, the old Lite instance is **never** deactivated. Its `status` remains `"active"` forever.

**Consequences**:
- `PackageInstance.getActiveByUserId()` always returns ALL instances ever purchased (all "active")
- `BillingPanel` lists them all — user may manually "select" Lite, reverting to Lite limits
- Upload history queries filter by `packageInstanceId` matching `user.activePackageInstanceId`, so history is siloed per instance even though the user intends to "own all their uploads"
- No automatic expiration means no way to detect "this user should have Pro limits" from the instance list alone

---

## 5. Root Cause D — `UPLOAD_LIMITS` Not Configurable via Environment

**File**: `checkoutController.js:24`
```js
const UPLOAD_LIMITS = { lite: 5, pro: 20, ultimate: 100 };
```

Upload limits are hardcoded constants (unlike SadTalker limits which read from `SADTALKER_LITE_LIMIT` / `SADTALKER_PRO_LIMIT` env vars). Any product-level change to upload quota requires a code deploy AND a migration to update `uploadLimit` on all existing instances.

---

## 6. Secondary Observations

### `addons.chatTokens` schema mismatch
`chatLimits.js:92` checks `instance.addons?.chatTokens` first, but the `packageInstanceSchema` only defines `addons.chat` — not `addons.chatTokens`. The first branch is always false; the fallback to `addons.chat` is always used. This is dead code but correct behavior.

### In-memory cache in `checkUserPackage`
`src/app/utils/api.ts` caches the result of `/api/user/check-package` for 5 seconds. A user who buys Pro and immediately refreshes the dashboard may see a stale Lite response for up to 5 seconds. This is a display-only delay, not a persistent bug.

### `BillingPanel` uses two different APIs
- `usePlanInfo()` → `checkUserPackage` → resolves `user.activePackageInstanceId` → one instance's quota
- `fetchActivePackageInstances()` → `getActiveByUserId` → all active instances

The "selected" indicator in the billing panel reads from `planData.packageInstanceId` (from `checkUserPackage`). If the pointer is on Lite, the Lite card shows "Selected" even though the user paid for Pro.

---

## 7. Full Call-Path Matrix

| Feature | Quota-enforcing code | Pointer used |
|---|---|---|
| Photo upload / analyze | `analyzeController.js:313` | `user.activePackageInstanceId` |
| AI chat | `chatLimits.js:checkChatQuota:77` | `user.activePackageInstanceId` |
| SadTalker video | `userController.js:consumeSadtalkerCredit:810` | `user.activePackageInstanceId` |
| HeyGen video | `userController.js:consumeHeygenCredit:1023` | `user.activePackageInstanceId` |
| Face enrollment | `guardActiveInstanceAndFace.js:22` | `user.activePackageInstanceId` |
| Plan info display | `userController.js:checkUserPackage:469` | `user.activePackageInstanceId` |
| Billing panel list | `userController.js:listActivePackageInstances:682` | ALL active instances (no pointer) |

All enforcement paths use the same pointer. There is no fallback to "highest tier" or "most recent" active instance.

---

## 8. Recommended Fix Options

Present these options for a decision before implementing anything.

### Option 1 — Harden the pointer update (minimal, targeted)
Make `user.activePackageInstanceId` update a separate atomic write with retry logic, and make `verifyCheckoutSession`'s "already applied" path re-confirm and fix the pointer.

**Pro**: Surgical, low blast radius.
**Con**: Doesn't address structural issue; stale Lite instance stays "active" permanently.

### Option 2 — Deactivate old instances on upgrade (structural fix)
In the webhook and verify fallback, before or after creating the new instance, set all other `PackageInstance` records for that user/plan-tier to `status: "paused"` or `"expired"`.

**Pro**: Eliminates multi-active-instance confusion; enforces correct quota by design.
**Con**: Breaks intentional multi-instance use (if any). Need to decide: can a user own multiple active instances of the same tier? Of different tiers?

### Option 3 — Fall back to highest-tier active instance if pointer is stale
In all quota-check paths, if `findOne({ _id: activePackageInstanceId, status: "active" })` returns null, fall back to `getActiveByUserId()` and pick the highest-tier or most-recent instance.

**Pro**: Self-healing; resilient to stale pointers.
**Con**: Masks the root bug; may produce surprising behavior if user intentionally has multiple active instances.

### Option 4 — Fix wrong `tokensLimit` values on existing Pro instances (immediate data fix)
Re-run or extend `fixTokenLimits.js` to find all Pro instances with `tokensLimit != 100000` and correct them.

**Pro**: Immediate fix for Root Cause B.
**Con**: Standalone data fix; doesn't address Root Cause A or C.

### Option 5 — Combine Option 1 + Option 4 (recommended minimum)
- Fix the verify-session pointer gap (Option 1)
- Run corrective migration for wrong `tokensLimit` values (Option 4)

This is the safest immediate intervention without architectural changes.

---

## 9. Files Audited

| File | Role |
|---|---|
| `backend/models/packageInstance.js` | Schema; `getActiveByUserId` static |
| `backend/models/user.js` | `activePackageInstanceId` pointer field |
| `backend/controllers/checkoutController.js` | Webhook handler; verify-session fallback; instance creation |
| `backend/controllers/userController.js` | `checkUserPackage`, `listActivePackageInstances`, `consumeSadtalkerCredit`, `consumeHeygenCredit`, `toInstanceSummary`, `buildCheckPackagePayload` |
| `backend/middleware/guardActiveInstanceAndFace.js` | Pointer resolution for protected routes |
| `backend/middleware/chatLimits.js` | `checkChatQuota`, `resolveTokensLimit`, `planLimit` |
| `backend/controllers/analyzeController.js` | Upload quota reservation |
| `backend/utils/quotaError.js` | Error shape |
| `backend/scripts/fixTokenLimits.js` | Prior migration evidence |
| `src/app/dashboard/PlanContext.tsx` | Frontend plan state; `checkUserPackage` consumer |
| `src/app/utils/quotaContract.ts` | Frontend quota normalization |
| `src/app/components/dashboard/billing/BillingPanel.tsx` | Billing UI; `fetchActivePackageInstances` consumer |
| `src/app/components/dashboard/sidebar/SettingsModal.tsx` | Usage display; `usePlanInfo` consumer |
