# Error Display Audit

## 1. Error display patterns found

| File | Line | Current display | Source | Raw JSON risk? |
|------|------|----------------|--------|----------------|
| `src/app/components/auth/AuthForm.tsx` | 197 | `<p className="text-sm text-red-400">{error}</p>` | `res.text()` on non-ok fetch — raw response body used as-is | **YES — the reported bug** |
| `src/app/[locale]/account/profile/page.tsx` | 119–121 | Styled rose card `{saveError}` | `err.message` from `updateUserProfile()` | No — uses fetchJson helper |
| `src/app/components/dashboard/upload/ReportDrawer.tsx` | 179 | Rose card `{error}` | `e?.message` from RequestError | No |
| `src/app/components/dashboard/report/ReportDrawer.tsx` | 247 | Rose card `{error}` | `e?.message` from RequestError | No |
| `src/app/components/email/EmailModal.tsx` | 124 | `<div className="text-red-500 mb-4 text-sm">{error}</div>` | Client-side validation only, hardcoded strings | No |
| `src/app/components/dashboard/SelectActiveInstance.tsx` | 100 | `<p className="text-sm text-red-300">{error}</p>` — bare text, no card | `err.message` — could surface API error text | Low |
| `src/app/components/AIchat/CoachChat.tsx` | 632 | Rose card `{error}` | `data.error \|\| data.message \|\| hardcoded fallback` | Low — has fallback |
| `src/app/components/uploads/FileUpload.tsx` | 454–496 | Structured card via `mapErrorToUserMessage()` — title + message + action link + debug accordion | `errorMeta.code` mapped to friendly strings | No — best pattern in app |
| `src/app/components/render/UploadTalkingHead.tsx` | 373 | Rose card `{error}` | Mapped message string set by component | No |
| `src/app/[locale]/checkout/page.tsx` | 51 | `<h1 className="text-3xl text-red-500 font-bold">No package selected.</h1>` | Missing query param | No — but dev-era styling |
| `src/app/[locale]/checkout/page.tsx` | 75 | `<p className="text-red-400">Invalid package</p>` | Invalid `packageId` param | No — but dev-era copy |

### How errors reach the UI in each case

Most components use `api.ts` → `readJsonOrText()` → throws `new Error(data.error || data.message)`, so `err.message` already holds the extracted string from `{ error: "..." }`. These are safe.

**The only exception is `AuthForm.tsx`**, which uses a bare `fetch()` and calls `res.text()` directly on the error response:

```ts
// AuthForm.tsx:66–68
if (!res.ok) {
  const msg = await res.text();  // ← reads raw body: '{"error":"Too many attempts..."}'
  throw new Error(msg || t(...));
}
```

The BFF routes (`/api/auth/login`, `/api/auth/register`) proxy the backend JSON response verbatim as `application/json`. So `res.text()` returns the raw JSON string, not just the message. That string becomes `err.message`, which is then displayed directly in the DOM.

---

## 2. Existing reusable components

**None.** There is no shared `<Alert>`, `<Banner>`, `<ErrorMessage>`, or `<Toast>` component in `src/app/components/`.

All errors are either:
- **Inline state** — `useState<string | null>(null)` + conditional JSX with hand-rolled red/rose styling
- **`sonner` toast** — used in 5 places already (profile save, feedback, history delete, settings save, report feedback)

**Toast libraries installed (all three are in `package.json`):**

| Library | Version | Actually used? |
|---------|---------|---------------|
| `sonner` | `2.0.7` | **Yes** — `SonnerToaster` mounted in app layout; `toast()` used in 5 files |
| `react-hot-toast` | `2.5.2` | **No** — installed, zero imports found |
| `react-toastify` | `11.0.3` | **No** — installed, zero imports found |

`SonnerToaster` (`src/app/components/notifications/SonnerToaster.tsx`) wraps `<Toaster richColors position="top-center" />` and is already mounted in the app layout. **Sonner is the established choice.**

---

## 3. Backend error response shapes

**Consistent shape: YES.** All backend errors flow through `sendErr()`:

```js
// backend/utils/sendErr.js
function sendErr(req, res, status, message, extra) {
  const payload = { error: message, requestId: req.requestId || null };
  if (extra) Object.assign(payload, extra);
  return res.status(status).json(payload);
}
```

Result: `{ error: string, requestId: string | null, ...extra? }`

**Rate limiters** use `res.status(429).json({ error: message })` directly — same shape but no `requestId`.

**No `{ message: string }` shape** anywhere in the backend. The string key is always `error`.

**Variations found:**

| Controller | Response shape | Notes |
|-----------|---------------|-------|
| `authController` | `{ error, requestId }` via `sendErr` | Login/signup/me |
| `checkoutController` | `{ error, requestId, ...extra }` via `sendErr` | Checkout errors |
| `rateLimiters` | `{ error }` | No requestId (bypasses sendErr) |
| Upload/analysis controllers | `{ error, requestId, code?, feature?, plan? }` | Extra fields for quota errors |
| Chat controller | `{ error, action?, quota? }` on 402 | Extra fields for limit data |

All frontend `api.ts` helpers correctly extract `data.error` after parsing. The only caller that doesn't is `AuthForm.tsx`.

---

## 4. Worst offenders (top 5)

1. **`src/app/components/auth/AuthForm.tsx:67`** — Uses `res.text()` on error response instead of parsing JSON. Rate-limited users (429) see literal `{"error":"Too many attempts, please try again in 15 minutes"}` rendered in the DOM. Affects every login/signup failure that goes through the rate limiter. **This is the reported bug.**

2. **`src/app/[locale]/checkout/page.tsx:51`** — `<h1 className="text-3xl text-red-500 font-bold">No package selected.</h1>` — Large red heading, dev-era copy, no recovery action, no redirect. Users who land on `/checkout` without a `packageId` query param see this. Should redirect or show a proper error page.

3. **`src/app/[locale]/checkout/page.tsx:75`** — `<p className="text-red-400">Invalid package</p>` — Bare unstyled text for an invalid `packageId`. No explanation or CTA. Also dev-era; this whole page is a prototype-quality shell.

4. **`src/app/components/dashboard/SelectActiveInstance.tsx:100`** — `<p className="text-sm text-red-300">{error}</p>` — No card/border styling; error text floats loosely in a card that contains other content. Also if `err.message` ever surfaces an API-style error (which is possible if `fetchActivePackageInstances` throws with a non-extracted message), it could show semi-technical text.

5. **`src/app/components/email/EmailModal.tsx:124`** — `<div className="text-red-500 mb-4 text-sm text-left">{error}</div>` — Uses `text-red-500` (pure Tailwind red, not the design system's rose variables). No border/background card. Inconsistent with every other error display in the app.

---

## 5. Common user-facing errors (top 10)

| Scenario | Current message | Friendly? |
|----------|----------------|-----------|
| Login: invalid email/password | "Invalid email or password" | Yes |
| Login/signup: rate limited (5 attempts) | `{"error":"Too many attempts, please try again in 15 minutes"}` (raw JSON) | **No — raw JSON bug** |
| Signup: email already taken | "Unable to create account" (generic, by design — prevents enumeration) | Yes/~ (intentionally vague) |
| Signup: validation failure | "Invalid input" (returned by Zod parse guard) | ~ (too terse, no field info) |
| Upload: quota exceeded | Mapped via `mapErrorToUserMessage(UPGRADE_REQUIRED)` → friendly card with CTA | Yes — best in class |
| Upload: face mismatch | "Face verification failed. This photo does not match your enrolled face." | Yes |
| Upload: file too large | Client-side: "File exceeds the 10 MB limit." | Yes |
| Upload: network/server error | "Upload failed. Please try again." | Yes |
| AI chat: monthly token limit (402) | "You've reached your plan's chat limit." + credits modal | Yes |
| AI chat: rate limit (429) | `data.message \|\| data.error \|\| "You're sending messages too fast. Try again shortly."` | Yes — has good fallback |
| Video gen: out of credits | Inline empty state + OutOfCreditsModal | Yes |
| Profile save: API failure | Inline rose card with `err.message` | Yes (message is extracted) |

---

## Recommendations

### Fix the reported bug — one line change in AuthForm

```ts
// BEFORE (AuthForm.tsx:67–68)
const msg = await res.text();
throw new Error(msg || t(...));

// AFTER — parse JSON and extract .error field
let msg: string;
try {
  const data = await res.json();
  msg = (typeof data?.error === "string" ? data.error : null) ?? "";
} catch {
  msg = "";
}
throw new Error(msg || t(...));
```

This is the **only change needed to fix the reported bug.** All other inline `{error}` displays are already showing pre-extracted strings.

### Should we install a toast library?

**No — Sonner is already installed, mounted, and in use.** Remove `react-hot-toast` and `react-toastify` from `package.json` (they're dead weight). Use `sonner`'s `toast.error()` for any new error patterns.

### Should we build a shared `<Alert>` component?

**Yes, eventually.** The inline error pattern is repeated ~8 times with slightly different styling (some use `text-red-400`, some use `text-rose-300`, some have a border card, some are bare `<p>` tags). A single `<InlineError message={error} />` component would standardize this. But it's cosmetic — not urgent.

### Phased approach

**Phase 1 — Quick win (fix reported bug, ~5 min):**
- `AuthForm.tsx:67` — Parse `res.json()` instead of `res.text()`, extract `.error` field.

**Phase 2 — Styling cleanup (cosmetic, ~1–2 hours):**
- `SelectActiveInstance.tsx:100` — Wrap in a rose card to match the rest of the app.
- `EmailModal.tsx:124` — Change `text-red-500` to `text-rose-300` + add background card.
- Extract a `<InlineError>` component and use it in place of the 8 hand-rolled rose patterns.

**Phase 3 — Checkout page (deferred, needs full redesign):**
- `checkout/page.tsx` is prototype-quality. The entire page needs to be replaced with proper UI — redirect on missing `packageId`, handle `?status=cancel` from Stripe, etc. Low urgency as users rarely land here directly.

**Phase 4 — Library hygiene:**
- Remove `react-hot-toast` and `react-toastify` from `package.json` — they're installed but unused.
