# Promo Code System (v1) — Audit & Design

## Current PackageInstance creation

### Created at
Two paths, both in `backend/controllers/checkoutController.js`:

1. **Stripe webhook** (primary): `handleStripeWebhook` → `checkout.session.completed` handler
   - Line 515: `await PackageInstance.create({...})` — fires when Stripe sends the webhook
   - Deduplicated via `WebhookEvent` upsert before creation (lines 424–447)
   - Secondary dedup: `PackageInstance.findOne({ stripeCheckoutSessionId: sessionId })` (line 479) — skips if already exists

2. **verify-session fallback** (client-side safety net): `verifyCheckoutSession`
   - Line 710: `await PackageInstance.create({...})` — fires when client polls `GET /api/checkout/verify-session` and webhook hasn't arrived yet
   - Guarded by its own `WebhookEvent` upsert with eventId `verify:<sessionId>` (line 639)
   - Both paths are deduplication-safe against each other via the shared `WebhookEvent` table

### Required fields (for a valid, functional instance)

| Field | Type | Source at creation |
|---|---|---|
| `userId` | ObjectId | `user._id` from DB lookup by email |
| `planKey` | `"lite" \| "pro" \| "ultimate"` | `session.metadata.packageId` from Stripe |
| `status` | `"active"` | hardcoded |
| `uploadLimit` | Number | `UPLOAD_LIMITS[packageId]` — hardcoded map in checkoutController.js: `{ lite: 5, pro: 20, ultimate: 100 }` |
| `uploadsUsed` | Number | `0` |
| `tokensLimit` | Number | `planLimit(packageId)` from chatLimits.js: `{ lite: 10000, pro: 100000, ultimate: 500000 }` |
| `tokensUsed` | Number | `0` |
| `chatMonthlyLimit` | Number | same as `tokensLimit` |
| `chatUsedThisCycle` | Number | `0` |
| `chatCycleEndsAt` | Date | `null` |
| `sadtalkerVideoLimit` | Number | `getSadTalkerPlanLimit(packageId)` — env-configurable map in userController.js: `{ lite: env\|\|10, pro: env\|\|50, ultimate: 0 }` |
| `sadtalkerVideosUsed` | Number | `0` |
| `sadtalkerPrimaryImageHash` | String | `null` |
| `personaKey` | String\|null | from Stripe session metadata (optional) |
| `personaBound` | Boolean | `!!personaKey` |
| `rekognitionFaceId` | String | `null` |
| `stripeCheckoutSessionId` | String\|null | Stripe session ID |
| `stripePaymentIntentId` | String\|null | Stripe payment intent ID |

Fields with schema defaults that don't need to be set at creation:
`addons`, `lastAddonAppliedAt`, `lastAddonSessionId`, `faceEnrolled`, `faceEnrolledAt`, `heygenTalkingPhotoId`, `heygenTalkingPhotoHash`

### `stripeCheckoutSessionId` — required?

**No.** The schema has `default: null` and the index is `{ unique: true, sparse: true }`.
Sparse means MongoDB excludes `null` values from the uniqueness check — multiple instances can have `stripeCheckoutSessionId: null` simultaneously.

**Implication for promo**: Can safely leave `stripeCheckoutSessionId: null` on promo-created instances. However, this breaks the existing dedup guard in the webhook/verify-session paths (which dedup by this field). That is fine — promo instances take a completely separate code path that has its own dedup (the `PromoCode.usedBy` array).

**Recommendation**: Set `stripeCheckoutSessionId` to a sentinel string `"promo:<code>"` instead of `null`. This:
- Makes promo instances visually distinguishable in the DB
- Does NOT conflict with the unique sparse index (Stripe session IDs start with `cs_`; `"promo:"` prefixes cannot collide)
- Provides a query handle if you ever need to find promo-granted instances

### Quota source per plan

Three separate hardcoded maps across two files — no single config file, no Plan model in DB:

| Quota | Location | Values |
|---|---|---|
| `uploadLimit` | `checkoutController.js` — `UPLOAD_LIMITS` constant | lite: 5, pro: 20, ultimate: 100 |
| `tokensLimit` / `chatMonthlyLimit` | `chatLimits.js` — `planLimit()` function | lite: 10,000, pro: 100,000, ultimate: 500,000 |
| `sadtalkerVideoLimit` | `userController.js` — `SADTALKER_PLAN_LIMITS` + `getSadTalkerPlanLimit()` | lite: env\|\|10, pro: env\|\|50, ultimate: 0 |

**Implication for promo**: The implementation must call the same three sources. The cleanest approach is to extract a helper (e.g. `getQuotasForPlan(planKey)`) that centralises the three lookups and is called by both the webhook path and the new promo path.

### Non-Stripe creation path

**None exists.** The old `purchasePackage` endpoint in `userController.js` returns `410 DEPRECATED`. There are no admin endpoints, seed scripts, or other paths that create PackageInstances. This is greenfield.

---

## Active pointer setting

### Set at

`checkoutController.js`, in both creation paths:

**Webhook path** (line 535–538):
```js
if (instance.userId && instance.userId.toString() === user._id.toString()) {
  user.activePackageInstanceId = instance._id;
  await user.save();
}
```

**verify-session fallback** (line 730–731):
```js
user.activePackageInstanceId = instance._id;
await user.save();
```

Also set when a **legacy instance** is adopted (no new instance created, just the sessionId attached):
- Webhook path: line 508–509
- verify-session: line 696–697

### Known failure mode (from quota-carryover audit)

The instance is created first (`PackageInstance.create`), then the pointer is set (`user.save()`). These are two separate DB operations — not a transaction. If `user.save()` fails silently (network blip, Mongoose validation error) after the instance was already created, the instance exists in the DB but `user.activePackageInstanceId` still points to the old (or null) value. The user then hits quota limits from their previous package. This was the root cause of the Pro user seeing Lite limits.

The webhook path has a partial guard: the `if (instance.userId === user._id)` check before setting the pointer. This is always true (userId is set at instance creation from user._id), so it's not a real guard — it would never prevent the pointer from being set when it should be.

### Promo must replicate

The same two-step pattern must be followed, with the same vulnerability. For v1 (soft launch, low volume) this is acceptable. Document it explicitly. The mitigation is:
1. Log both steps with the instance ID so failures are detectable
2. In the rollback path (see edge cases below), check whether the pointer was already updated before rolling back

---

## Checkout / cart flow

### UI entry

- `src/app/components/cart/CartContext.tsx` — cart state (localStorage-backed), exposes `cartItems`, `addToCart`, etc.
- `src/app/components/cart/CartDrawer.tsx` — the drawer UI with the checkout button

### Stripe session initiated (chain)

```
CartDrawer.tsx: handleStripePayment()
  → startCheckout(cartItems[0].id, null, locale)          [api.ts:308]
    → POST /api/checkout/create-checkout-session          [BFF or direct]
      → checkoutController.createCheckoutSession()        [checkoutController.js:92]
        → stripe.checkout.sessions.create()
          → returns { url }
            → window.location.href = data.url             [api.ts:333]
              → Stripe hosted checkout page
                → on success: redirect to /dashboard?status=success&session_id=...
                  → CartDrawer/checkout page polls verifySession()
```

Note: `cartItems[0].id` only — even though the cart supports multiple items and quantities, checkout always takes the first item. This is a current limitation of the cart.

### Where promo input + redemption intercept should go

**In `CartDrawer.tsx`, inside `handleStripePayment`, BEFORE the `startCheckout` call.**

Proposed intercept point:
```
handleStripePayment() {
  if (promoCode.trim()) {
    // call POST /api/promo/redeem instead of startCheckout
    // on success: skip Stripe, redirect to /dashboard?status=promo-success
    return;
  }
  await startCheckout(cartItems[0].id, null, locale);   // existing path unchanged
}
```

The promo input field lives in the CartDrawer footer, above or below the subtotal row. A separate `POST /api/promo/redeem` endpoint handles redemption server-side and returns `{ instanceId, planKey }` on success. The frontend then navigates to the dashboard (no Stripe redirect needed).

### Cart concept

**Exists** — a real cart with localStorage persistence, qty controls, and a drawer UI. However, it is effectively a direct buy today (only `cartItems[0]` is used at checkout). The promo flow can follow the same single-item assumption.

---

## Existing promo code remnants

**None — greenfield.** The grep matches for "promo/coupon/redeem/voucher/discount" in app code all refer to:
- Social media promotion content (recommendation engine) in `buildPromotionBlueprint.js`, `dynamicContextEngine.js`, `recommendationsController.js`
- Stripe's own SDK types (`stripe/types/PromotionCodes.d.ts`, etc.)
- No `PromoCode` model, no redeem endpoint, no coupon fields on any existing model

---

## Proposed v1 design

### PromoCode model (new — `backend/models/promoCode.js`)

```js
{
  code: { type: String, required: true, unique: true, index: true },
  // stored uppercased, trimmed
  planKey: { type: String, enum: ["lite", "pro", "ultimate"], required: true },
  maxUses: { type: Number, default: 1 },
  // null = unlimited; 1 = one-time; N = multi-use
  usedCount: { type: Number, default: 0 },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // prevents same user redeeming the same code twice
  expiresAt: { type: Date, default: null },
  active: { type: Boolean, default: true },
  // kill switch — set to false to disable without deleting
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  // admin user who created it (for audit trail)
  note: { type: String, default: "" },
  // optional internal label (e.g. "friends-family-q1-2026")
},
{ timestamps: true }
```

### Redemption flow

```
1. User opens CartDrawer, adds a package, enters promo code, clicks "Apply Code" (or "Checkout with Code")
2. Frontend: POST /api/promo/redeem { code: "FREEQX7", packageId: cartItems[0].id }
   - packageId from cart is used to validate the code grants the right plan (or ignored — see open questions)
3. Backend validates (in order — fail fast):
   a. Code exists → 404 if not
   b. active === true → 410 if disabled
   c. expiresAt === null || expiresAt > now → 410 if expired
   d. maxUses === null || usedCount < maxUses → 410 if exhausted
   e. userId NOT in usedBy array → 409 if already redeemed by this user
4. Atomic reservation — findOneAndUpdate with all conditions in the query filter:
   PromoCode.findOneAndUpdate(
     {
       code,
       active: true,
       $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
       $or: [{ maxUses: null }, { $expr: { $lt: ["$usedCount", "$maxUses"] } }],
       usedBy: { $ne: userId }
     },
     { $inc: { usedCount: 1 }, $push: { usedBy: userId } },
     { new: true }
   )
   If null returned → concurrent race lost, return 410 "code no longer available"
5. On successful reservation:
   a. Resolve quotas: getQuotasForPlan(promo.planKey)
   b. Create PackageInstance:
      { userId, planKey: promo.planKey, status: "active",
        stripeCheckoutSessionId: `promo:${promo.code}`,
        stripePaymentIntentId: null, ...quotas }
   c. Set active pointer: user.activePackageInstanceId = instance._id; await user.save()
   d. If step b or c fails: rollback — remove userId from usedBy, decrement usedCount
      (see edge cases)
6. Return { success: true, planKey, instanceId }
7. Frontend: clear cart, redirect to /dashboard?status=promo-success
```

### Validation rules

| Rule | Error code | HTTP |
|---|---|---|
| Code not found | `PROMO_NOT_FOUND` | 404 |
| `active === false` | `PROMO_DISABLED` | 410 |
| `expiresAt` in the past | `PROMO_EXPIRED` | 410 |
| `usedCount >= maxUses` (and maxUses not null) | `PROMO_EXHAUSTED` | 410 |
| `userId` already in `usedBy` | `PROMO_ALREADY_REDEEMED` | 409 |
| Atomic reservation lost (concurrent) | `PROMO_EXHAUSTED` | 410 |

### Edge cases

**PackageInstance creation fails after code reservation**
The `findOneAndUpdate` atomically incremented `usedCount` and pushed `userId` into `usedBy`. If the subsequent `PackageInstance.create()` throws, the code is "burned" but no instance was created. Rollback:
```js
await PromoCode.updateOne(
  { code },
  { $inc: { usedCount: -1 }, $pull: { usedBy: userId } }
)
```
Log both the failure and the rollback. If the rollback also fails (extremely rare), log an alert — manual repair via script.

**Pointer set fails after instance creation**
Instance exists, but `user.activePackageInstanceId` is not updated. Same failure mode as the Stripe path. Mitigation: log with `{ instanceId, userId }` so it can be detected and repaired via the existing `diagnoseUserPackages.js` script. For v1 (low volume) this is acceptable.

**Concurrent redemption of the last use**
Handled by the atomic `findOneAndUpdate` with all validation conditions in the query filter. The losing request gets `null` back and returns `PROMO_EXHAUSTED`. No double-redemption is possible.

**User already has packages**
The product model allows multiple active PackageInstances per user (confirmed by `getActiveByUserId` returning an array). The promo path does not check for existing packages — a user can redeem a free code even if they already paid for one. For friends & family soft launch this is the intended behaviour. Note it in the response: the new instance becomes active (pointer updated).

**Invalid/expired code — clear error messages**
All error codes above need i18n translations in all 4 locales (see i18n section below).

---

### Admin code creation (v1 minimal)

**Existing infrastructure**: `requireAdmin` middleware exists and works. `grantAdmin.js` script exists to flag users as admin. `/api/debug` routes are admin-gated and non-production only.

**Recommendation**: Two-pronged approach for v1:

1. **Script** (immediate, no auth surface): `backend/scripts/createPromoCode.js`
   - Usage: `MONGO_URI=... node createPromoCode.js --plan pro --max-uses 50 --note "soft-launch-q1"`
   - Generates a cryptographically random code (8–10 uppercase alphanumeric chars, ~40 bits entropy)
   - Prints the code to stdout, inserts into DB
   - Safe to run in production since it only inserts (no reads of sensitive data)

2. **Admin endpoint** (for later, when admin UI exists): `POST /api/admin/promo` behind `requireAuth + requireAdmin`
   - Same logic as the script but over HTTP
   - Not strictly needed for v1 soft launch — defer if the script is sufficient

---

### Files to create / modify (for implementation)

| File | Change |
|---|---|
| `backend/models/promoCode.js` | **CREATE** — PromoCode mongoose model |
| `backend/controllers/promoController.js` | **CREATE** — `redeemPromoCode` handler |
| `backend/routes/promo.js` | **CREATE** — `POST /api/promo/redeem` (requireAuth) |
| `backend/index.js` | **MODIFY** — mount `app.use("/api/promo", requireAuth, promoRoutes)` |
| `backend/utils/planQuotas.js` | **CREATE** — `getQuotasForPlan(planKey)` helper (extracts the 3 hardcoded maps from checkoutController + userController into one place); update both existing callers to use it |
| `backend/scripts/createPromoCode.js` | **CREATE** — CLI script for code generation |
| `src/app/components/cart/CartDrawer.tsx` | **MODIFY** — add promo code input + intercept before `handleStripePayment` |
| `src/app/utils/api.ts` | **MODIFY** — add `redeemPromoCode(code, packageId)` fetch wrapper |
| `src/messages/en.json` | **MODIFY** — add promo i18n keys |
| `src/messages/el.json` | **MODIFY** — add promo i18n keys (Greek) |
| `src/messages/es.json` | **MODIFY** — add promo i18n keys (Spanish) |
| `src/messages/it.json` | **MODIFY** — add promo i18n keys (Italian) |

---

### Security

- **Rate limit** `POST /api/promo/redeem`: add a strict rate limiter (e.g. 5 attempts / 15 min per IP + 3 attempts / 15 min per userId) in `backend/middleware/rateLimiters.js`. Without this, an attacker can brute-force a 6-char code in seconds.
- **Code entropy**: use `crypto.randomBytes(6)` encoded as base32/uppercase alphanumeric — ~8 characters gives ~40 bits. Avoid `Math.random()`. Example: `XQRT7KWP`. Never sequential (`PRO001`, `CODE2`, etc.).
- **Server-side only**: `userId` must come from `req.user.id` (JWT session), never from the request body.
- **Timing-safe lookup**: MongoDB `findOne({ code })` is sufficient — no timing attack risk since the code is a secret passed by the user, not a hash comparison.
- **No client-side validation**: never expose `maxUses`, `usedCount`, or `usedBy` in any API response other than admin endpoints.
- **Normalise before lookup**: uppercase + trim the code on both creation and redemption to prevent case-sensitivity gotchas.

---

### i18n

New keys needed in `dashboard.cart` namespace (or `common` — to be decided):

```json
"promoCode": {
  "inputLabel": "Promo code",
  "inputPlaceholder": "Enter code",
  "applyButton": "Apply",
  "success": "Code applied! {planKey} package activated.",
  "errorNotFound": "This code is not valid.",
  "errorExpired": "This code has expired.",
  "errorExhausted": "This code has reached its usage limit.",
  "errorAlreadyRedeemed": "You have already used this code.",
  "errorGeneric": "Failed to apply code. Please try again."
}
```

Required in all 4 locales: `en`, `el`, `es`, `it`.

---

## Open questions for product

1. **Code scoping vs cart item**: Should the code be validated against the package currently in the cart (e.g. a `pro` code should only work when `pro` is in the cart), or should the code override whatever is in the cart (user enters any code → gets whatever plan the code grants regardless of cart contents)? Current design assumes override (code defines the plan, cart item is ignored on promo path). This simplifies UX (user doesn't need to pick the right plan first) but may be confusing.

2. **Multiple free packages**: Should a user be allowed to redeem multiple different promo codes (getting multiple free package instances)? The current model allows it (multi-package architecture). Is that intentional for soft launch, or should redemption be limited to "one promo per user ever" (regardless of code)?

3. **Expiry granularity**: Should `expiresAt` be date-only (end of day in some timezone) or exact timestamp? If date-only, which timezone should be used for the cutoff?

4. **Post-redemption UX**: After a successful redemption, where should the user land? `/dashboard?status=promo-success` is proposed. Should there be a success modal/banner different from the Stripe success flow?

5. **planQuotas.js refactor**: Extracting the quota maps into a shared helper is the right call, but it touches `checkoutController.js` (a critical path). Should this refactor be in-scope for v1 (cleaner but riskier) or should promo just duplicate the maps temporarily (ugly but safe)?

6. **Admin endpoint**: Is the script sufficient for soft launch, or do you need an admin HTTP endpoint (e.g. to create codes from a future admin UI)?
