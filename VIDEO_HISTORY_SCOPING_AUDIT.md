# Video History Cross-Instance Scoping Audit
**Symptom**: Videos generated under the old Lite instance (69de3f58...) appear in the new Pro instance's Recents.
**Scope**: Read-only investigation — no source modifications.
**Date**: 2026-05-18

---

## Video Data Model

**Model**: `HeygenVideo`
**File**: `backend/models/heygenVideo.js`

```js
{
  userId:            ObjectId  required  // the user who generated it
  packageInstanceId: ObjectId  required  // the PackageInstance active at generation time
  videoUrl:          String    required
  videoId:           String    // HeyGen's internal video ID
  imageUrl:          String    // face photo URL used
  audioUrl:          String    // driven audio URL used
  creditsConsumed:   Number
  createdAt:         Date
}
```

**Indexes**: `{ userId: 1, createdAt: -1 }` — sorted per user, no compound index on `packageInstanceId`.

**Key finding**: `packageInstanceId` is present on the schema, is `required`, and IS populated correctly on every new `HeygenVideo` record. The data model supports per-instance scoping. The problem is not in the model.

> **Note on RenderJob**: There is a separate `RenderJob` model (`backend/models/renderJob.js`) for the SadTalker pipeline. It stores `userEmail` only — no `userId`, no `packageInstanceId`. It is a legacy/alternative video generation path and does NOT appear to be what the "AI Video Avatar" page uses currently. The active page (`UploadTalkingHead.tsx`) calls `/api/heygen/create`, which exclusively creates `HeygenVideo` records.

---

## Generation: What Gets Stored

The full call chain when a video is generated:

```
Frontend: POST /api/heygen/create  (Next.js BFF: src/app/api/heygen/create/route.ts)
  └─ Step 4: POST /api/user/heygen/consume  (backend: consumes quota on user.activePackageInstanceId)
       └─ Returns: { ok, userId, packageInstanceId, ... }
  └─ Step 6: POST /api/heygen/generate  (backend: heygenRoutes.js)
       └─ Body: { imageUrl, audioUrl, userId, packageInstanceId, imageHash }
       └─ Creates: HeygenVideo.create({ userId, packageInstanceId, videoUrl, ... })
```

**IDs saved on each video record at generation time**: `userId` + `packageInstanceId` (the active instance at the moment of generation).

**Active instance recorded**: YES. `packageInstanceId` is pulled from the quota-consume response (`consumeData.packageInstanceId`) and forwarded to the generate endpoint. Every `HeygenVideo` document correctly identifies which `PackageInstance` it was created under.

Files confirming this chain:
- `src/app/api/heygen/create/route.ts:224-227` — extracts `packageInstanceId` from consume response
- `src/app/api/heygen/create/route.ts:263` — passes it to the backend generate call
- `backend/routes/heygenRoutes.js:134-144` — `HeygenVideo.create({ userId, packageInstanceId, ... })`

---

## History Retrieval

### Endpoint

| Layer | Path | File |
|---|---|---|
| Frontend component | `fetch("/api/sadtalker/history")` | `src/app/components/render/UploadTalkingHead.tsx:102` |
| Next.js BFF | `GET /api/sadtalker/history` | `src/app/api/sadtalker/history/route.ts` |
| Backend | `GET /api/heygen/history?userId=...` | `backend/routes/heygenRoutes.js:156` |

> **Naming confusion**: The Next.js route is named `sadtalker/history` but it proxies exclusively to the HeyGen backend endpoint. It does not call any SadTalker/RenderJob endpoint.

### Exact MongoDB query

`backend/routes/heygenRoutes.js:165`:

```js
const items = await HeygenVideo.find({ userId })
  .sort({ createdAt: -1 })
  .limit(limit)
  .lean();
```

**Filter**: `{ userId }` only.
**`packageInstanceId` used in filter**: NO.

The endpoint receives only `userId` as a query parameter (`?userId=...`). No `packageInstanceId` is passed from the frontend. No instance filter is applied in the query. All `HeygenVideo` records matching `userId` are returned regardless of which `PackageInstance` they belong to.

The response shape strips `packageInstanceId` entirely before returning to the frontend:

```js
const mapped = items.map((doc) => ({
  jobId: String(doc._id),
  videoUrl: doc.videoUrl,
  createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
  options: { thumbnailUrl: doc.imageUrl || null },
}));
```

`packageInstanceId` is not included in the response, so the frontend has no way to filter by instance even client-side.

**Scoped per instance**: NO.

---

## Quota vs History Mismatch

| Mechanism | Scoping | How |
|---|---|---|
| **Quota counting** (video credits deducted) | Per-instance | `consumeHeygenCredit` (`userController.js`) reads `user.activePackageInstanceId` → deducts `sadtalkerVideosUsed` on THAT instance only |
| **Video storage** | Per-instance | `HeygenVideo` record written with `packageInstanceId` = active instance ID |
| **History retrieval** | Per-user | `HeygenVideo.find({ userId })` — ignores `packageInstanceId` |

**THE MISMATCH**: The quota system correctly tracks credits per-instance (Lite: 9 used / 10, Pro: 0 used / 50). The generation code correctly records `packageInstanceId` on every video. But the history query throws that field away and returns every video the user has ever generated across all instances. The data to scope correctly already exists in the DB — it is simply not used by the history query.

---

## ROOT CAUSE

`backend/routes/heygenRoutes.js:165` queries `HeygenVideo.find({ userId })` without filtering by `packageInstanceId`. Every `HeygenVideo` document has `packageInstanceId` stored and populated, making per-instance scoping a one-line change to the query — but the query was written (or remains) as a user-wide lookup. The 9 Lite-instance videos appear in the Pro instance's Recents not because of a data problem, but because the history endpoint never consults `packageInstanceId` at all.

---

## Product Decision Needed

The system currently treats video generation quotas as **per-instance** (stacking model: each package has its own credit pool). Video history is **per-user**. These two behaviours conflict. The decision is:

---

### Option A — History per-instance (align history with quota model)

**What changes**:
- Backend `GET /api/heygen/history` accepts an optional `?packageInstanceId=...` parameter and adds it to the MongoDB query when present.
- Next.js BFF (`/api/sadtalker/history`) reads the active `packageInstanceId` from the session (by calling `/api/auth/me` which already returns it, or from a separate `/api/user/check-package` call) and forwards it.
- Frontend `UploadTalkingHead.tsx` passes `packageInstanceId` when calling `/api/sadtalker/history` — or the BFF handles it transparently.

**Semantics**: Each package instance sees only the videos it generated. Switching to a different active instance shows that instance's videos. Like switching between separate workspaces.

**Migration**: No migration needed for existing data. Every existing `HeygenVideo` already has the correct `packageInstanceId`. The 9 Lite videos would immediately disappear from the Pro Recents as soon as the query is scoped.

**Risk**: Low code change. The main question is whether the BFF can reliably obtain the current `packageInstanceId` without adding a second auth round-trip. The consume response already returns it and could be cached briefly.

**Con**: A user who owns two active instances cannot see all their lifetime videos from one view without switching. History is fragmented across instances.

---

### Option B — History per-user (keep current behaviour, make it explicit)

**What changes**:
- No backend changes.
- UI change only: rename "Recents" to "All Videos" or "Your History" and remove any phrasing that implies the view is scoped to the current package.

**Semantics**: You own all your videos, always visible. Packages are credit pools, not isolated workspaces. History is a user-level concept.

**Migration**: Nothing. Current behaviour is already per-user.

**Risk**: Quota model (per-instance) and history model (per-user) remain in permanent conceptual tension. A user who exhausted a Lite plan and bought Pro to "start fresh" will see the old Lite videos in their Pro Recents — which may feel wrong.

**Con**: Inconsistent with quota model. "You used 0/50 videos" but Recents shows 9 videos is confusing.

---

### Option C — History per-user, grouped/labelled by instance

**What changes**:
- Backend: return `packageInstanceId` in each history item.
- Frontend: group or badge items by instance (e.g., "Lite • Apr 14" vs "Pro • May 18").
- No MongoDB query change needed.

**Semantics**: You see everything, but the UI makes the provenance clear.

**Migration**: No data migration needed. All `HeygenVideo` records already have `packageInstanceId`.

**Risk**: Medium UI complexity. Requires knowing the plan name/date for each instance to render a useful label.

**Con**: More complex UI. Doesn't resolve the "fresh start" feeling for a user who expected Pro to be a clean slate.

---

## Recommended Option

**Option A** — align history with the quota model.

Reasoning: The system already treats packages as isolated credit pools (quota is strictly per-instance, not shared). History should follow the same boundary. The data already supports it (`packageInstanceId` is on every record, non-null, required). The code change is minimal: one query filter and one parameter forwarded through the BFF. No migration is needed. Option B requires no code change but leaves a permanent UX inconsistency that will cause recurring support confusion ("I have 0 videos used but I can see 9 videos"). Option C is a reasonable middle ground if the product intent is truly "stacking and always-visible", but it requires more frontend work than Option A for a semantics that is harder to explain.

**If the product intent is confirmed as "packages stack and share everything"**, then Option B (or C) is correct and the quota model would also need revisiting — but that is a larger product decision, not a bug fix.

---

## Files That Would Change Per Option

### Option A
| File | Change |
|---|---|
| `backend/routes/heygenRoutes.js` | Accept `packageInstanceId` query param; add to MongoDB filter |
| `src/app/api/sadtalker/history/route.ts` | Obtain active `packageInstanceId` from session; forward to backend |
| `src/app/components/render/UploadTalkingHead.tsx` | Optionally: pass `packageInstanceId` to BFF if BFF doesn't handle it |
| `src/app/components/dashboard/history/HistoryPanel.tsx` | Same — if the "Videos" tab in HistoryPanel also needs scoping |

### Option B
No backend changes. Possible UI copy change only.

### Option C
| File | Change |
|---|---|
| `backend/routes/heygenRoutes.js` | Include `packageInstanceId` in each response item |
| `src/app/api/sadtalker/history/route.ts` | Forward `packageInstanceId` from response |
| `src/app/components/render/UploadTalkingHead.tsx` | Group/badge items by `packageInstanceId`; needs instance label lookup |

---

## Migration Concern

**Existing HeygenVideo records**: Every document has `packageInstanceId` as a required field, populated at creation time. The 9 Lite videos have `packageInstanceId = "69de3f584395448f9eee9e12"` (the Lite instance). No backfill or migration is needed for Option A, B, or C.

**RenderJob records** (SadTalker pipeline, separate from HeyGen): These have NO `userId` and NO `packageInstanceId` — only `userEmail`. If the SadTalker pipeline is still in use and its history needs to be scoped per-instance, that would require a separate migration strategy (backfill by matching `userEmail → userId → which instance was active at `createdAt`). This is only a concern if SadTalker jobs are being surfaced in the same Recents UI. Currently, the HistoryPanel's "Videos" tab and the `UploadTalkingHead` Recents both call `/api/sadtalker/history`, which proxies to the HeyGen backend — so SadTalker `RenderJob` records are NOT currently being returned to the user at all. They appear to be a dead or separate code path.
