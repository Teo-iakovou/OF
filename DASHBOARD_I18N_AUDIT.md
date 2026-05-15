# Dashboard i18n Audit

**Scope:** All files under `src/app/[locale]/dashboard/**`, `src/app/components/dashboard/**`, `src/app/components/AIchat/**`, `src/app/components/render/**`
**Locales:** `en`, `el`, `es`, `it`
**Date:** 2026-05-15

---

## Summary

| Status | Count |
|---|---|
| Fully i18n'd | 2 |
| Partially i18n'd | 2 |
| No i18n | ~40 |

The vast majority of dashboard components have **no `useTranslations` usage** and render hardcoded English strings directly. The auth flow (`auth/` namespace) and a single credits modal (`outOfCredits` namespace) are the only fully translated areas currently active in the dashboard.

---

## Fully i18n'd (no action needed)

| File | Namespace |
|---|---|
| `src/app/components/dashboard/OutOfCreditsModal.tsx` | `outOfCredits` |
| `src/app/components/dashboard/buttons/MobileProjectNavDrawer.tsx` | `dashboardNav` |

---

## Partially i18n'd

### `src/app/components/dashboard/sidebar/DashboardSidebar.tsx`
- Uses `useTranslations("dashboardNav")` for nav item labels via `labelKey`
- **Hardcoded:** `"Packages"` (label text, lines 178 & 183), `title="Packages"` (line 163), `aria-label="Collapse sidebar"` / `aria-label="Expand sidebar"` (lines 80–81)

### `src/app/components/render/UploadTalkingHead.tsx`
- Uses `useTranslations("outOfCredits")` for out-of-credits section only
- **All other strings are hardcoded** — see HIGH severity section below

---

## Hardcoded Strings by File

Severity: **HIGH** = primary user-facing flow | **MEDIUM** = supporting UI | **LOW** = utility/internal

---

### HIGH severity

#### `src/app/[locale]/dashboard/page.tsx`
No `useTranslations`. Hardcoded:
- `"Overview"` (page heading)
- `"Dashboard"` (document title / aria)
- `"See what you can do now and jump into your next action fast."` (subheading)
- `"Could not load dashboard overview."` (error state)
- `"Retry"` (error CTA)
- `Profile ${String.fromCharCode(65 + activeIndex)}` (profile switcher label pattern)

#### `src/app/[locale]/dashboard/upload/page.tsx`
No `useTranslations`. Hardcoded:
- `"AI Content Studio"` (page heading)
- `"Create your next strategy"` (section heading)
- `"Upload one image and get platform-ready content ideas in seconds."` (subheading)
- `"Upload content"` (CTA)
- `"You don't have a package yet..."` (empty state)
- `"View plans →"` (CTA)
- `"You've used all your uploads. Upgrade your plan to continue."` (quota limit)
- `"Buy credits"` / `"Manage billing →"` (quota CTAs)
- `"Create"` (submit button)
- `"Upload an image to generate recommendations."` (placeholder)
- `"Ready to upload"` (status label)
- `"Upload quota"` (quota label)

#### `src/app/[locale]/dashboard/billing/page.tsx`
No `useTranslations`. Hardcoded:
- `"Plan & Billing"` (page heading)
- `"Manage add-ons and package profiles."` (subheading)
- `"Add-on purchase completed. Your quotas are refreshing."` (success notice)
- `"Add-on purchase canceled."` (cancel notice)
- `"Applied ✓"` / `"Pending (refreshing)"` / `"Could not verify add-on yet. Please refresh."` (verify states)
- `"Payment received, add-on still processing."` (pending state)
- `"Refresh"` / `"Contact support"` (action buttons)

#### `src/app/[locale]/dashboard/account/page.tsx`
No `useTranslations`. Hardcoded:
- `"Account"` (page heading)
- `"Manage your profile and security."` (subheading)
- `"Profile"` (section label x2)
- `"Security"` (section label x2)
- `"Signing out will return you to the login screen."` (security note)
- `"Log Out"` (button)
- `"Plan"` / `"Plan Status"` (section labels)
- `"Current Plan:"` / `"Uploads Remaining:"` / `"Expires:"` (data labels)
- `"Manage billing →"` (link)
- `"No active plan found."` (empty state)
- `"Not signed in."` / `"No security actions available."` (fallback messages)

#### `src/app/components/AIchat/CoachChat.tsx`
No `useTranslations`. Most extensively hardcoded file. Includes:
- All `FALLBACK_PROMPT_GROUPS` prompt text (~4 categories, ~4 prompts each)
- `"Start your conversation..."` (empty state heading)
- `"Export Brief"` (button)
- `"Context window nearly full."` / `"Monthly limit reached"` (banners)
- `"Start new chat"` / `"Summarize and continue"` (context limit actions)
- `"buy tokens"` / `"upgrade plan"` (inline CTA links)
- Upgrade CTA card title and body copy
- `"Suggestions for captions..."` (section label)
- `"Hide"` (toggle)
- `"Type your message..."` / `"Upgrade to continue chatting…"` / `"Context limit reached. Start a new chat or summarize."` (textarea placeholders)
- `"Sending…"` / `"Send"` (submit button states)
- Footer disclaimer text
- `"Context Tokens: X of Y used..."` (token display)
- `"Copied"` / `"Copy"` (clipboard button)
- `aria-label="Helpful"` / `aria-label="Not helpful"` (feedback buttons)
- `"Dismiss"` (dismiss button)

#### `src/app/components/render/UploadTalkingHead.tsx` (non-credits strings)
Uses `useTranslations("outOfCredits")` only for one section. All else hardcoded:
- `"Face photo (PNG/JPG)"` / `"Driven audio (MP3/WAV)"` (input labels)
- `"Generating…"` / `"Generate"` / `"Reset"` (action buttons)
- 4 progress stage strings
- `"Please choose a face photo..."` / `"Please choose a voice audio file..."` (validation)
- `"No active package instance..."` / `"Please enroll your profile face..."` and other error messages
- `"Enroll face"` / `"View packages"` (error CTAs)
- `"Support ID:"` / `"Copy"` (error detail)
- `"Credit confirmation required"` (modal title)
- Credit warning/confirmation body text
- `"Confirm (use X credit)"` / `"Cancel"` (confirm modal buttons)
- `"Generated Results"` / `"Recents"` (section labels)
- `"Create your first avatar video"` (empty state heading)
- `"Upload a face photo and audio to generate a video."` (empty state body)
- `"Start generating"` (empty state CTA)
- `"Avatar Video"` / `"No preview"` / `"Video ready ✓"` (status labels)

#### `src/app/components/dashboard/NoPlanDashboard.tsx`
No `useTranslations`. Massively hardcoded (~30+ strings):
- All checklist step labels
- All locked feature card titles and descriptions
- Demo summary section title and body
- All section headings and subheadings
- All CTA button text

#### `src/app/components/dashboard/billing/BillingPanel.tsx`
No `useTranslations`. Hardcoded:
- `"No active plan"` (heading)
- `"You need an active package to buy add-ons."` / `"View plans →"` (empty state)
- `"Unauthorized. Please sign in again."` (error)
- `"Failed to select package instance."` / `"Missing checkout URL."` / `"Failed to create add-on checkout session."` / `"This add-on is temporarily unavailable..."` (error messages)
- `"No active packages."` (empty state)
- `"Selected"` / `"Not selected"` / `"Select"` (instance selection)
- `"Uploads:"` / `"AI Tokens:"` / `"Videos:"` (quota labels)
- `"Monthly package usage. Context tokens are tracked per conversation in AI Chat."` (explanatory text)
- `"Unlimited plan tokens — each conversation has a memory limit..."` (unlimited plan note)
- `"Unlimited"` (quota display)
- `"Buy add-ons"` (section label)
- `"Included"` (addon state)
- `"Redirecting…"` (loading state)
- `"Best value"` (badge)
- `"Add-ons are only available for active packages."` (disabled note)
- `"Selected package"` / `"Active instance:"` (footer section)
- `"Support ID:"` / `"Copy"` (error detail)
- All `ADDON_PACKS` labels: `"5 Uploads"`, `"20 Uploads"`, `"100k Chat Tokens"`, `"5 Videos"`, `"15 Videos"`, `"30 Videos"`

#### `src/app/components/dashboard/sidebar/PackagesModal.tsx`
No `useTranslations`. Hardcoded:
- `"Plans that fit your scale"` / `"Choose a plan and continue to checkout."` (modal header)
- All plan names, prices, `bestFor`, `includes`, `highlights`, `cta`, `badge` strings in `PLANS` array
- `"Best for"` / `"Includes"` / `"Key highlights"` (section labels)
- `"Redirecting..."` (loading state)

#### `src/app/components/dashboard/sidebar/SettingsModal.tsx`
No `useTranslations`. Hardcoded:
- `"Settings"` (modal title)
- `sections` array: `"Account"`, `"Usage"`, `"Plan & Billing"`, `"History"` (tab labels)
- `"Unlimited"` / `"left"` (usage bar)
- `"used"` / `"used / X"` (usage bar footer)
- `"Manage your profile details"` (account subtext)
- `"First name"` / `"Last name"` / `"Email"` (field labels + placeholders)
- `"This appears in your account and receipts."` (hint text)
- `"Save changes"` / `"Cancel"` / `"Saving..."` (form buttons)
- `"Saved"` (success state)
- `"Failed to save profile."` / `"Profile update is not available in this environment yet."` (errors)
- `"Support ID:"` / `"Copy"` (error detail)
- `"AI Tokens track monthly package usage. Context Tokens are..."` (usage explanation)
- `"Uploads"` / `"AI Tokens"` / `"Avatar Videos"` (usage bar labels)
- `"Exit dashboard"` / `"Sign out"` / `"Signing out..."` (footer actions)

#### `src/app/components/dashboard/FaceEnrollModal.tsx`
No `useTranslations`. Hardcoded:
- `"Face enrollment required"` (modal title)
- `"Upload a clear, single-face photo to unlock all features for this package."` (description)
- `"Upload face photo"` (button)
- `"Face already enrolled for this package."` / `"Please upload a photo with exactly one face."` / `"No face detected. Please upload a clear single-face photo."` / `"Enrollment failed. Please try again."` (error messages)
- `"Copy request ID"` (error detail)

#### `src/app/components/dashboard/history/HistoryPanel.tsx`
No `useTranslations`. Hardcoded:
- `"Upload History"` (page heading)
- `"Review past analyses, refine insights, and keep your strategy sharp."` (subheading)
- `"Photo Uploads"` / `"Avatar Video"` (tab labels)
- `"Select a package"` / `"Choose an active package to view insights for that plan."` (no-package state)
- `"View packages"` (CTA)
- `"No access"` (error state heading)
- `"No insights yet"` / `"Upload your first image to generate your first strategy."` (empty state)
- `"Upload content"` (CTA)
- `"Talking Head history"` (videos tab heading)
- `"Generate new"` (videos CTA)
- `"Your generated videos will appear here."` (videos empty state)
- `"Preview"` / `"Created"` / `"Actions"` (table column headers)
- `"You need an active package to view your history."` (error message)
- `"Copy request ID"` (toast action label)

#### `src/app/components/dashboard/MobileBottomBar.tsx`
No `useTranslations`. All nav labels hardcoded:
- `"Overview"` / `"Upload"` / `"AI Video"` (bottom bar items)
- `"History"` / `"Billing"` / `"Settings"` / `"Get Credits"` / `"More"` (sheet items)

---

### MEDIUM severity

#### `src/app/components/dashboard/report/ReportDrawer.tsx`
No `useTranslations`. Hardcoded:
- `"AI Analysis Report"` (eyebrow)
- `"Promotion Plan"` (fallback title)
- `"Summary"` (section label)
- `"AI analyzed your image and generated a strategy"` (heading)
- `"X platform recommendation(s) with captions, hashtags, and posting windows."` / `"No platform recommendations were returned..."` (summary body)
- `"No image preview"` (fallback)
- `"Platform Recommendations"` (section heading)
- `"Best channels, captions, hashtags, and posting hints."` (section subheading)
- `"No promotion plan available yet."` / `"Retry"` (empty state)
- `"Copy caption"` / `"Copy hashtags"` (copy buttons)
- `"Show less"` / `"+N more"` (expand toggle)
- `"CTA:"` / `"Why:"` (label prefixes)
- `"Posting Safety Tips"` (safety section heading)
- `"Mark as posted"` / `"Saved ✓"` (feedback toggle)
- `"Help the AI learn from this post"` / `"Enter how this post performed..."` (feedback panel)
- `"Impressions"` / `"Engagements"` (feedback labels)
- `"Total views of this post."` / `"Likes + comments + shares."` (field hints)
- `"Engagement rate: X%"` (computed label)
- `"Just mark as posted"` / `"Save"` / `"Saving..."` (feedback buttons)
- `"Copy link"` / `"Copied"` (header button)
- `"Close report drawer"` (aria-label)

#### `src/app/components/dashboard/upload/ReportDrawer.tsx`
No `useTranslations`. Hardcoded:
- `"Promotion Plan"` (eyebrow + fallback title)
- `"Top pick"` (section label)
- `"Best windows:"` (time label)
- `"Recommended Platforms"` (section heading)
- `"No promotion plan available yet."` / `"Retry"` (empty state)
- `"Copy caption"` / `"Copy hashtags"` (copy buttons)
- `"Show less"` / `"+N more"` (expand toggle)
- `"Copy link"` / `"Copied"` (header button)

#### `src/app/components/dashboard/ProfileSwitcherModal.tsx`
No `useTranslations`. Hardcoded:
- `"Switch profile"` (modal heading)
- `"Choose which profile is active."` (subheading)
- `"Close"` (button)
- `"Loading profiles…"` (loading state)
- `"No active package instances found."` / `"Go to packages"` (empty state)
- `"Profile A/B/C..."` (generated labels)
- `"Created "` (date prefix)
- `"ID "` (id prefix)
- `"Rename profile"` (input placeholder)
- `"Rename"` (button)
- `"Active"` / `"Inactive"` (status labels)
- `"Set active"` (button)
- `"Close profile switcher"` (aria-label)

#### `src/app/components/dashboard/talking-head/TalkingHeadResultDrawer.tsx`
No `useTranslations`. Hardcoded:
- `"Just now"` (fallback date)
- Status labels used directly: `"queued"` / `"processing"` / `"done"` / `"failed"`
- `"Download"` / `"Open"` (video action buttons)
- `"Your video is being generated."` (processing state)
- `"Stage: ..."` / `"Progress: X%"` (progress labels)
- `"Video generation failed. Please try again."` (failure message)
- `"Support ID:"` / `"Copy"` (error detail)
- `"Close"` / `"Close drawer"` (close buttons)

#### `src/app/components/dashboard/upload/RecentCreations.tsx`
No `useTranslations`. Hardcoded:
- `"Generated Results"` (eyebrow)
- `"Recents"` (heading)
- `"See all ›"` (link)
- `"Create your first strategy"` (empty state heading)
- `"Upload an image to generate a report."` (empty state body)
- `"Upload content"` (CTA)

#### `src/app/components/dashboard/ActivePackageCard.tsx`
No `useTranslations`. Hardcoded:
- `"Active package"` (card heading)
- `"Active"` (status badge)
- `"Switch profile"` (button)
- `"Package instance ID"` (label)
- `"Created"` (date label prefix)

#### `src/app/components/dashboard/QuotaUsageCard.tsx`
No `useTranslations`. Hardcoded:
- `"Quota usage"` (card heading)
- `"Usage overview"` (subheading)
- Explanatory text about quota types
- `"Uploads"` / `"AI Tokens"` / `"Videos"` (quota labels)
- `"Unlimited"` (unlimited display)

#### `src/app/components/dashboard/QuickActions.tsx`
No `useTranslations`. Hardcoded:
- `"Quick actions"` (heading)
- `"Jump in"` (subheading)
- `"Upload Content"` / `"AI Chat"` / `"AI Video Avatar"` (action labels)
- `"Upload limit reached"` / `"Chat limit reached"` / `"Unavailable"` (disabled states)

#### `src/app/components/dashboard/LastUploadCard.tsx`
No `useTranslations`. Hardcoded:
- `"Last activity"` (card eyebrow)
- `"Last upload"` (card heading)
- `"No uploads yet. Upload your first image to see insights here."` (empty state)
- `"Created "` (date prefix)
- `"View Full Insight →"` (CTA)
- `"Niche: "` / `"Top platform: "` (data labels)
- `"AI insights ready."` (status tag)

#### `src/app/components/dashboard/DashboardOnboarding.tsx`
No `useTranslations`. Hardcoded:
- All step label strings (array)
- `"Getting started"` (heading)
- `"Start with the basics"` (subheading)
- `"Recommended"` (badge)
- `"Quota exhausted"` (badge)
- `"Go to step →"` (step CTA)
- `"Dismiss onboarding"` (aria-label)

#### `src/app/components/dashboard/sidebar/ProfileMenuButton.tsx`
No `useTranslations`. Hardcoded:
- `"Profile"` (button label + title)
- `"My Account"` (menu item)
- `"Plans & Billing"` (menu item)
- `"Settings"` (menu item)
- `"Help Center"` (menu item)
- `"Cookie preferences"` (menu item)
- `"Log out"` / `"Logging out..."` (logout button)

#### `src/app/components/AIchat/AiChatHistorySidebar.tsx`
No `useTranslations`. Hardcoded:
- `"AI Chat History"` (header label)
- `"+ New"` (button)
- `"No conversations yet."` (empty state)
- `"Untitled"` (conversation title fallback)
- `"continued"` / `"summarized"` (conversation status badges)

#### `src/app/components/dashboard/SelectActiveInstance.tsx`
No `useTranslations`. Hardcoded:
- `"Select an active package"` (heading)
- `"Choose which package instance to use for quotas and history."` (description)
- `"Loading packages…"` (loading state)
- `"No active package instances found."` (empty state)
- `"Failed to load packages"` / `"Failed to select package"` (error messages)

#### `src/app/components/dashboard/PlanStatusPill.tsx`
No `useTranslations`. Hardcoded:
- `"Checking plan…"` (loading state)
- `"No active plan · 0 uploads"` (no-access state)
- `"No uploads left"` / `"X plan · No uploads left"` (out-of-credits state)
- `"plan"` / `"Active plan"` (active state suffix/fallback)
- `"uploads left"` (quota suffix)

---

### LOW severity

#### `src/app/components/AIchat/AssistantFooter.tsx`
No `useTranslations`. Hardcoded:
- `"Your AI content strategy coach can help you go from idea to publish-ready output."` (description)
- All `HINTS` label strings: `"Ask for 3 caption angles"`, `"Generate stronger hooks"`, `"Create avatar script ideas"`, `"Repurpose across platforms"`

#### `src/app/components/AIchat/ContextUsedPopover.tsx`
No `useTranslations`. Hardcoded:
- `"Context used · {count}"` (button label)
- `"Uploads referenced by Sage"` (popover heading)
- `"Upload {id}"` (fallback item label)
- `"today"` / `"N day(s) ago"` (date labels)

#### `src/app/components/AIchat/CreditsChip.tsx`
No `useTranslations`. Hardcoded:
- `"Chat: {used}/{limit}"` (display string)
- `"Monthly chat credits"` (title attribute)

#### `src/app/components/AIchat/FloatingChatWidget.tsx`
No `useTranslations`. Hardcoded:
- `"AI Coach"` (FAB aria-label and panel title fallback)
- `"History"` (header button)
- `"Close"` (aria-label)

#### `src/app/components/AIchat/QuickPromptsBar.tsx`
No `useTranslations`. Hardcoded:
- `label = "Suggested prompts"` (default prop — will render in English unless caller overrides)

#### `src/app/components/AIchat/UpgradeCta.tsx`
No `useTranslations`. Hardcoded:
- `"You've used all your AI Chat tokens this month"` (heading)
- `"Upgrade to Pro for 3× more tokens, priority responses, and full upload history context"` (body)

#### `src/app/components/dashboard/StatsDashboard.tsx`
No `useTranslations`. Appears to be a legacy/unused component. Hardcoded:
- `"Upload History"` / `"Insights"` / `"Last Upload"` / `"Plan Usage"` (section headings)
- `"No uploads yet"` (empty state)
- `"No insights yet"` / `"3 of 10 uploads used"` (placeholder content)

#### `src/app/components/dashboard/overview/QuickStartPanel.tsx`
No `useTranslations`. Legacy component. Hardcoded:
- `"Upload Content"` / `"AI Chat"` / `"Insight History"` (card titles)
- All card description strings

#### `src/app/components/dashboard/overview/TipsCard.tsx`
No `useTranslations`. Legacy component. Hardcoded:
- `"Tips for Best Results"` (heading)
- All 5 tip strings

#### `src/app/components/dashboard/overview/UserPlanCard.tsx`
No `useTranslations`. Legacy component. Hardcoded:
- `"Your Plan"` (heading)
- `"Plan:"` / `"Uploads Remaining:"` / `"Expires:"` (data labels)
- `"Upgrade Plan"` (button)

#### `src/app/components/dashboard/history/HistoryTable.tsx`
No `useTranslations`. Hardcoded:
- `"Preview"` / `"Created"` / `"Actions"` (table column headers)
- `"Analysis"` (row title fallback)
- `"Delete"` (button)
- `"Delete Analysis"` / `"Are you sure you want to delete this analysis? This action cannot be undone."` (confirm modal — sourced from `ConfirmModal` props)

#### `src/app/components/dashboard/upload/CreationCard.tsx`
No `useTranslations`. Hardcoded:
- `"No preview"` (thumbnail fallback)
- `"Content Strategy"` (title fallback)

#### `src/app/components/dashboard/buttons/clipboard.tsx`
No `useTranslations`. Default prop values only:
- `label = "Copy"` (default)
- `copiedLabel = "✓ Copied"` (default)

#### `src/app/[locale]/dashboard/talking-head/page.tsx`
No `useTranslations`. Hardcoded:
- `"AI Video Avatar"` (page heading)
- `"Upload a face photo + voice audio and we'll generate a talking video."` (description)

---

## Files with No User-Facing Strings (no action needed)

| File | Reason |
|---|---|
| `src/app/[locale]/dashboard/ai-chat/page.tsx` | Redirect only |
| `src/app/[locale]/dashboard/layout.tsx` | Server component, no UI strings |
| `src/app/[locale]/dashboard/history/page.tsx` | Thin wrapper for `HistoryPanel` |
| `src/app/components/dashboard/DashboardGlow.tsx` | Visual only, no text |
| `src/app/components/dashboard/loading spinner/page.tsx` | Visual only, no text |
| `src/app/components/AIchat/FloatingChatContext.tsx` | Context provider only |

---

## Recommended i18n Namespace Structure

Based on the audit, the following new namespaces are recommended:

```
dashboard         — page headings, shared dashboard chrome
dashboardNav      — already exists, expand with missing "Packages" + aria-labels
history           — HistoryPanel, HistoryTable strings
billing           — BillingPanel, billing page strings
account           — account page, SettingsModal account section
settings          — SettingsModal tabs + shared modal chrome
packages          — PackagesModal plan data + labels
upload            — upload page, RecentCreations, CreationCard
talkingHead       — UploadTalkingHead, TalkingHeadResultDrawer, talking-head page
aiChat            — CoachChat, AiChatHistorySidebar, AssistantFooter, FloatingChatWidget, UpgradeCta, ContextUsedPopover, CreditsChip
faceEnroll        — FaceEnrollModal
profileSwitcher   — ProfileSwitcherModal, ProfileMenuButton, SelectActiveInstance, ActivePackageCard
quotaUsage        — QuotaUsageCard, PlanStatusPill, QuickActions
onboarding        — DashboardOnboarding
reportDrawer      — ReportDrawer (both versions)
```

---

## Priority Order for Implementation

1. **CoachChat.tsx** — highest surface area, user types here constantly
2. **NoPlanDashboard.tsx** — first thing new users see, zero i18n today
3. **HistoryPanel.tsx + HistoryTable.tsx** — core feature page
4. **BillingPanel.tsx + billing page** — transactional, high trust requirement
5. **SettingsModal.tsx** — frequently accessed, currently all English
6. **PackagesModal.tsx** — purchase flow inside the dashboard
7. **dashboard/page.tsx + upload/page.tsx + talking-head/page.tsx** — page entry points
8. **account/page.tsx** — profile/security page
9. **FaceEnrollModal.tsx** — required enrollment step
10. **ProfileSwitcherModal.tsx + ProfileMenuButton.tsx** — profile management
11. **UploadTalkingHead.tsx** (non-credits strings) — complement existing partial i18n
12. **DashboardSidebar.tsx** (missing strings only) — complement existing partial i18n
13. All remaining MEDIUM + LOW severity files
