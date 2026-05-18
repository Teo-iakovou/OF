# Dashboard i18n Audit — Delta (post Phase 1, 1.5, 2)

## Summary

- **Total files re-scanned**: 34
- **Files still with hardcoded English**: 19
- **Files in Phase 3 planned scope**: 4 (all confirmed, string counts added)
- **Files in Phase 4 planned scope**: 5 (adjusted — UploadTalkingHead already done; FileUpload added as critical)
- **Files NEWLY discovered (not in any existing plan)**: 10

---

## Critical
*Visible immediately on dashboard load or blocking common flows*

### `src/app/components/dashboard/sidebar/SettingsModal.tsx`
- Strings: ~45
- Reason: Settings modal is opened from the top bar gear icon — visible on every dashboard route. Tabs (Account, Usage, Plan & Billing, History), form labels, save/cancel buttons, sign-out flow.
- Sample strings: "Settings", "Account", "Usage", "Plan & Billing", "History", "First name", "Last name", "Email", "Save changes", "Cancel", "Saved", "Exit dashboard", "Sign out", "Signing out...", "Manage your profile details"
- Suggested namespace: `dashboard.settings`

### `src/app/components/dashboard/sidebar/BillingPanel.tsx`
- Strings: ~40
- Reason: Billing tab inside SettingsModal — quota info, add-on purchase buttons, error messages, plan selection. Core revenue path.
- Sample strings: "No active plan", "You need an active package to buy add-ons", "Unauthorized. Please sign in again", "Failed to select package instance", "This add-on is temporarily unavailable", "No active packages", "Uploads:", "AI Tokens:", "Videos:", "Selected", "Not selected", "Select", "Buy add-ons", "Support ID:"
- Suggested namespace: `dashboard.billing`

### `src/app/components/dashboard/sidebar/HistoryPanel.tsx`
- Strings: ~35
- Reason: History tab inside SettingsModal — upload history, video history, empty states, action buttons. Accessed on every post-upload session.
- Sample strings: "Upload History", "Photo Uploads", "Avatar Video", "Select a package", "Choose an active package to view insights for that plan", "View packages", "No insights yet", "Upload your first image to generate your first strategy", "Upload content", "Talking Head history", "Generate new", "Your generated videos will appear here", "Play"
- Suggested namespace: `dashboard.history`

### `src/app/components/dashboard/sidebar/PackagesModal.tsx`
- Strings: ~30
- Reason: Plan selection modal — revenue-critical, customer-facing. All plan names, CTAs, badges, and feature copy are hardcoded.
- Sample strings: "Plans that fit your scale", "Choose a plan and continue to checkout", "Best for", "Includes", "Key highlights", "Most popular", "Best value", "Select Lite", "Upgrade to Pro", "Upgrade to Ultimate", "Redirecting..."
- Suggested namespace: `dashboard.packages`

### `src/app/components/dashboard/FaceEnrollModal.tsx`
- Strings: ~15
- Reason: Blocking modal — user cannot proceed without completing face enrollment. Shown immediately after first purchase.
- Sample strings: "Face enrollment required", "Upload a clear, single-face photo to unlock all features for this package", "Upload face photo", "Face already enrolled for this package", "Please upload a photo with exactly one face", "No face detected", "Enrollment failed. Please try again", "Copy request ID", "Network error"
- Suggested namespace: `dashboard.faceEnroll`

### `src/app/components/dashboard/MobileBottomBar.tsx`
- Strings: ~8
- Reason: Mobile navigation bar — visible on every mobile dashboard page. Core persistent UI.
- Sample strings: "Overview", "Upload", "AI Video", "History", "Settings", "Get Credits"
- Suggested namespace: `dashboard.navigation` (extend existing `dashboardNav`)

### `src/app/components/AIchat/FloatingChatWidget.tsx`
- Strings: ~12
- Reason: Floating AI chat widget is mounted globally in LayoutClient — always visible on every dashboard page. Header, toggle button, aria labels.
- Sample strings: "AI Coach", "History", "Close", aria-label strings for toggle
- Suggested namespace: `dashboard.aiChat` (extend existing namespace)

---

## High
*Visible when navigating common dashboard routes*

### `src/app/components/AIchat/AiChatHistorySidebar.tsx`
- Strings: ~10
- Reason: Chat history sidebar within the floating widget — accessed every session by returning users. Conversation list labels, empty state, new chat button.
- Sample strings: "AI Chat History", "+ New", "No conversations yet", "Untitled", "continued", "summarized"
- Suggested namespace: `dashboard.aiChat.history`

### `src/app/components/AIchat/ContextUsedPopover.tsx`
- Strings: ~8
- Reason: Popover shown when user clicks context info in the chat input bar — used in every chat session.
- Sample strings: "Context used ·", "Uploads referenced by Sage", "Upload"
- Suggested namespace: `dashboard.aiChat.context`

### `src/app/components/AIchat/UpgradeCta.tsx`
- Strings: ~2
- Reason: Upgrade banner shown when user exhausts AI tokens — conversion-critical copy, should match locale.
- Sample strings: "You've used all your AI Chat tokens this month", "Upgrade to Pro for 3× more tokens, priority responses, and full upload history context"
- Suggested namespace: `dashboard.aiChat` (extend existing namespace)

---

## Medium
*Visible in upload flow and occasional secondary interactions*

### `src/app/components/dashboard/PlanStatusPill.tsx`
- Strings: ~7
- Reason: Status pill shown in sidebar or header area reflecting current plan/quota state. Visible on every page but small.
- Sample strings: "Checking plan…", "No active plan · 0 uploads", "No uploads left"
- Suggested namespace: `dashboard.planStatus`

### `src/app/components/render/CreationCard.tsx` *(or upload sub-component — verify path)*
- Strings: ~5
- Reason: Card component for past upload results. Shown in recents list on upload page.
- Sample strings: "No preview", "Content Strategy", "Instagram Strategy", "TikTok Strategy"
- Suggested namespace: `dashboard.upload.results`

### `src/app/components/render/RecentCreations.tsx` *(or upload sub-component — verify path)*
- Strings: ~5
- Reason: "Recent uploads" section header and empty state on upload page.
- Sample strings: "Generated Results", "Recents", "See all ›", "Create your first strategy", "Upload an image to generate a report", "Upload content"
- Suggested namespace: `dashboard.upload.recent`

---

## Low
*Rare paths, legacy, or single-string components*

### `src/app/components/dashboard/SelectActiveInstance.tsx`
- Strings: ~5
- Reason: Modal for selecting active package instance — only relevant to users with multiple package instances.
- Sample strings: "Select an active package", "Choose which package instance to use for quotas and history", "Loading packages…", "No active package instances found"
- Suggested namespace: `dashboard.instanceSelect`

### `src/app/components/AIchat/QuickPromptsBar.tsx`
- Strings: ~1
- Reason: Single label ("Suggested prompts"). Prompt text itself comes from locale keys already added in Phase 2.
- Suggested namespace: `dashboard.aiChat` (extend)

### `src/app/components/dashboard/StatsDashboard.tsx`
- Strings: ~6
- Reason: Appears to be a legacy/unused component based on import analysis. Verify before investing effort.
- Sample strings: "Upload History", "Insights", "Last Upload", "Plan Usage"
- Suggested namespace: skip until confirmed active

---

## Phase 3 Scope Confirmation

All four originally planned files are confirmed. String counts from actual file reads:

| File | Strings | Status |
|------|---------|--------|
| `SettingsModal.tsx` | ~45 | Confirmed — largest scope |
| `BillingPanel.tsx` | ~40 | Confirmed |
| `HistoryPanel.tsx` | ~35 | Confirmed |
| `PackagesModal.tsx` | ~30 | Confirmed |

**Additional files that should move into Phase 3** (newly discovered, high-visibility):

| File | Strings | Reason to include in Phase 3 |
|------|---------|-------------------------------|
| `FaceEnrollModal.tsx` | ~15 | Blocking modal — same session as settings/billing |
| `MobileBottomBar.tsx` | ~8 | Persistent nav — trivial to add alongside sidebar work |
| `FloatingChatWidget.tsx` | ~12 | Always-visible widget — should ship same time as CoachChat (Phase 2) work |
| `AiChatHistorySidebar.tsx` | ~10 | Child of FloatingChatWidget — natural pairing |
| `ContextUsedPopover.tsx` | ~8 | Child of chat input bar — natural pairing |
| `UpgradeCta.tsx` | ~2 | Tiny — add alongside other aiChat namespace work |
| `PlanStatusPill.tsx` | ~7 | Sidebar-adjacent — fits with sidebar phase |

**Revised Phase 3 total**: ~155 strings across 11 files (up from ~150 across 4).

---

## Phase 4 Scope Confirmation

| File | Strings | Status |
|------|---------|--------|
| `UploadTalkingHead.tsx` | 0 remaining | **Already fully translated** — remove from Phase 4 scope |
| `FileUpload.tsx` | ~50 | **Critical** — add to Phase 4 (main upload interface) |
| `CreationCard.tsx` | ~5 | Confirmed for Phase 4 |
| `RecentCreations.tsx` | ~5 | Confirmed for Phase 4 |

**Phase 4 revised total**: ~60 strings across 3 active files (UploadTalkingHead removed, FileUpload added).

---

## Newly Discovered Surfaces

Files not in any prior plan:

| File | Strings | Suggested Phase | Reason |
|------|---------|----------------|--------|
| `FaceEnrollModal.tsx` | ~15 | Phase 3 | Blocking enrollment modal — high impact |
| `MobileBottomBar.tsx` | ~8 | Phase 3 | Mobile persistent nav — trivial, high visibility |
| `FloatingChatWidget.tsx` | ~12 | Phase 3 | Always-visible, should ship with chat work |
| `AiChatHistorySidebar.tsx` | ~10 | Phase 3 | Child of FloatingChatWidget |
| `ContextUsedPopover.tsx` | ~8 | Phase 3 | Child of chat input |
| `UpgradeCta.tsx` | ~2 | Phase 3 | Extend aiChat namespace — 2 strings |
| `PlanStatusPill.tsx` | ~7 | Phase 3 | Sidebar-adjacent |
| `SelectActiveInstance.tsx` | ~5 | Phase 4 | Rare multi-instance path |
| `QuickPromptsBar.tsx` | ~1 | Phase 4 | Single label |
| `StatsDashboard.tsx` | ~6 | Verify first | Possibly legacy/unused |

---

## Recommended Next Action

**Adjust Phase 3 scope to include 7 additional files.**

The 4 originally planned files (SettingsModal, BillingPanel, HistoryPanel, PackagesModal) are confirmed and correct. The 7 newly discovered files are all natural companions to Phase 3 work:

- `FaceEnrollModal`, `MobileBottomBar`, `PlanStatusPill` fit with the dashboard layout/sidebar work
- `FloatingChatWidget`, `AiChatHistorySidebar`, `ContextUsedPopover`, `UpgradeCta` fit with the AI chat namespace work already established in Phase 2

Adding these 7 files to Phase 3 adds ~62 strings (bringing Phase 3 from ~150 to ~212 strings), but avoids a separate Phase 2.5 and keeps all persistent-UI work in one batch. All 7 are straightforward to translate with no architectural complexity.

Phase 4 scope remains upload-focused: `FileUpload.tsx` (~50), `CreationCard.tsx` (~5), `RecentCreations.tsx` (~5), `SelectActiveInstance.tsx` (~5), `QuickPromptsBar.tsx` (~1).

Verify `StatsDashboard.tsx` is actively used before including it anywhere.
