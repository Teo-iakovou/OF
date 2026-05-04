# echo-fy Pre-Launch Audit Report
**Date:** 2026-05-04
**Auditor:** Claude Code
**Stack:** Next.js 16 (BFF) · Express.js · MongoDB Atlas · Stripe · OpenAI · HeyGen · AWS Rekognition · Google Vision · RunPod/SadTalker

---

## Executive Summary

| Severity | Count |
|---|---|
| 🔴 Blockers | 5 |
| 🟠 High | 9 |
| 🟡 Medium | 9 |
| 🟢 Low | 5 |

**Launch recommendation: NO-GO**

Two findings alone make this a hard NO-GO: the authentication system has no password — any person who knows a user's email address can log in as that user — and any authenticated user can grant themselves unlimited credits via an unguarded admin endpoint. Both are remotely exploitable and will result in account takeovers and free-credit abuse within hours of public launch.

---

## 🔴 Blockers (must fix before launch)

---

### SECURITY-1: Authentication system has no password

- **File:** `backend/controllers/authController.js:7-86`
- **Description:** The login endpoint accepts an email address and immediately issues a JWT session cookie without any password, OTP, or verification step. Lines 31-43 auto-create an account for any unrecognised email. The login also accepts GET requests with email in the query string (`router.get("/login", login)`), meaning authentication can be triggered via a crafted `<img src>` or `<a href>` tag in a phishing email — no user interaction required beyond visiting a URL.
- **Risk:** Any attacker who knows (or guesses) a victim's email gains full access to their account, uploaded images, generated content, payment history, and facial biometric data.
- **Fix:** Implement a real authentication mechanism before launch. Options:
  1. **Magic-link email** (simplest): On login, send a time-limited signed link to the provided email; only set the session cookie after the link is clicked.
  2. **Password**: Hash with `bcryptjs` (already in dependencies), store hash in User model, verify on login.
  3. **OAuth-only**: Remove the email/password flow and require Google OAuth (already partially wired).
  Regardless of choice, remove the `GET /login` route that accepts credentials in the query string.

---

### SECURITY-2: Any authenticated user can grant themselves arbitrary credits

- **File:** `backend/routes/userRoutes.js:35`, `backend/controllers/userController.js:690-743`
- **Description:** `POST /api/user/addons` is protected by `requireAuth` but has no admin check. Any logged-in user can send `{ "uploads": 9999, "chat": 9999, "sadtalkerVideos": 9999 }` and immediately receive thousands of free credits on their active package instance. The function increments the caller's own instance — but since any user can call it, every user can self-grant unlimited resources.
- **Risk:** Complete bypass of the monetisation model. Every paying customer immediately has a reason not to pay.
- **Fix:** Add an `isAdmin` guard at the top of `grantAddons`:
  ```js
  const user = await User.findById(req.user.id);
  if (!user?.isAdmin) return sendErr(req, res, 403, "Forbidden");
  ```
  Consider moving this endpoint to a separate `/api/admin` router that requires admin auth.

---

### SECURITY-3: No rate limiting on the login endpoint

- **File:** `backend/routes/auth.js:5-6`
- **Description:** `POST /api/auth/login` (and `GET /api/auth/login`) have no rate limiter. Combined with SECURITY-1, an attacker can enumerate all user emails at unlimited speed. Even with a password-based fix applied, the absence of rate limiting allows credential stuffing.
- **Risk:** Automated account takeover at scale; enumeration of registered emails.
- **Fix:** Apply `express-rate-limit` (already in `package.json`) to auth routes:
  ```js
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true });
  router.post("/login", authLimiter, login);
  ```
  Add `standardHeaders: true` and consider `skipSuccessfulRequests: false`.

---

### PAYMENTS-1: `verify-session` endpoint has no authentication

- **File:** `backend/routes/checkout.js:17`
- **Description:** `GET /api/checkout/verify-session?session_id=cs_...` has no `requireAuth` middleware. Any unauthenticated party who obtains a Stripe checkout session ID (which appears in the browser URL bar and therefore in server logs, referrer headers, and browser history) can call this endpoint. The endpoint then attempts to apply the package to whatever email is stored in the Stripe session metadata — in other words, it acts as a fallback "create package for user" trigger without validating who is calling it.
- **Risk:** While idempotency via `WebhookEvent` prevents duplicate provisioning, unauthenticated access means:
  1. Attackers can probe valid session IDs.
  2. A race condition exists where an attacker calls verify-session before the rightful user, potentially stealing the package if user lookup or creation logic behaves unexpectedly.
- **Fix:** Add `requireAuth` to the verify-session route. Validate that `req.user.email === session.metadata.email` inside `verifyCheckoutSession` before applying the package.

---

### SECURITY-4: CORS wildcard flag present in production code path

- **File:** `backend/index.js:57, 69-71`
- **Description:** `CORS_ALLOW_ALL=true` reflects any request origin with `credentials: true`, completely defeating CORS protections. This flag is read from environment variables with no guard preventing it from being set in production.
- **Risk:** If misconfigured in production (e.g., copied from a staging `.env`), any website on the internet can make credentialed API requests on behalf of logged-in users — classic CSRF via CORS.
- **Fix:** Remove the `CORS_ALLOW_ALL` escape hatch entirely, or at minimum add a hard guard:
  ```js
  if (allowAllCors && process.env.NODE_ENV === 'production') {
    throw new Error('CORS_ALLOW_ALL must not be set in production');
  }
  ```

---

## 🟠 High-Priority

---

### SECURITY-5: JWT expires in 30 minutes; cookie persists for 30 days

- **File:** `backend/utils/jwt.js:11,45`
- **Description:** `TOKEN_TTL_MIN` defaults to 30 minutes (JWT `exp` claim). The session cookie `maxAge` is `60 * 60 * 24 * 30 * 1000` — 30 days. After 30 minutes, the JWT in the cookie is invalid but the cookie is still sent on every request. The server silently sets `req.user = null`, causing the user to appear unauthenticated until they manually log in again. There is no token refresh mechanism.
- **Risk:** Users are silently logged out every 30 minutes with no explanation, causing high frustration and support load.
- **Fix:** Either (a) set `TOKEN_TTL_MIN` to match the intended session length (e.g., 7 days) and update the cookie maxAge accordingly, or (b) implement a sliding-window refresh: return a new token on each request if the existing one has < 50% TTL remaining.

---

### SECURITY-6: No security headers on Express backend

- **File:** `backend/index.js` (no helmet or manual headers)
- **Description:** The Express backend serves no security headers: no `X-Frame-Options`, no `X-Content-Type-Options`, no `Strict-Transport-Security`, no `Content-Security-Policy`. The Next.js `next.config.js` also specifies no custom headers.
- **Risk:** Clickjacking, MIME sniffing attacks, and missing HTTPS enforcement.
- **Fix:** Add `helmet` to Express: `npm install helmet` then `app.use(helmet())`. Add Next.js security headers in `next.config.js` under `headers()`.

---

### PERF-1: HeyGen video generation blocks an Express worker thread for up to 10 minutes

- **File:** `backend/services/heygen/heygenService.js:133-186`, `backend/routes/heygenRoutes.js:39`
- **Description:** `generateLipSyncVideo` polls HeyGen's status API every 5 seconds for up to 10 minutes inside a synchronous `await` within an HTTP request handler. During this time, the Node.js event loop is not blocked (it's async), but the HTTP response is held open and the connection consumes a socket. Under concurrent load, this results in connection exhaustion and effectively DoS the service.
- **Risk:** 10 simultaneous video-generation requests hold 10 sockets open for 10 minutes each. Most hosting platforms (Render, Railway) have socket/connection limits and will timeout or kill the process.
- **Fix:** Convert to an async job pattern: queue the job, return a `jobId` immediately, let the client poll `GET /api/heygen/status/:jobId`. This is the pattern already partially implemented in `backend/routes/render-internal.js`.

---

### OBSERVABILITY-1: No error monitoring service (Sentry / Datadog)

- **File:** Entire codebase — no APM/monitoring dependency found
- **Description:** There is no structured error monitoring, alerting, or distributed tracing. Errors are `console.error` to stdout only. On Render or similar platforms, these logs are ephemeral and not searchable.
- **Risk:** Payment failures, auth errors, and API outages will go unnoticed until users complain. MTTR (mean time to recovery) will be very high.
- **Fix:** Add Sentry to both Express and Next.js: `npm install @sentry/node @sentry/nextjs`. Configure at the top of `backend/index.js` before any other imports, and in `sentry.server.config.ts` for Next.js.

---

### OBSERVABILITY-2: No global Express error handler

- **File:** `backend/index.js` (no 4-argument middleware registered)
- **Description:** Express has no `(err, req, res, next)` error handler registered. Unhandled exceptions from route handlers will result in the default Express behavior: a plain-text stack trace response with a 500 status code. In production, this leaks internal file paths and code structure.
- **Risk:** Stack trace disclosure; unhandled errors return non-JSON responses that break frontend error parsing.
- **Fix:** Add before `app.listen`:
  ```js
  app.use((err, req, res, _next) => {
    console.error('[unhandled]', err);
    res.status(err.status || 500).json({ error: 'Internal server error', requestId: req.requestId });
  });
  ```

---

### LEGAL-1: No age verification for an adult-content platform

- **File:** Entire auth flow; `src/app/[locale]/terms/page.tsx`
- **Description:** The platform explicitly targets OnlyFans creators (adult content). There is no 18+ age gate at sign-up or login. The Terms of Service page has no explicit minimum age clause.
- **Risk:** Operating an adult-content AI platform without age verification is illegal in multiple EU jurisdictions and exposes the company to significant regulatory liability.
- **Fix:** Add a mandatory age confirmation checkbox to the sign-up flow. Add a "You must be 18+ to use this service" clause to the Terms. Consider a date-of-birth field at sign-up.

---

### LEGAL-2: Privacy Policy does not name third-party data processors

- **File:** `src/app/[locale]/privacy/page.tsx`
- **Description:** The Privacy Policy mentions "AI providers" and "cloud infrastructure" but does not name specific vendors. Under GDPR Article 13, data subjects must be informed of all third-party recipients.
- **Risk:** Non-compliant privacy disclosure. Users cannot exercise their rights (e.g., to request deletion from OpenAI) without knowing their data flows there.
- **Fix:** Explicitly list: OpenAI (caption generation), HeyGen (video generation), AWS Rekognition (facial recognition), Google Cloud Vision (image analysis), Stripe (payments), MongoDB Atlas (database hosting). Link to each vendor's privacy policy/DPA. Note that biometric face data is processed by AWS Rekognition.

---

### LEGAL-3: No EU cooling-off / refund policy

- **File:** `src/app/[locale]/terms/page.tsx`
- **Description:** EU Consumer Rights Directive requires a 14-day withdrawal right for digital services where the consumer has not yet started using the service. The Terms of Service has no explicit refund policy.
- **Risk:** Regulatory non-compliance for EU customers. Stripe disputes and chargebacks from customers invoking their legal rights.
- **Fix:** Add a refund policy section to the Terms. State clearly whether the 14-day right applies (it typically does not once a digital service has been used, but this waiver must be explicitly consented to at purchase).

---

### UX-1: No transactional email service configured

- **File:** Entire backend — no email dependency found
- **Description:** No email sending is configured anywhere (no Resend, SendGrid, SES, Nodemailer, etc.). This means: no welcome email on sign-up, no payment receipt/confirmation, no failed payment notification, and no password reset flow (once passwords are added per SECURITY-1 fix).
- **Risk:** Users who pay and don't immediately see their subscription activated have no recourse. Failed payment recovery is impossible. Support volume will be very high.
- **Fix:** Integrate Resend (recommended for Next.js) or SendGrid. At minimum: send a payment confirmation email from the Stripe webhook handler, and a welcome email on first login.

---

## 🟡 Medium

---

### DB-1: MongoDB Atlas backup status not confirmed

- **File:** N/A — Atlas Console setting
- **REQUIRES MANUAL VERIFICATION:** Log into MongoDB Atlas → your cluster → "Backup" tab. Verify that:
  1. Continuous backup or Scheduled Snapshots are enabled.
  2. Retention period is at least 7 days.
  3. A restore has been tested at least once.
- **Risk:** Data loss with no recovery path in the event of accidental deletion or corruption.

---

### DB-2: Implicit global `mongoose` variable in analyzeController

- **File:** `backend/controllers/analyzeController.js:7`
- **Description:** `mongoose = require("mongoose")` is missing the `const` keyword, silently creating a global variable. In strict mode this would throw; in non-strict mode it pollutes the global scope.
- **Fix:** Change to `const mongoose = require("mongoose");`

---

### DB-3: `Result` query pagination has no upper bound

- **File:** `backend/controllers/analyzeController.js:1136-1140`
- **Description:** `limit: Number(limit)` is taken directly from `req.query.limit` without capping. A caller can pass `limit=100000` and retrieve all results in one query.
- **Fix:** Cap the limit: `Math.min(Number(limit) || 10, 100)`.

---

### DB-4: No soft delete — user data is immediately destroyed

- **File:** `backend/controllers/analyzeController.js:1153`
- **Description:** `Result.findOneAndDelete` performs a hard delete with no recovery path. There is no `deletedAt` flag or trash/recycle concept.
- **Fix:** Consider adding `deletedAt: Date` to the Result schema and filtering `{ deletedAt: null }` in queries, with a cleanup job purging old soft-deleted records after 30 days.

---

### PERF-2: `multer()` in userRoutes uses in-memory storage with no file size limit

- **File:** `backend/routes/userRoutes.js:22`
- **Description:** `const upload = multer()` — no `dest`, no `limits`. Files are stored in RAM. The heygen/consume and sadtalker/consume endpoints accept image uploads. A user could upload a 100MB file and crash the Node.js process with an OOM error.
- **Fix:**
  ```js
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  });
  ```

---

### PERF-3: HeyGen in-memory `talkingPhotoCache` is lost on restart

- **File:** `backend/services/heygen/heygenService.js:6`
- **Description:** The in-process `Map` is cleared on every server restart/deploy. The DB-persisted `heygenTalkingPhotoId` on `PackageInstance` is the correct fallback, but the cache adds unnecessary complexity and inconsistency.
- **Fix:** Remove `talkingPhotoCache` entirely. Rely solely on the DB-persisted `heygenTalkingPhotoId` which already handles caching correctly.

---

### INTEG-1: SadTalker/RunPod fails silently if unconfigured

- **File:** `backend/services/sadtalker/runpodManager.js:33-46`
- **Description:** If `RUNPOD_API_KEY` and `SADTALKER_RUNPOD_ENDPOINTS` are both missing, a `console.warn` is logged but the application starts normally. Any SadTalker job submitted will fail at runtime with no pre-flight warning visible to operators.
- **Fix:** At startup, validate that at least one of the two is configured if SadTalker is enabled. Fail fast with a clear error message.

---

### UX-2: No SEO metadata (title, OG tags, sitemap, robots.txt)

- **File:** `src/app/layout.tsx`, `public/` directory
- **Description:** The root layout exports only `viewport`, not `metadata`. No `<title>`, `<meta description>`, Open Graph tags, `sitemap.xml`, or `robots.txt` exist. The public directory contains raw video files (`.mp4`) committed to the repository.
- **Fix:**
  - Add `export const metadata: Metadata = { title: 'Echofy', description: '...' }` to `layout.tsx`.
  - Create `src/app/sitemap.ts` (Next.js 13+ convention).
  - Create `public/robots.txt`.
  - Move large video files to Cloudflare R2 / CDN and reference them via URL.

---

### UX-3: `not-found.tsx` uses old/inconsistent branding

- **File:** `src/app/not-found.tsx`
- **Description:** The 404 page uses `bg-gray-900`, `text-pink-400`, and `bg-pink-600` — the old branding. The rest of the app uses the `--hg-*` design token system (dark navy + cyan accent). No 500 error page exists at all.
- **Fix:** Restyle the 404 page using the current design tokens. Add a `src/app/error.tsx` (Next.js App Router error boundary) for 500-level errors.

---

## 🟢 Low

---

### LOW-1: JWT token returned in JSON response body alongside cookie

- **File:** `backend/controllers/authController.js:81`
- **Description:** `return res.json({ ..., token })` returns the raw JWT in the response body. The token is already set in an `httpOnly` cookie, so clients should not need it. Returning it in the body risks a frontend developer storing it in `localStorage` (which would defeat the httpOnly protection).
- **Fix:** Remove `token` from the JSON response body. The cookie alone is sufficient.

---

### LOW-2: Frontend `package.json` name is `"onlyfans-platform"`

- **File:** `package.json:2`
- **Description:** The npm package name still reflects the old project name. Not a security issue but could cause confusion in CI/CD pipelines, Sentry project names, etc.
- **Fix:** Change to `"name": "echofy"`.

---

### LOW-3: No MongoDB connection pool configured

- **File:** `backend/utils/db.js:117`
- **Description:** `mongoose.connect(uri, { serverSelectionTimeoutMS })` uses Mongoose's default pool size of 5. Under load with concurrent AI-heavy requests, the pool can saturate.
- **Fix:** Add `maxPoolSize: 20` (or appropriate for your Render plan's RAM): `mongoose.connect(uri, { serverSelectionTimeoutMS, maxPoolSize: 20 })`.

---

### LOW-4: Large video files committed to `public/` directory

- **File:** `public/*.mp4` (4 files)
- **Description:** Several large `.mp4` files are committed to the repository and served from Next.js public directory. This increases Docker image / deployment size and increases cold-start time.
- **Fix:** Upload to Cloudflare R2 or a CDN, reference via URL.

---

### LOW-5: `debug` routes have no authentication in non-production environments

- **File:** `backend/routes/debug.js`, `backend/index.js:97-99`
- **Description:** The `/api/debug` routes (including `repair-faceid`) are only registered when `NODE_ENV !== 'production'`, which is correct. However, on staging environments these routes are fully open — any user (authenticated or not) can call `POST /api/debug/repair-faceid` and modify any user's face enrollment.
- **Fix:** Add `requireAuth` and an `isAdmin` check to all debug routes, even in non-production environments.

---

## ✅ Passed Checks

- **Stripe webhook signature verification** is correctly implemented using `stripe.webhooks.constructEvent` with the signing secret (`checkoutController.js:252`).
- **Webhook idempotency** is properly handled via the `WebhookEvent` model with `eventId` deduplication and `$setOnInsert` upserts — duplicate events are safely ignored.
- **CORS origin allowlist** is env-driven and defaults to `localhost:3000`. The CORS config correctly handles `credentials: true` and does not default to `*`.
- **Cookie flags** are correctly set: `httpOnly: true`, `secure: true` (in production), `sameSite: 'lax'`.
- **IDOR prevention on user data**: `analyzeController`, `conversationController`, and quota middleware all scope DB queries to `req.user.id` or `userId: user._id`, preventing user A from reading user B's data.
- **MongoDB ObjectId validation** is applied before all `findById` calls using `mongoose.Types.ObjectId.isValid()`.
- **File type validation** in `analyzeController` uses `file-type` for magic-byte detection, not just MIME header trust.
- **Quota atomicity** in `analyzeController` uses `findOneAndUpdate` with `$expr` and `$inc` in a single atomic operation — no double-spend race condition.
- **Input validation with Zod** is used in `analyzeController` (`analyzeReqSchema`) and addon type is validated against an explicit allowlist (`ALLOWED_ADDON_TYPES`).
- **GDPR cookie consent banner** exists (`ConsentBanner.tsx`, `ConsentContext.tsx`) with a preferences modal.
- **Privacy Policy, Terms of Service, and Cookie Policy** pages exist and are accessible.
- **Custom 404 page** exists (`src/app/not-found.tsx`).
- **No `dangerouslySetInnerHTML`** usage found in the entire Next.js frontend.
- **No hardcoded API keys or secrets** found in source files (`.env` files are correctly listed in `.gitignore`).
- **Debug routes gated to non-production** environment via `NODE_ENV !== 'production'`.
- **HeyGen route protected by `INTERNAL_SECRET`** — only callable from the Next.js BFF layer, not directly from clients.
- **render-internal route protected by `WORKER_TOKEN`** — correctly authenticated for the RunPod worker.

---

## Recommendations Summary

### Top 3 things to do TODAY (before any public launch)

1. **Fix authentication (SECURITY-1):** Implement magic-link email or password authentication. This is the most critical vulnerability — launch with the current system and accounts will be taken over within hours.
2. **Add admin guard to grantAddons (SECURITY-2):** A one-line fix that prevents any logged-in user from giving themselves unlimited credits.
3. **Add rate limiting to /api/auth/login (SECURITY-3):** Copy the `chatLimiter` pattern from `coach-chat.js` — it takes 10 minutes and directly contains the blast radius of SECURITY-1.

### Top 5 things to do in Week 1 post-launch

1. **Integrate Sentry** into both Express and Next.js for error monitoring and alerting.
2. **Add a global Express error handler** to prevent stack trace disclosure.
3. **Add EU refund policy and 18+ age verification** to the Terms and sign-up flow.
4. **Integrate a transactional email service** (Resend recommended) — at minimum: payment confirmations and welcome emails.
5. **Add security headers** via `helmet` on Express and `headers()` in `next.config.js`.

### Top 5 things to plan for next quarter

1. **Token refresh mechanism**: Move from 30-minute JWT tokens to a proper sliding-session or refresh-token pattern.
2. **Async video generation**: Decouple HeyGen polling from the HTTP request cycle using a job queue (BullMQ is already in `package.json`).
3. **MongoDB Atlas backup verification**: Confirm backup is enabled, test a restore, set up automated backup alerts.
4. **GDPR data subject rights**: Build a self-service "download my data" and "delete my account" flow to comply with GDPR Articles 17 and 20.
5. **DPA agreements**: Confirm Data Processing Agreements are signed with OpenAI, HeyGen, AWS, Google Cloud, Stripe, and MongoDB Atlas.
