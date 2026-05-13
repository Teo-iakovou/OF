# Account Portal Refactor - Pre-Work Audit

_Audit date: 2026-05-09. Read-only findings unless noted under "Reverted"._

---

## Reverted in this prompt

| File | What was reverted |
|------|-------------------|
| `src/app/components/dashboard/navigation/dashboardNav.config.ts` | `billing` item back to `topLevel: false, showDesktop: false, settingsOnly: true` — no longer in main sidebar |
| `src/app/dashboard/PaywallGuard.tsx` | Added TODO comment at top; redirect target stays at `/dashboard/billing` until `/account/plans` exists |
| `src/app/components/dashboard/billing/BillingPanel.tsx` | Replaced 3-plan purchase cards with simple "No active plan" message + `/#packages` link |
| `src/app/[locale]/dashboard/billing/page.tsx` | Reverted context-aware header back to static "Plan & Billing" / "Manage add-ons and package profiles." |
| `src/app/utils/urls.ts` | `PACKAGES_URL` reverted to `"/#packages"` |
| `src/app/components/dashboard/NoPlanDashboard.tsx` | "Explore plans" link reverted from `/dashboard/billing` → `/#packages` |

---

## Audit findings

### 1. Existing profile/account surfaces

**`src/app/[locale]/dashboard/account/page.tsx`** (`AccountAndBillingPage`)
- Accessible only via `settingsOnly: true` nav item (reachable through SettingsModal > no direct link)
- Shows: email (read-only), a "Log Out" button under Security, and a Plan Status sidebar card (current plan name, uploads remaining, expiry)
- **Problem:** reads deprecated `planData.hasAccess`, `planData.package`, `planData.uploadsRemaining`, `planData.expiresAt` instead of the canonical `quotas.*` contract
- "Manage billing" links to `/#packages` (landing page)
- API calls: `GET /api/user/check-package` (via PlanContext), `GET /api/auth/me` (via `useUser`)

**`src/app/components/dashboard/sidebar/SettingsModal.tsx`**
- Full-screen modal on mobile, 1100×720px card on desktop
- 4 tabs: Account · Usage · Plan & Billing · History
  - **Account tab**: first name / last name edit fields (calls `PUT /api/user/profile`), email (read-only). Has "Save changes" + "Cancel". Also "Exit dashboard" + "Sign out" in footer.
  - **Usage tab**: quota bars for Uploads, AI Tokens, Avatar Videos — reads from `resolveQuotaContract(planData)`
  - **Plan & Billing tab**: renders `<BillingPanel embedded />` — addon purchases only (no plan purchase)
  - **History tab**: renders `<HistoryPanel embedded />` — upload/analysis history, NOT purchase history
- Opened by: `ProfileMenuButton` "Settings" option, or programmatic `window.dispatchEvent(new Event("dashboard:open-packages"))` equivalent for settings

**`src/app/[locale]/dashboard/billing/page.tsx`**
- Full page at `/dashboard/billing` (not reachable from sidebar in current state — only via SettingsModal tab or direct URL)
- Shows add-on purchase cards for active plan holders; simple "No active plan" + `/#packages` link for unpaid users
- Also handles Stripe return URL for addon purchases (`?status=success&kind=addon&session_id=...`) with exponential-backoff verification

**No password change UI exists.** The account page only has a logout button under "Security."

---

### 2. Order/purchase history

- **Upload/analysis history:** `src/app/[locale]/dashboard/history/page.tsx` exists — renders `<HistoryPanel>`, which shows AI analysis result history with a report drawer. This is content history, NOT purchase history.
- **Purchase/order history: does NOT exist anywhere in the frontend.** No page, component, or API endpoint surfaces past Stripe purchases, PackageInstance records by date, or receipts.
- `fetchActivePackageInstances()` (called in `BillingPanel`) returns currently-active instances — not historical ones.
- Backend: `PackageInstance` documents have `createdAt` timestamps and `planKey`, so the data exists in MongoDB but is not surfaced.
- Stripe: webhook events are recorded but no endpoint exposes them to the frontend user.

**Gap:** `/account/orders` will need a new backend endpoint and frontend page.

---

### 3. Avatar / user menu

**Component:** `src/app/components/dashboard/sidebar/ProfileMenuButton.tsx`

- Located at the very bottom of the dashboard sidebar
- Avatar: single letter (first char of `user.email`), gradient circle
- When **collapsed sidebar**: shows only the avatar circle, no label
- When **expanded sidebar**: shows "Profile" label + chevron
- **Clicking opens a dropdown menu** (appears to the right of the button):
  - "Settings" → opens `SettingsModal` to the "account" tab
  - "Help Center" → `mailto:support@yourapp.com` link
  - "Cookie preferences" → calls `onOpenCookiePreferences()`
  - "Log out" → `logoutClient()` then `router.replace("/login")`
- No link to `/account` portal exists yet; adding one here is the natural entry point

---

### 4. Routing structure for `/account`

- **i18n:** next-intl middleware intercepts all routes. All pages live under `src/app/[locale]/`.
- **Correct location:** `src/app/[locale]/account/` — e.g.:
  - `src/app/[locale]/account/page.tsx` → `/account` (profile/settings)
  - `src/app/[locale]/account/plans/page.tsx` → `/account/plans` (plan purchase / upgrade)
  - `src/app/[locale]/account/orders/page.tsx` → `/account/orders` (purchase history)
- **AppShell detection:** `AppShell.tsx` currently hides Navbar/Footer for `/dashboard/*` routes. The `/account/*` routes will get the Navbar + Footer by default unless explicitly excluded — you probably want a minimal shell (no full landing Navbar, but some nav). Add `/account` to `AppShell`'s route detection.
- **No `src/app/[locale]/account/layout.tsx` exists yet** — needs to be created.

**Recommendation:** Create `src/app/[locale]/account/layout.tsx` with a minimal authenticated layout (just a top bar with logo + user avatar + logout, no sidebar). Reuse `serverGetUser()` for auth guard at the layout level (same pattern as dashboard layout).

---

### 5. Reusable layout

**`src/app/components/layout/AppShell.tsx`**
- Wraps every page in the app
- Conditionally shows/hides Navbar and Footer based on route
- Dashboard routes: no Navbar, no Footer
- Landing/auth routes (`useLandingShell`): no Navbar, no Footer (standalone page design)
- Other routes: full Navbar + Footer

**Login/signup pages:** Use `LoginPageContent` — a centered card, no shared "minimal authenticated" layout component exists. The auth pages are standalone.

**`src/app/dashboard/LayoutClient.tsx`** — handles the dashboard shell (sidebar + content area). This is specific to dashboard and should NOT be reused for `/account`.

**Recommendation for `/account` portal:**
- Create a new `AccountShell` component (simple top bar: logo + avatar + logout link) — similar in spirit to `AppShell` but lighter
- OR: update `AppShell` to detect `/account/*` routes and render a minimal authenticated top bar
- The `/account/layout.tsx` should do a server-side auth check (redirect to `/login` if no session) — same pattern as `src/app/[locale]/dashboard/layout.tsx`

---

### 6. Stripe addons

**Addon products** (`backend/config/addons.js`):

| Addon type | Pack key | Quantity | Env var |
|------------|----------|----------|---------|
| uploads | pack_5 | 5 uploads | `STRIPE_PRICE_UPLOADS_5` |
| uploads | pack_20 | 20 uploads | `STRIPE_PRICE_UPLOADS_20` |
| chat | pack_100k | 100k AI tokens | `STRIPE_PRICE_CHAT_100K` |
| sadtalkerVideos | pack_5 | 5 videos | `STRIPE_PRICE_VIDEOS_5` |
| sadtalkerVideos | pack_15 | 15 videos | `STRIPE_PRICE_VIDEOS_15` |
| sadtalkerVideos | pack_30 | 30 videos | `STRIPE_PRICE_VIDEOS_30` |

Addons use pre-created Stripe Price IDs (stored as env vars). If the env var is unset, the checkout returns `ADDON_PRICE_NOT_CONFIGURED`.

**Plan checkout** (`backend/controllers/checkoutController.js`):

Plans use `price_data` (dynamic pricing, no pre-created Stripe Price IDs):
```js
const PACKAGES = { lite: 500, pro: 1500, ultimate: 3000 }; // cents
```
These are the Stripe amounts in cents — these look like test values ($5/$15/$30); production values are presumably set elsewhere or these will be updated.

**Endpoints:**
- Plan purchase: `POST /api/checkout/create-checkout-session` → `{ packageId, personaKey? }` → returns `{ url }` (Stripe Checkout URL)
- Addon purchase: `POST /api/checkout/create-addon-checkout-session` → `{ addonType, addonPack, packageInstanceId }` → returns `{ url }`
- Plan verification (after Stripe return): `POST /api/checkout/verify-session` → `{ sessionId }`
- Addon verification: `GET /api/billing/addons/verify?session_id=...` with exponential-backoff polling

**BFF wrappers in Next.js:** `src/app/api/checkout/create-checkout-session/route.ts`, `src/app/api/checkout/create-addon-checkout-session/route.ts`, `src/app/api/billing/addons/verify/route.ts`

---

## Recommendations for `/account` portal implementation

### Files to create

| File | Purpose |
|------|---------|
| `src/app/[locale]/account/layout.tsx` | Authenticated layout with server-side auth guard; minimal shell (top bar, no sidebar) |
| `src/app/[locale]/account/page.tsx` | Profile page: name/email edit, password change placeholder, logout |
| `src/app/[locale]/account/plans/page.tsx` | Plan purchase page: 3 plan cards + `startCheckout()`; also handles Stripe return `?status=success&session_id=...` |
| `src/app/[locale]/account/orders/page.tsx` | Purchase history: needs new backend endpoint |
| `src/app/components/account/AccountShell.tsx` | Minimal top bar component (logo, user avatar, logout) |

### Files to modify

| File | Change |
|------|--------|
| `src/app/components/layout/AppShell.tsx` | Add `/account` to route exclusions (hide Navbar/Footer for account portal routes) |
| `src/app/dashboard/PaywallGuard.tsx` | Update redirect from `/dashboard/billing` → `/account/plans` |
| `src/app/utils/urls.ts` | Update `PACKAGES_URL` from `"/#packages"` → `"/account/plans"` |
| `src/app/components/dashboard/NoPlanDashboard.tsx` | Update "Explore plans" link to `/account/plans` |
| `src/app/components/dashboard/billing/BillingPanel.tsx` | Update no-plan "View plans" link to `/account/plans` |
| `src/app/components/dashboard/sidebar/ProfileMenuButton.tsx` | Add "Account" link to `/account` in the dropdown (alongside Settings, Help, Logout) |
| `src/app/[locale]/dashboard/account/page.tsx` | Deprecate or redirect to `/account` — currently settingsOnly hidden page with stale deprecated API usage |

### New backend endpoint needed

`GET /api/user/purchase-history` — returns `PackageInstance` records for the current user (all, including expired/inactive) with `planKey`, `createdAt`, `status`. Can be built from the existing `PackageInstance` model.

### Reuse

- `startCheckout()` utility (`src/app/utils/api.ts`) — already works, reuse in `/account/plans`
- `PlanContext` + `usePlanInfo()` — works outside dashboard if wrapped in `PlanProvider` at account layout level
- `BillingPanel` — reuse at `/account/plans` for add-on purchases (when user has active plan)
- `SettingsModal` Account tab profile-edit form — extract or duplicate for `/account/page.tsx`

### Gotchas

1. **`PlanProvider` scope:** Currently mounted in the dashboard layout. `/account` layout will need its own `<PlanProvider>` wrapper if it reads plan state.
2. **Auth guard pattern:** Use `serverGetUser()` in the account layout (same as dashboard layout) — do NOT use client-side `useUser({ required: true })` as the primary guard.
3. **Stripe return URL:** Plan purchase from `/account/plans` should redirect back to `/account/plans?status=success&session_id=...` — update `successUrl` in the checkout controller or pass it as a param.
4. **`/dashboard/account` page** (`AccountAndBillingPage`) uses deprecated `planData.hasAccess` / `planData.package` flat fields — if kept, update to canonical `quotas.*` contract before building on it.
5. **`PACKAGES_URL` consumers:** `UpgradeRequiredBanner.tsx`, `NoPlanDashboard.tsx`, and anywhere else using the constant will all update automatically once `urls.ts` is changed.
