# Out-of-Credits Modal — Pre-Work Audit

## 1. Current 0-credits behavior per page

### `/dashboard/upload`
- **Source:** `src/app/[locale]/dashboard/upload/page.tsx`
- **Data source:** reads deprecated `planData?.uploadsRemaining` into local state `uploadsLeft` (not via `resolveQuotaContract`)
- **0-credits UI:** replaces the upload form with a static inline card:
  - Title: "Upload content"
  - Message: "You've used all your uploads. Upgrade your plan to continue."
  - CTA: "Manage billing →" link to `PACKAGES_URL` (`/account/plans`)
- **No modal, no addon purchase option.** The user can only navigate away.
- **Backend error code:** not caught in this page — uploads are blocked client-side before the API call is attempted. The upload API itself would likely return `QUOTA_EXCEEDED` or `UPGRADE_REQUIRED` but this is not surfaced here.

### `/dashboard/ai-chat`
- **Source:** `src/app/components/AIchat/CoachChat.tsx` (no dedicated page file found; chat likely rendered inside dashboard layout)
- **Data source:** does not read quota from PlanContext. Quota is enforced server-side only; the backend returns HTTP 402 when monthly token limit is hit.
- **0-credits UI (402 response):** sets `isLimited = true`, which:
  - Shows inline banner: "Monthly limit reached — [upgrade link]"
  - Disables input textarea and send button
  - Changes input placeholder to "Upgrade to continue chatting…"
  - Link goes to `PACKAGES_URL` (`/account/plans`)
- **Also handles:** HTTP 429 (rate limit) → inline error string; HTTP 409 (context window full) → `isContextLimited` banner
- **No modal, no addon purchase option.** `UpgradeCta` component exists but only used for near-limit preview, not at hard limit.
- **Backend error code:** `402` response body: `{ error: string, action?: "upgrade", quota?: { used, limit } }`

### `/dashboard/talking-head`
- **Source:** `src/app/components/render/UploadTalkingHead.tsx`
- **Data source:** `resolveQuotaContract(planData, "upload.talkingHead")` → `quotas.videos.remaining`
- **0-credits detection:** `isOutOfCredits = forceUpsell || (videosRemaining <= 0)`; also set to `true` when backend returns `UPGRADE_REQUIRED` code
- **0-credits UI:** replaces entire generation form with a "You're out of video credits" section that includes:
  - Message: "Buy more to continue generating videos."
  - Three addon buy buttons: **Buy 5**, **Buy 15**, **Buy 30 (Best value)**
  - Each button calls `createAddonCheckoutSession({ addonType: "sadtalkerVideos", addonPack: "pack_5/15/30", packageInstanceId, locale })` → redirects to Stripe
- **Backend error code:** `UPGRADE_REQUIRED` from `/api/heygen/create` → sets `upgradeInfo` state → `UpgradeRequiredBanner` component renders below the form
- **Most complete implementation:** already has the full addon purchase flow inline.

---

## 2. PlanContext data shape

**Context type** (`src/app/dashboard/PlanContext.tsx`):
```ts
type ContextValue = {
  loading: boolean;
  data: UserPackageResponse | null;
  hasActiveInstance: boolean;
  isMissingActiveInstance: boolean;
  isNewUser: boolean;
  refresh: (resetState?: boolean) => void;
  refreshPlan: (resetState?: boolean) => void;
};
```

**Canonical quota fields** (via `resolveQuotaContract(data, context)` in `src/app/utils/quotaContract.ts`):
```ts
{
  uploads: {
    baseLimit: number;
    addons: number;
    effectiveLimit: number;  // baseLimit + addons
    used: number;
    remaining: number | null;  // null = unlimited
    isUnlimited: boolean;
  };
  aiTokens: { /* same shape */ };
  videos:   { /* same shape */ };
}
```

- **Remaining uploads:** `resolveQuotaContract(data).uploads.remaining`
- **Remaining aiTokens:** `resolveQuotaContract(data).aiTokens.remaining`
- **Remaining videos:** `resolveQuotaContract(data).videos.remaining`
- **Unlimited check:** `quotas.uploads.isUnlimited` (etc.) — `remaining` is `null` when unlimited
- **Loading state:** `usePlanInfo().loading` (boolean)
- **No error state exposed** from PlanContext — errors internally result in `data: null` + `hasActiveInstance: false`

**Deprecated legacy fields** still present on `UserPackageResponse` (should not be used for new code):
- `uploadsRemaining`, `uploadsUsed`, `uploadLimit`, `effectiveUploadLimit`, `addonsUploads`
- `chatRemaining`, `chatUsed`, `chatMonthlyLimit`, `chatTokenLimit`, etc.
- `sadtalkerVideosRemaining`, `sadtalkerVideosUsed`, `sadtalkerVideoLimit`

> **Note:** The upload page (`/dashboard/upload/page.tsx`) still reads the deprecated `planData?.uploadsRemaining` directly instead of using `resolveQuotaContract`. New work should always use `resolveQuotaContract`.

---

## 3. Addon products

Config: `backend/config/addons.js`

| Name | AddonType | Pack key | Qty granted | Env var | Stripe price ID (test) |
|------|-----------|----------|-------------|---------|------------------------|
| 5 Uploads | `uploads` | `pack_5` | 5 uploads | `STRIPE_PRICE_UPLOADS_5` | `price_1TA9cHIriybSZOt4ieXCuu8u` |
| 20 Uploads | `uploads` | `pack_20` | 20 uploads | `STRIPE_PRICE_UPLOADS_20` | `price_1TA9dnIriybSZOt4V4mQEz2x` |
| 100k Chat Tokens | `chat` | `pack_100k` | 100,000 tokens | `STRIPE_PRICE_CHAT_100K` | `price_1TA9fbIriybSZOt4aGLzQTo0` |
| 5 Videos | `sadtalkerVideos` | `pack_5` | 5 videos | `STRIPE_PRICE_VIDEOS_5` | `price_1TA9gGIriybSZOt4h1y65Gj7` |
| 15 Videos | `sadtalkerVideos` | `pack_15` | 15 videos | `STRIPE_PRICE_VIDEOS_15` | `price_1TA9gyIriybSZOt4ypOskaIa` |
| 30 Videos | `sadtalkerVideos` | `pack_30` | 30 videos | `STRIPE_PRICE_VIDEOS_30` | `price_1TA9hdIriybSZOt4UmXav2gf` |

**Dollar prices are not stored anywhere in the codebase** — they exist only in the Stripe dashboard and are referenced via env vars. The frontend (`BillingPanel`, `UploadTalkingHead`) shows pack labels ("Buy 5", "20 Uploads") but no prices.

**Validated at startup:** `validateAddonPriceEnv()` in `backend/config/addons.js` — throws in production if any env var is missing, warns in dev.

---

## 4. Addon checkout endpoint

- **Endpoint:** `POST /api/checkout/create-addon-checkout-session`
- **Auth:** `requireAuth` middleware (session cookie required)
- **Request payload:**
  ```json
  {
    "addonType": "uploads" | "chat" | "sadtalkerVideos",
    "addonPack": "pack_5" | "pack_20" | "pack_100k" | "pack_15" | "pack_30",
    "packageInstanceId": "<MongoDB ObjectId string>",
    "addonQty": 5   // optional, derived from packKey; client also sends this
  }
```
- **Response (success):** `{ "url": "https://checkout.stripe.com/...", "requestId": "..." }`
- **Response (errors):** `INVALID_ADDON_TYPE`, `INVALID_ADDON_PACK`, `ADDON_PRICE_NOT_CONFIGURED` (500), `INVALID_PACKAGE_INSTANCE`, `PACKAGE_INSTANCE_NOT_FOUND`
- **Stripe session config:**
  - `mode: "payment"` (one-time, not subscription)
  - `success_url`: `/dashboard/billing?status=success&kind=addon&session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url`: `/dashboard/billing?status=cancel&kind=addon`
  - Metadata: `kind=addon`, `userId`, `addonType`, `addonQty`, `packKey`, `packageInstanceId`
- **Different from plan checkout?** Yes — plan checkout (`create-checkout-session`) creates a subscription; addon checkout is a one-time `payment` mode session.
- **Frontend caller:** `createAddonCheckoutSession()` in `src/app/utils/api.ts:638`
  - Respects `NEXT_PUBLIC_USE_BFF=true` flag to route via BFF proxy
  - Used in: `UploadTalkingHead.tsx` (inline), `BillingPanel.tsx` (all addon types)

---

## 5. Pricing API

- **Exists?** No. There is no `GET /api/checkout/addons-pricing` or equivalent endpoint.
- **What exists:** `backend/config/addons.js` exposes `ADDON_PRICES` object (addonType → packKey → `{ qty, priceEnv, priceId }`), but this is backend-only and the `priceId` is a Stripe internal ID, not a human-readable dollar amount.
- **How to get dollar amounts:** Would require fetching from Stripe API (`stripe.prices.retrieve(priceId)`) to get `unit_amount` in cents.

**Recommendation for new endpoint:**

Follow the pattern of `checkoutController.js` — add a new route to `backend/routes/checkout.js`:

```
GET /api/checkout/addon-prices
```

Controller reads `ADDON_PRICES`, calls `stripe.prices.retrieve()` for each configured price ID, and returns:

```json
{
  "uploads": {
    "pack_5":  { "qty": 5,  "unitAmount": 999,  "currency": "usd" },
    "pack_20": { "qty": 20, "unitAmount": 2999, "currency": "usd" }
  },
  "chat": {
    "pack_100k": { "qty": 100000, "unitAmount": 499, "currency": "usd" }
  },
  "sadtalkerVideos": {
    "pack_5":  { "qty": 5,  "unitAmount": 1499, "currency": "usd" },
    "pack_15": { "qty": 15, "unitAmount": 3499, "currency": "usd" },
    "pack_30": { "qty": 30, "unitAmount": 5999, "currency": "usd" }
  }
}
```

Cache aggressively (prices rarely change). If Stripe fetch fails, the modal can fall back to labels without prices.

---

## 6. Modal infrastructure

- **Library installed:** `@headlessui/react` v2.2.0 — **NOT used by any existing modal component**
- **Actual pattern:** all modals are hand-rolled with:
  - `fixed inset-0 z-[N]` container
  - Backdrop as `<button>` or `<div>` with `bg-black/50 backdrop-blur-sm`
  - Esc key via `useEffect(() => { document.addEventListener("keydown", ...) })`
  - `createPortal(modal, document.body)` for z-index isolation (used in SettingsModal, PackagesModal)

**Two modal archetypes to choose from:**

| Component | Path | Pattern | Portal? | Size |
|-----------|------|---------|---------|------|
| `SettingsModal` | `src/app/components/dashboard/sidebar/SettingsModal.tsx` | Full-screen mobile / centered card desktop | Yes (`createPortal`) | Large (multi-panel) |
| `ConfirmModal` | `src/app/components/common/ConfirmModal.tsx` | Simple centered card | No | Small |
| `PackagesModal` | `src/app/components/dashboard/sidebar/PackagesModal.tsx` | Full-screen overlay | Yes (`createPortal`) | Medium |
| `FaceEnrollModal` | `src/app/components/dashboard/FaceEnrollModal.tsx` | Centered card with backdrop | No | Medium |

**No shared reusable `<Modal>` primitive exists.** Each component implements its own modal shell.

**Recommended pattern for "out of credits" modal:**
Use the `ConfirmModal` / `FaceEnrollModal` archetype (small centered card, no portal needed for this use case), following the same structure:
```
fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm
  └── rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 max-w-md w-full
```

---

## Recommendations for implementation

1. **Use `resolveQuotaContract()` everywhere.** The upload page reads the deprecated `planData?.uploadsRemaining` directly. New work should consistently use `quotas.uploads.remaining` from `resolveQuotaContract`.

2. **The talking-head page is the best reference implementation.** It already has the inline addon purchase flow — copy that pattern (addon type buttons → `createAddonCheckoutSession()` → Stripe redirect) for the modal.

3. **No pricing API exists — add one before the modal launch.** The modal should show actual prices. Add `GET /api/checkout/addon-prices` to the backend and a matching `fetchAddonPrices()` helper in `src/app/utils/api.ts` following the existing `fetchJson` pattern.

4. **Build a custom modal — don't introduce a new library.** `@headlessui/react` is installed but unused; either use it for the new modal (consistent with the installed dep) or follow the existing hand-rolled `createPortal` + backdrop + Esc pattern. Pick one and document the choice.

5. **Stripe success URL is hardcoded to `/dashboard/billing`.** After an addon checkout, the user lands back on `/dashboard/billing` regardless of where they started. The out-of-credits modal will need to handle the case where the user is redirected back to a different page. The simplest fix is to check `?status=success&kind=addon` on mount and refresh the plan (like `UploadTalkingHead` already does).

6. **AI Chat has no addon path.** The 100k chat token addon exists in the backend but the CoachChat UI shows only a plain upgrade link. The modal for AI Chat needs to include the `chat / pack_100k` addon button, which is currently only accessible via `BillingPanel`.
