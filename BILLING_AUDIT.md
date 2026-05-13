# echo-fy Billing Architecture Audit

_Audit date: 2026-05-06. Read-only — no changes made._

---

## 1. Dashboard Routes

All routes live under `src/app/[locale]/dashboard/`.

| Route | File | What it does | Shows package/billing info? |
|-------|------|-------------|----------------------------|
| `/dashboard` | `dashboard/page.tsx` | Overview: active plan card, quota bars, quick actions, last upload. Falls back to `NoPlanDashboard` when `hasActiveInstance` is false. | Yes — plan name, quota usage, instance switcher |
| `/dashboard/upload` | `dashboard/upload/page.tsx` | File upload page for AI image analysis | No |
| `/dashboard/ai-chat` | `dashboard/ai-chat/page.tsx` | AI coach chat interface | Indirectly (token quota shown in chat widget) |
| `/dashboard/talking-head` | `dashboard/talking-head/page.tsx` | SadTalker / HeyGen video avatar generation | No |
| `/dashboard/history` | `dashboard/history/page.tsx` | Paginated upload history with report drawer | No |
| `/dashboard/account` | `dashboard/account/page.tsx` | Account info (email, name, linked accounts) | No |
| `/dashboard/billing` | `dashboard/billing/page.tsx` | Plan & Billing: add-on purchases, Stripe return handler, quota refresh | Yes — primary billing surface inside dashboard |

### Notes
- `/dashboard/billing` is the **only route that handles Stripe return URLs** (`?status=success&kind=addon&session_id=...`).
- `/dashboard` handles the main plan Stripe return (`?status=success&session_id=...`) and calls `verifySession()`.

---

## 2. Package Data Flow

### Endpoint
```
GET /api/user/check-package    (Next.js BFF — src/app/api/user/check-package/route.ts)
  → proxies to →
GET /api/user/check-package    (Express backend — controllers/userController.js)
```

### Response shape (`UserPackageResponse` — src/app/utils/api.ts:380)
```ts
{
  hasAccess: boolean;                      // primary gate: true = active plan
  needsInstanceSelection?: boolean;        // true when user has packages but none selected
  instancesCount?: number;
  package?: string;                        // planKey: "lite" | "pro" | "ultimate"
  packageInstanceId?: string;
  packageInstanceCreatedAt?: string;
  faceEnrolled?: boolean;
  faceEnrolledAt?: string | null;
  rekognitionFaceId?: string | null;
  personaKey?: string | null;

  // Canonical quota contract (current — use these)
  quotas?: {
    uploads?:   { baseLimit, addons, effectiveLimit, used, remaining, isUnlimited };
    aiTokens?:  { baseLimit, addons, effectiveLimit, used, remaining, isUnlimited };
    videos?:    { baseLimit, addons, effectiveLimit, used, remaining, isUnlimited };
  };

  // Flat deprecated fields (still present for backwards compat, all marked @deprecated)
  uploadsUsed?, uploadLimit?, addonsUploads?, addonsChat?, addonsChatTokens?,
  addonsVideos?, effectiveUploadLimit?, effectiveChatLimit?, effectiveVideoLimit?,
  tokensUsed?, chatTokensUsed?, chatRemaining?, sadtalkerVideosUsed?, ...
}
```

### Frontend cache
- **React Context** (`PlanContext`) in `src/app/dashboard/PlanContext.tsx`
- Exported as `usePlanInfo()` hook
- Fetch-level deduplication via in-flight promise in `checkUserPackage()` (utils/api.ts)
- Cache invalidated by:
  - `window.dispatchEvent(new Event("ai-auth-changed"))` — fired after login, purchase, plan select
  - `clearApiCaches()` helper followed by `refresh(true)` (resets state to loading)
- Also consumed directly (without context) by `useOverviewModel` on the dashboard overview page

### Error code
When the user has no active `PackageInstance` selected, the backend returns HTTP 409 with:
```json
{ "error": "ACTIVE_INSTANCE_REQUIRED" }
```
`PlanContext` catches this and either redirects to `/dashboard` or sets `isMissingActiveInstance: true`.

---

## 3. Pricing & Checkout

### Pricing display locations

| Location | File | Trigger |
|----------|------|---------|
| Landing page `/#packages` section | `src/app/components/packages/Packages.tsx` | Rendered in `src/app/[locale]/page.tsx` |
| In-dashboard modal | `src/app/components/dashboard/sidebar/PackagesModal.tsx` | "Packages" button at bottom of sidebar (GemIcon) — also triggerable via `window.dispatchEvent(new Event("dashboard:open-packages"))` |

**Inconsistency found:** The two pricing surfaces have different copy for the third plan:
- `Packages.tsx` (landing): `id: "ultimate"`, name `"Ultimate"`, `$399`
- `PackagesModal.tsx` (dashboard modal): `id: "ultimate"`, name `"Elite"`, `$399`

### Checkout flow

```
PackagesModal "Select X" button
  → startCheckout(plan.id, null, locale)       [src/app/utils/api.ts:308]
  → POST /api/checkout/create-checkout-session  [Next.js BFF → Express]
  → Express creates Stripe Checkout Session
  → Returns { url: "https://checkout.stripe.com/..." }
  → window.location.href = url                  (hard redirect to Stripe)
  → Stripe completes → redirects to /dashboard?status=success&session_id=...
  → Dashboard page calls verifySession(sessionId) → refreshes plan state
```

Also exists: `src/app/[locale]/checkout/page.tsx` — a standalone confirmation page at `/[locale]/checkout?packageId=X` with a "Pay with Stripe" button. This calls the same `startCheckout()`. The landing page `Packages.tsx` links each plan CTA to `/${pkg.id}` (e.g. `/lite`), which hits `src/app/[locale]/[id]/page.tsx` (the persona/package detail page), not directly to checkout.

### Stripe creation endpoint
```
POST /api/checkout/create-checkout-session
```
BFF: `src/app/api/checkout/create-checkout-session/route.ts` → proxies to Express.
Body: `{ packageId: string, locale?: string, personaKey?: string }`
Returns: `{ url: string }` (Stripe Checkout Session URL)

### Add-on flow
Separate from plan purchase. Managed in `BillingPanel` on `/dashboard/billing`.
Uses `/api/billing/addons/verify` for post-purchase verification (with exponential backoff: 2s, 3s, 5s, 5s, 5s).

---

## 4. Existing Guards

### Auth guard
- `useUser({ required: true, redirectTo: "/login" })` on the dashboard overview page
- Redirects unauthenticated users to `/login`
- **Not applied at middleware level** — each page opts in individually

### Plan/package guard (frontend)
- `PlanContext` detects `ACTIVE_INSTANCE_REQUIRED` → redirects to `/dashboard`
- Dashboard overview shows `NoPlanDashboard` when `!hasActiveInstance || isMissingActiveInstance`
- `NoPlanDashboard` links to `/#packages` (landing pricing section), **not** a dedicated dashboard billing page

**Critical gap:** Sub-routes (`/dashboard/upload`, `/dashboard/ai-chat`, `/dashboard/talking-head`) have **no frontend package guard**. A user without a plan can navigate directly to these URLs and see the full UI. The backend enforces access via `guardActiveInstanceAndFace` middleware on all Express API routes, so API calls will fail — but the page itself renders without a paywall.

### Plan guard (backend)
- `guardActiveInstanceAndFace` middleware on all `/api/analyze`, `/api/coach-chat`, `/api/render`, `/api/user` routes
- Returns 403/409 if no active PackageInstance or face not enrolled

### Middleware (Next.js)
- `src/middleware.ts` — **only** next-intl locale routing (`createMiddleware(routing)`)
- No auth check, no package check, no redirect logic
- Matcher: `['/', '/((?!api|_next|_vercel|.*\\..*).*)']` — covers all page routes

### Existing redirect logic
```
PlanContext.tsx:108-115 — if ACTIVE_INSTANCE_REQUIRED AND not already on /dashboard → router.replace("/dashboard")
dashboard/page.tsx:165-167 — if showGetStarted (no active instance) → render NoPlanDashboard
```
No existing logic that blocks `/dashboard/upload` etc. for unpaid users on the frontend.

---

## 5. Sidebar

**Component path:** `src/app/components/dashboard/sidebar/DashboardSidebar.tsx`

**Nav config:** `src/app/components/dashboard/navigation/dashboardNav.config.ts`

### Desktop sidebar items (always shown, no conditional logic)
| Item | Icon | Href | Visible desktop | Visible mobile |
|------|------|------|----------------|----------------|
| Overview | Home | `/dashboard` | Yes | Yes |
| Upload Content | UploadCloud | `/dashboard/upload` | Yes | Yes |
| AI Video Avatar | Video | `/dashboard/talking-head` | Yes | Yes |
| Packages (button) | GemIcon | — (opens PackagesModal) | Yes (hardcoded at bottom) | Yes |
| Profile menu | — | — (opens ProfileMenuButton) | Yes (hardcoded at bottom) | Yes |

### Settings-only items (hidden from sidebar — appear only inside SettingsModal)
| Item | Key | Href |
|------|-----|------|
| Upload History | `history` | `/dashboard/history` |
| Account Info | `account` | `/dashboard/account` |
| Plan & Billing | `billing` | `/dashboard/billing` |

**Conditional logic:** None. All items always rendered regardless of plan status, `hasAccess`, or `faceEnrolled`. The sidebar never hides or locks items based on package.

### Mobile
- `MobileBottomBar.tsx` shows: Overview, Upload Content, AI Video Avatar, Settings (opens settings modal)
- `/dashboard/billing` is not accessible from mobile nav — only via SettingsModal

---

## 6. i18n

- **Library:** next-intl (`middleware.ts` uses `createMiddleware(routing)`)
- **Routing config:** `src/i18n/routing.ts`
- **Locales:** `en`, `el` (Greek), `es` (Spanish), `it` (Italian)
- **Message files:** `src/messages/{en,el,es,it}.json`
- **Pattern for adding keys:**
  ```ts
  // In component:
  const t = useTranslations("namespaceName");
  t("keyName")           // simple key
  t("section.key")       // nested key
  t.raw("plans.lite")    // raw object (used in Packages.tsx for plan copy)
  ```
  Add the key to all 4 JSON files (`en.json` as source, copy to el/es/it with translated values).
- **Dashboard nav labels** use `useTranslations("dashboardNav")` with keys `overview`, `upload`, `talkingHead`

---

## Recommendations for Paywall Implementation

### Best place to add the guard logic

**Option A — Next.js Middleware (recommended for hard blocks):**
Extend `src/middleware.ts` to check the session cookie and redirect unauthenticated users at the edge. For plan checks, middleware cannot easily call MongoDB, so the pattern would be:
- Auth check in middleware (JWT cookie verify) → redirect to `/login`
- Plan check in a layout component (reads PlanContext) → show paywall UI or redirect

**Option B — Dashboard layout component:**
Add a `layout.tsx` to `src/app/[locale]/dashboard/` that wraps all dashboard routes. On mount, read `PlanContext` and if `!hasActiveInstance`, either redirect to `/dashboard` (which shows `NoPlanDashboard`) or render an inline paywall overlay. This is the lowest-effort approach and works without touching middleware.

**Recommended:** Use **Option B** (layout-level guard) for plan checks. It keeps the guard co-located with the dashboard routes and reuses the already-loaded `PlanContext` data. Middleware is better reserved for auth (unauthenticated) checks.

### Whether to reuse existing `/dashboard/billing` or create new page

`/dashboard/billing` **already exists** and handles add-ons. It is the right place to send users who need to upgrade — no new page needed. The missing piece is:
1. Making it easily navigable (it's currently hidden behind SettingsModal — add it to the sidebar or expose a direct link from paywalled pages)
2. Adding a plan purchase flow to `BillingPanel` (currently it only shows add-ons for existing plan holders)

**Do not use** `NoPlanDashboard`'s current link (`/#packages`) — it sends users away from the dashboard to the landing page, breaking the in-app experience.

### Conflicts and refactors needed before implementation

1. **Inconsistent plan names:** `Packages.tsx` calls it "Ultimate"; `PackagesModal.tsx` calls it "Elite". Reconcile before adding a paywall that references plan names.

2. **Deprecated `UserPackageResponse` fields:** The response has 15+ deprecated flat fields alongside the canonical `quotas` object. Before adding new paywall consumers, ensure they read only from `quotas.*` to avoid perpetuating the deprecated shape.

3. **`NoPlanDashboard` CTA destination:** Currently links to `/#packages` (landing). Should link to `/dashboard/billing` or open `PackagesModal` directly for a better in-app flow.

4. **`/dashboard/billing` discoverability:** `billing` nav item has `showDesktop: false, showMobile: false, settingsOnly: true`. For a paywall to direct users there, it either needs a direct link or the nav config needs to make it accessible.

5. **No `layout.tsx` in `/dashboard/`:** There is no shared layout file for dashboard sub-routes. Creating one is the prerequisite for adding a layout-level plan guard — but verify it doesn't conflict with `AppShell.tsx` (the existing shell component that wraps dashboard pages).
