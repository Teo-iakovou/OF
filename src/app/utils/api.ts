// src/app/utils/api.ts
import type { ResultDoc } from "@/app/types/analysis";
import { BASE_URL, fetchJson } from "@/app/utils/fetcher";

// -------------------------------
// Small helpers
// -------------------------------
async function readJsonOrText(res: Response) {
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: res.ok, status: res.status, data: text };
  }
}

function ensureOk<T = unknown>(
  r: { ok: boolean; status: number; data: unknown },
  what: string
): T {
  if (!r.ok) {
    const msg =
      typeof r.data === "string" ? r.data : JSON.stringify(r.data, null, 2);
    throw new Error(`${what} failed (${r.status}) - ${msg}`);
  }
  return r.data as T;
}

// -------------------------------
/** Analysis history */
export async function fetchAnalysisHistory(
  page = 1,
  limit = 10,
  options: { packageInstanceId?: string } = {}
): Promise<{ results: ResultDoc[]; total: number }> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    includeLegacy: "false",
  });
  if (options.packageInstanceId) params.set("packageInstanceId", options.packageInstanceId);
  const url = `${BASE_URL}/api/user/results?${params.toString()}`;
  const r = await fetchJson(url, { method: "GET", cache: "no-store" });
  if (!r.ok) throw new Error("Fetch analysis history failed");
  return r.data as { results: ResultDoc[]; total: number };
}

export type ResultSummary = {
  _id: string;
  createdAt: string;
  imageKey?: string;
  meta?: {
    imageUrl?: string;
    assetUrl?: string;
    thumbnailUrl?: string;
    imageKey?: string;
    assetKey?: string;
    r2Key?: string;
    uploadKey?: string;
    upload?: { url?: string };
    image?: { url?: string; key?: string };
    r2?: { publicUrl?: string };
    r2Url?: string;
    fileUrl?: string;
    [key: string]: unknown;
  };
  promotion?: {
    recommendedPlatforms?: Array<{
      platform: string;
      bestTimesLocal?: string[];
      hashtags?: string[];
      caption?: string;
    }>;
    contentSafety?: { csl: number };
    niche?: string;
  };
};

export async function getUserResults(params?: {
  page?: number;
  limit?: number;
  includeLegacy?: boolean;
  packageInstanceId?: string;
}): Promise<{
  results: ResultSummary[];
  total: number;
  page: number;
  limit: number;
  requestId?: string;
}> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const includeLegacy = params?.includeLegacy ?? false;
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    includeLegacy: String(includeLegacy),
  });
  if (params?.packageInstanceId) {
    qs.set("packageInstanceId", params.packageInstanceId);
  }
  const r = await fetchJson(`${BASE_URL}/api/user/results?${qs.toString()}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!r.ok) {
    const data = r.data as {
      error?: string;
      errorCode?: string;
      requestId?: string;
    };
    const err = new Error(data?.error || "Failed to load results") as Error & {
      status?: number;
      code?: string;
      requestId?: string;
    };
    err.status = r.status;
    err.code = data?.errorCode || data?.error;
    if (typeof data?.requestId === "string") err.requestId = data.requestId;
    throw err;
  }
  return r.data as {
    results: ResultSummary[];
    total: number;
    page: number;
    limit: number;
    requestId?: string;
  };
}

export async function fetchLatestResultForPackageInstance(
  packageInstanceId: string
): Promise<ResultDoc | null> {
  const { results } = await fetchAnalysisHistory(1, 1, { packageInstanceId });
  return results[0] || null;
}

/** Formats a ResultDoc into a compact, labeled string for injection into the AI system prompt. */
export function formatContentInfo(result: ResultDoc): string {
  const plat = result.promotion?.recommendedPlatforms?.[0];
  const lines: string[] = [];
  if (plat?.platform) lines.push(`platform: ${plat.platform}`);
  if (result.niche) lines.push(`niche: ${result.niche}`);
  const rawCaption = plat?.caption ?? "";
  if (rawCaption) {
    const snippet = rawCaption.slice(0, 80).replace(/\n/g, " ") + (rawCaption.length > 80 ? "…" : "");
    lines.push(`caption: '${snippet}'`);
  }
  const hashtagCount = plat?.hashtags?.length ?? 0;
  if (hashtagCount > 0) lines.push(`hashtags: ${hashtagCount}`);
  if (typeof result.csl === "number") lines.push(`score: ${result.csl}`);
  if (result.createdAt) {
    const daysAgo = Math.floor((Date.now() - new Date(result.createdAt).getTime()) / (24 * 3600e3));
    lines.push(`uploaded: ${daysAgo === 0 ? "today" : `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`}`);
  }
  return lines.join("\n");
}

export type RecentCreation = {
  id: string;
  title: string;
  createdAt: string;
  type: string;
  status: string;
  thumbnailUrl?: string | null;
  imageKey?: string | null;
};

const extractResultImageUrl = (result: ResultSummary) => {
  const meta = (result as { meta?: Record<string, unknown> }).meta;
  if (!meta || typeof meta !== "object") return null;
  const imageUrl = meta.imageUrl;
  return typeof imageUrl === "string" && imageUrl.startsWith("http") ? imageUrl : null;
};

const isLikelyPrivateR2Url = (url: string) => {
  const lower = url.toLowerCase();
  const hasSigningParams =
    lower.includes("x-amz-") || lower.includes("signature") || lower.includes("token=");
  try {
    const parsed = new URL(url);
    const hostIsR2 = parsed.hostname.includes("r2.cloudflarestorage.com");
    const uploadsPath = parsed.pathname.includes("/aiplatform/uploads/");
    return (hostIsR2 || uploadsPath) && !hasSigningParams;
  } catch {
    const uploadsPath = lower.includes("/aiplatform/uploads/");
    return uploadsPath && !hasSigningParams;
  }
};

const extractResultImageKey = (result: ResultSummary) => {
  const meta = (result as { meta?: Record<string, unknown> }).meta;
  const topLevelImageKey = (result as { imageKey?: unknown }).imageKey;
  const nestedImage = meta?.image as { key?: unknown } | undefined;
  const candidates = [
    topLevelImageKey,
    meta?.imageKey,
    nestedImage?.key,
    meta?.assetKey,
    meta?.r2Key,
    meta?.uploadKey,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
};

export async function getRecentCreations(params: {
  packageInstanceId: string;
  limit?: number;
}): Promise<RecentCreation[]> {
  const { packageInstanceId, limit = 12 } = params;
  const res = await getUserResults({ page: 1, limit, packageInstanceId });
  return (res.results || []).map((item) => {
    const createdAt = item.createdAt || "";
    const niche = item?.promotion?.niche || "Report";
    const title = niche ? `${niche} report` : "Report";
    const platform = item?.promotion?.recommendedPlatforms?.[0]?.platform || "Analysis";
    const status = item?.promotion ? "Ready" : "Processing";
    const thumb =
      (typeof (item as any).thumbnailUrl === "string" && (item as any).thumbnailUrl) ||
      (typeof (item as any).imageUrl === "string" && (item as any).imageUrl) ||
      (typeof item.meta?.thumbnailUrl === "string" && item.meta.thumbnailUrl) ||
      (typeof item.meta?.imageUrl === "string" && item.meta.imageUrl) ||
      (typeof item.meta?.assetUrl === "string" && item.meta.assetUrl) ||
      null;
    const normalizedThumb =
      typeof thumb === "string" && isLikelyPrivateR2Url(thumb) ? null : thumb;
    return {
      id: item._id,
      title,
      createdAt,
      type: platform,
      status,
      thumbnailUrl: normalizedThumb,
      imageKey: extractResultImageKey(item),
    };
  });
}

export async function getUserResultImageUrl({
  id,
}: {
  id: string;
}): Promise<{ id: string; imageKey: string; url: string; requestId?: string }> {
  const r = await fetchJson(
    `${BASE_URL}/api/user/results/${encodeURIComponent(id)}/image-url`,
    {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!r.ok) {
    const data = r.data as { error?: string; requestId?: string };
    const err = new Error(data?.error || "Failed to load result image URL") as Error & {
      status?: number;
      requestId?: string;
    };
    err.status = r.status;
    if (typeof data?.requestId === "string") err.requestId = data.requestId;
    throw err;
  }

  return r.data as { id: string; imageKey: string; url: string; requestId?: string };
}

export async function deleteAnalysisResult(id: string) {
  const res = await fetch(`${BASE_URL}/api/analyze/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<{ message: string }>(parsed, "Delete analysis result");
}

// -------------------------------
/** Stripe (unchanged) */
let checkoutInFlightPromise: Promise<void> | null = null;
let checkoutInFlight = false;
const checkoutInFlightListeners = new Set<() => void>();

function setCheckoutInFlight(next: boolean) {
  checkoutInFlight = next;
  checkoutInFlightListeners.forEach((listener) => listener());
}

export function subscribeCheckoutInFlight(listener: () => void) {
  checkoutInFlightListeners.add(listener);
  return () => {
    checkoutInFlightListeners.delete(listener);
  };
}

export function getCheckoutInFlightSnapshot() {
  return checkoutInFlight;
}

export function getCheckoutInFlightServerSnapshot() {
  return false;
}

export async function startCheckout(packageId: string, personaKey?: string | null, locale?: string | null) {
  if (checkoutInFlightPromise) return;
  setCheckoutInFlight(true);
  const USE_BFF = process.env.NEXT_PUBLIC_USE_BFF === 'true';
  const url = USE_BFF ? `/api/checkout/create-checkout-session` : `${BASE_URL}/api/checkout/create-checkout-session`;
  checkoutInFlightPromise = (async () => {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId, personaKey, locale }),
    });
    const { ok, data } = await readJsonOrText(res);
    if (!ok)
      throw new Error(
        typeof data === "string" ? data : data?.error || "Failed to start checkout"
      );
    if (!data?.url) throw new Error("No checkout URL returned");
    window.location.href = data.url;
  })();
  try {
    await checkoutInFlightPromise;
  } finally {
    checkoutInFlightPromise = null;
    setCheckoutInFlight(false);
  }
}

export async function verifySession(sessionId: string) {
  const USE_BFF = process.env.NEXT_PUBLIC_USE_BFF === 'true';
  const base = USE_BFF ? '' : BASE_URL;
  const res = await fetch(
    `${base}/api/checkout/verify-session?session_id=${encodeURIComponent(sessionId)}`
  );
  const parsed = await readJsonOrText(res);
  return ensureOk<{ status: string; email?: string; packageId?: string }>(
    parsed,
    "Verify session"
  );
}

export type PurchaseResponse = { message: string };

export async function purchasePackage(packageId: string) {
  const USE_BFF = process.env.NEXT_PUBLIC_USE_BFF === 'true';
  const url = USE_BFF ? `/api/user/purchase` : `${BASE_URL}/api/user/purchase`;
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageId }),
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<PurchaseResponse>(parsed, "Purchase package");
}

// -------------------------------
/** User/package */
export interface UserPackageResponse {
  hasAccess: boolean;
  needsInstanceSelection?: boolean;
  instancesCount?: number;
  package?: string;
  faceEnrolled?: boolean;
  faceEnrolledAt?: string | null;
  rekognitionFaceId?: string | null;
  uploadsRemaining?: number;
  expiresAt?: string;
  packageInstanceId?: string;
  packageInstanceCreatedAt?: string;
  uploadsUsed?: number;
  uploadLimit?: number | null;
  addonsUploads?: number;
  addonsChat?: number;
  addonsChatTokens?: number;
  addonsVideos?: number;
  addons?: {
    uploads?: number;
    chatTokens?: number;
    chat?: number;
    sadtalkerVideos?: number;
  };
  effectiveUploadLimit?: number | null;
  effectiveChatLimit?: number | null;
  effectiveVideoLimit?: number | null;
  personaKey?: string | null;
  chatMonthlyLimit?: number | null;
  chatTokenLimit?: number | null;
  chatUsedThisCycle?: number | null;
  chatTokensUsed?: number | null;
  chatRemaining?: number | null;
  chatLimitTokens?: number | null;
  chatUsedTokens?: number | null;
  chatRemainingTokens?: number | null;
  chatCycleEndsAt?: string | null;
  nextReset?: string | null;
  sadtalkerVideoLimit?: number | null;
  sadtalkerVideosLimit?: number | null;
  sadtalkerVideosUsed?: number | null;
  sadtalkerVideosRemaining?: number | null;
  videosLimit?: number | null;
  videosUsed?: number | null;
  videosRemaining?: number | null;
}

export async function updateUserProfile(payload: {
  firstName?: string | null;
  lastName?: string | null;
}): Promise<{
  requestId?: string | null;
  user: { email: string; firstName?: string; lastName?: string };
}> {
  const r = await fetchJson(`${BASE_URL}/api/user/profile`, {
    method: "PATCH",
    cache: "no-store",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const data = r.data as {
      error?: string;
      message?: string;
      errorCode?: string;
      requestId?: string;
    };
    const err = new Error(
      data?.message || data?.error || "Failed to update profile"
    ) as Error & {
      status?: number;
      requestId?: string;
      errorCode?: string;
    };
    err.status = r.status;
    if (typeof data?.requestId === "string") err.requestId = data.requestId;
    if (typeof data?.errorCode === "string") err.errorCode = data.errorCode;
    throw err;
  }

  return r.data as {
    requestId?: string | null;
    user: { email: string; firstName?: string; lastName?: string };
  };
}

function isUnauthorizedError(e: unknown): e is { status?: number; message?: string } {
  if (typeof e !== "object" || e === null) return false;
  const maybe = e as { status?: unknown; message?: unknown };
  return (
    (typeof maybe.status === "number" && maybe.status === 401) ||
    (typeof maybe.message === "string" && maybe.message === "Unauthorized")
  );
}

export async function checkUserPackage(
  options: { force?: boolean } = {}
): Promise<UserPackageResponse> {
  // Simple in-memory cache to avoid duplicate calls from StrictMode double effects
  // and from multiple components on the same view. Stale after 5 seconds.
  const now = Date.now();
  const TTL = 5000;
  const force = options.force === true;
  if (!force && pkgCache.value !== undefined && now - pkgCache.ts < TTL) {
    return pkgCache.value;
  }
  if (!force && pkgCache.inFlight) return pkgCache.inFlight;

  pkgCache.inFlight = (async () => {
    try {
      const r = await fetchJson(`${BASE_URL}/api/user/check-package`, { method: "GET", cache: "no-store" });
      if (!r.ok) {
        const err = new Error("Check user package failed") as Error & {
          status?: number;
          data?: unknown;
        };
        err.status = r.status;
        err.data = r.data;
        throw err;
      }
      const val = r.data as UserPackageResponse;
      pkgCache.value = val;
      pkgCache.ts = Date.now();
      return val;
    } catch (e: unknown) {
      // Do NOT cache unauthorized; let callers retry after auth settles
      if (isUnauthorizedError(e)) {
        return { hasAccess: false } as UserPackageResponse;
      }
      throw e;
    } finally {
      pkgCache.inFlight = null;
    }
  })();
  return pkgCache.inFlight;
}

export type PackageInstanceSummary = {
  id: string;
  planKey: string;
  status: string;
  personaKey: string | null;
  uploadsUsed: number;
  uploadLimit: number;
  addonsUploads?: number;
  addonsChat?: number;
  addonsChatTokens?: number;
  addonsVideos?: number;
  effectiveUploadLimit?: number;
  effectiveChatLimit?: number;
  effectiveVideoLimit?: number;
  uploadsRemaining?: number | null;
  chatRemaining?: number | null;
  videoRemaining?: number | null;
  remaining: number;
  createdAt: string;
  chatMonthlyLimit?: number;
  chatUsedThisCycle?: number;
  sadtalkerVideoLimit?: number;
  sadtalkerVideosUsed?: number;
};

export type AddonType = "uploads" | "chat" | "sadtalkerVideos";
export type AddonPack = "pack_1" | "pack_5" | "pack_20" | "pack_50" | "pack_200";

export async function fetchActivePackageInstances(): Promise<PackageInstanceSummary[]> {
  const r = await fetchJson(`${BASE_URL}/api/user/package-instances`, {
    method: "GET",
    cache: "no-store",
  });
  if (!r.ok) throw new Error("Fetch package instances failed");
  const payload = r.data as { instances?: PackageInstanceSummary[] };
  return payload.instances || [];
}

export async function selectPackageInstance(
  packageInstanceId: string
): Promise<{ activePackageInstanceId: string; instance: PackageInstanceSummary }> {
  const r = await fetchJson(`${BASE_URL}/api/user/select-package-instance`, {
    method: "POST",
    body: JSON.stringify({ packageInstanceId }),
  });
  if (!r.ok) throw new Error("Select package instance failed");
  const payload = r.data as { activePackageInstanceId: string; instance: PackageInstanceSummary };
  return payload;
}

export async function createAddonCheckoutSession(params: {
  addonType: AddonType;
  addonPack: string;
  packageInstanceId: string;
  locale?: string | null;
}): Promise<{ url: string; requestId?: string | null }> {
  const qtyMap: Record<string, number> = {
    pack_1: 1,
    pack_5: 5,
    pack_20: 20,
    pack_50: 50,
    pack_200: 200,
  };
  const addonQty = qtyMap[params.addonPack] ?? undefined;
  const USE_BFF = process.env.NEXT_PUBLIC_USE_BFF === "true";
  const url = USE_BFF
    ? `/api/checkout/create-addon-checkout-session`
    : `${BASE_URL}/api/checkout/create-addon-checkout-session`;
  const r = await fetchJson(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, addonQty }),
  });
  if (!r.ok) {
    const err: Error & { payload?: unknown } = new Error("Failed to create addon checkout session");
    err.payload = r.data;
    throw err;
  }
  return r.data as { url: string; requestId?: string | null };
}

export async function verifyAddonSession(sessionId: string): Promise<{
  applied: boolean;
  instanceId?: string | null;
  delta?: { addonType: string; addonQty: number; addonPack?: string | null } | null;
  paymentStatus?: string;
  sessionId?: string;
  requestId?: string | null;
}> {
  const r = await fetchJson(`${BASE_URL}/api/billing/addons/verify?session_id=${encodeURIComponent(sessionId)}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!r.ok) throw new Error("Verify addon session failed");
  return r.data as {
    applied: boolean;
    instanceId?: string | null;
    delta?: { addonType: string; addonQty: number; addonPack?: string | null } | null;
    paymentStatus?: string;
    sessionId?: string;
    requestId?: string | null;
  };
}

// Package cache (module scope)
const pkgCache: {
  value: UserPackageResponse | undefined; // undefined = unknown
  ts: number;
  inFlight: Promise<UserPackageResponse> | null;
} = { value: undefined, ts: 0, inFlight: null };

// Public helper to clear API client caches (call on logout)
export function clearApiCaches() {
  pkgCache.value = undefined;
  pkgCache.ts = 0;
  pkgCache.inFlight = null;
}

// -------------------------------
// Talking Head (render) stubs
// -------------------------------
export async function renderGenerate(input: {
  text: string;
  voiceId?: string;
  consent: boolean;
}): Promise<{ jobId: string }> {
  const r = await fetchJson(`${BASE_URL}/api/render/generate`, {
    method: "POST",
    body: JSON.stringify(input),
  });
  if (!r.ok) throw new Error("Failed to create render job");
  return r.data as { jobId: string };
}

export async function getRenderJob(jobId: string): Promise<{
  status: "queued" | "running" | "succeeded" | "failed";
  videoUrl?: string;
  error?: string;
}> {
  const r = await fetchJson(`${BASE_URL}/api/render/jobs/${encodeURIComponent(jobId)}`, {
    method: "GET",
  });
  if (!r.ok) throw new Error("Failed to fetch job status");
  return r.data as {
    status: "queued" | "running" | "succeeded" | "failed";
    videoUrl?: string;
    error?: string;
  };
}

// -------------------------------
// Chat types (inline)
// -------------------------------
export interface ChatMeta {
  usedContextIds?: string[];
  requestId?: string;
  latencyMs?: number;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  _id?: string;
  meta?: ChatMeta;
}

export interface ChatConversation {
  _id: string;
  title?: string;
  messages: ChatMessage[];
  updatedAt?: string;
  tokensUsed?: number;
  tokensLimit?: number;
  nearLimit?: boolean;
}

export interface ConversationSummary {
  _id: string;
  title?: string;
  updatedAt?: string;
  continuedFromConversationId?: string | null;
  continuedToConversationId?: string | null;
}

export interface Conversation {
  _id: string;
  title?: string;
  messages: ChatMessage[];
  updatedAt?: string;
  tokensUsed?: number;
  tokensLimit?: number;
  nearLimit?: boolean;
}

// 200 OK payload
export interface CoachChatResponse {
  ai: string;
  conversation: ChatConversation;
  usedContextIds?: string[];
  requestId?: string;
  latencyMs?: number;
  nearContextLimit?: boolean;
  tokensUsed?: number | null;
  tokensLimit?: number | null;
  quota?: { used: number; limit: number }; // optional
}

// non-200 payloads
export interface CoachChatLimitData {
  error: string;
  action?: "upgrade";
  quota?: { used: number; limit: number };
}
export interface CoachChatRateLimitData {
  error?: string;
  message?: string;
}
export interface CoachChatContextLimitData {
  error: string;
  tokensUsed?: number;
  tokensLimit?: number;
}
export interface CoachChatNetworkError {
  error: string;
}
export interface CoachChatGenericError {
  error?: string;
  message?: string;
}

// Discriminated union (no `any`)
export type CoachChatResult =
  | { status: 200; data: CoachChatResponse }
  | { status: 402; data: CoachChatLimitData }
  | { status: 429; data: CoachChatRateLimitData }
  | { status: 409; data: CoachChatContextLimitData }
  | { status: 0; data: CoachChatNetworkError }
  | { status: number; data: CoachChatGenericError };

// -------------------------------
/** Coach chat + conversations */
export async function coachChat({
  question,
  latestContentInfo,
  conversationId,
  title,
}: {
  question: string;
  latestContentInfo?: string;
  conversationId?: string;
  title?: string;
}): Promise<CoachChatResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/coach-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        question,
        latestContentInfo,
        conversationId,
        title,
      }),
    });

    const parsed = await readJsonOrText(res);
  if (res.status === 200)
    return { status: 200, data: parsed.data as CoachChatResponse };
  if (res.status === 402)
    return { status: 402, data: parsed.data as CoachChatLimitData };
  if (res.status === 409)
    return { status: 409, data: parsed.data as CoachChatContextLimitData };
  if (res.status === 429)
    return { status: 429, data: parsed.data as CoachChatRateLimitData };
  return { status: res.status, data: parsed.data as CoachChatGenericError };
} catch {
  return { status: 0, data: { error: "Network error" } };
}
}

export async function summarizeConversation(
  conversationId: string
): Promise<{ newConversationId: string; summary: { summary: string; keyFacts: string[]; userPreferences: string[] } } | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/conversations/${conversationId}/summarize`, {
      method: "POST",
      credentials: "include",
    });
    const parsed = await readJsonOrText(res);
    const data = ensureOk<{
      newConversationId?: string;
      summary?: { summary: string; keyFacts: string[]; userPreferences: string[] };
    }>(parsed, "Summarize conversation");
    if (!data?.newConversationId || !data?.summary) return null;
    return { newConversationId: data.newConversationId, summary: data.summary };
  } catch (error) {
    console.error("Error summarizing conversation:", error);
    return null;
  }
}

export async function fetchConversation(id: string): Promise<Conversation> {
  const res = await fetch(`${BASE_URL}/api/conversations/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    cache: "no-store",
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<Conversation>(parsed, "Fetch conversation");
}

export async function deleteConversation(conversationId: string) {
  const res = await fetch(`${BASE_URL}/api/conversations/${conversationId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const parsed = await readJsonOrText(res);
  return ensureOk(parsed, "Delete conversation");
}

export async function createEmptyConversation(
): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/conversations`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const parsed = await readJsonOrText(res);
    const data = ensureOk<{ _id?: string; id?: string }>(
      parsed,
      "Create conversation"
    );
    return data._id ?? data.id ?? null;
  } catch (error) {
    console.error("Error creating new conversation:", error);
    return null;
  }
}

export async function generateConversationTitle(
  conversationId: string,
  firstUserMessage: string
) {
  const res = await fetch(
    `${BASE_URL}/api/conversations/${conversationId}/generate-title`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ firstUserMessage }),
      cache: "no-store",
    }
  );
  const parsed = await readJsonOrText(res);
  const data = ensureOk<{ title: string | null }>(parsed, "Generate title");
  return data.title || null;
}

export async function fetchConversations(): Promise<ConversationSummary[]> {
  const url = `${BASE_URL}/api/conversations?ts=${Date.now()}`;
  const r = await fetchJson(url, { method: "GET", cache: "no-store" });
  if (!r.ok) throw new Error("Fetch conversations failed");
  return r.data as ConversationSummary[];
}

export async function submitMessageFeedback(
  conversationId: string,
  messageIndex: number,
  vote: "up" | "down"
): Promise<void> {
  await fetch(`${BASE_URL}/api/conversations/${encodeURIComponent(conversationId)}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ messageIndex, vote }),
  });
}

// -------------------------------
/** Feedback */
export async function sendFeedback(message: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/api/feedback`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  const parsed = await readJsonOrText(res);
  if (!parsed.ok) {
    throw new Error(
      typeof parsed.data === "string"
        ? parsed.data
        : parsed.data?.error || `Failed to send feedback (${parsed.status})`
    );
  }
  return parsed.data as { success: boolean };
}

// -------------------------------
/** Analyze (upload + get/update) */
export type AnalyzeResponse = {
  message?: string;
  requestId?: string;
  insights: ResultDoc;
  durations?: {
    total_ms: number;
    vision_ms: number;
    captions_ms: number;
  };
  duplicate?: boolean;
};

type RequestError = Error & {
  requestId?: string;
  code?: string;
  feature?: string;
  plan?: string | null;
  remaining?: number | null;
  limit?: number | null;
  payload?: unknown;
};

type EnrollFaceResponse = { ok: true; faceId?: string; requestId?: string };

export function analyzeImageMultipart(opts: {
  file: File;
  packageInstanceId?: string | null;
  goal?: "subs" | "ppv" | "customs";
  linkBase?: string;
  onProgress?: (pct: number) => void;
  signal?: AbortSignal;
}): Promise<AnalyzeResponse> {
  const { file, packageInstanceId, goal, linkBase, onProgress, signal } = opts;

  const form = new FormData();
  form.append("image", file);
  if (goal) form.append("goal", goal);
  if (linkBase) form.append("linkBase", linkBase);
  if (packageInstanceId) form.append("packageInstanceId", packageInstanceId);

  // Include browser timezone so backend returns local windows
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) form.append("timezone", timezone);
  } catch {}

  const url = `/api/analyze`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.withCredentials = true;

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText) as AnalyzeResponse;
        resolve(json);
        } catch {
          reject(new Error("Invalid JSON from server."));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          const errorObj = new Error(err?.error || `Upload failed (${xhr.status})`) as RequestError;
          if (typeof err?.requestId === "string") errorObj.requestId = err.requestId;
          if (typeof err?.code === "string") errorObj.code = err.code;
          if (typeof err?.feature === "string") errorObj.feature = err.feature;
          if (typeof err?.plan === "string" || err?.plan === null) errorObj.plan = err?.plan ?? null;
          if (typeof err?.remaining === "number") errorObj.remaining = err.remaining;
          if (typeof err?.limit === "number") errorObj.limit = err.limit;
          errorObj.payload = err;
          reject(errorObj);
        } catch {
          reject(new Error(`Upload failed (${xhr.status})`));
        }
      }
    };

    if (xhr.upload && typeof onProgress === "function") {
      xhr.upload.onprogress = (evt) => {
        if (!evt.lengthComputable) return;
        onProgress(Math.round((evt.loaded / evt.total) * 100));
      };
    }

    xhr.onerror = () => reject(new Error("Network error"));

    // Support external abort via AbortController
    let aborted = false;
    const onAbort = () => {
      aborted = true;
      try { xhr.abort(); } catch {}
      reject(new DOMException("Aborted", "AbortError"));
    };
    if (signal) {
      if (signal.aborted) return onAbort();
      signal.addEventListener("abort", onAbort, { once: true });
    }
    xhr.send(form);

    // Cleanup abort listener when promise settles
    const cleanup = () => {
      if (signal) signal.removeEventListener("abort", onAbort);
    };
    xhr.onloadend = () => { if (!aborted) cleanup(); };
  });
}

export function enrollPersonaFaceMultipart(params: { file: File }): Promise<EnrollFaceResponse> {
  const form = new FormData();
  form.append("image", params.file);

  const url = `${BASE_URL}/api/persona/enroll-face`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.withCredentials = true;

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText) as EnrollFaceResponse;
          resolve(json);
        } catch {
          reject(new Error("Invalid JSON from server."));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          const code =
            typeof err?.errorCode === "string"
              ? err.errorCode
              : typeof err?.error === "string"
                ? err.error
                : undefined;
          const message =
            typeof err?.error === "string"
              ? err.error
              : typeof err?.message === "string"
                ? err.message
                : `Enroll failed (${xhr.status})`;
          reject({
            status: xhr.status,
            code,
            requestId: typeof err?.requestId === "string" ? err.requestId : undefined,
            message,
          });
        } catch {
          reject({
            status: xhr.status,
            code: undefined,
            requestId: undefined,
            message: `Enroll failed (${xhr.status})`,
          });
        }
      }
    };

    xhr.onerror = () => reject({ status: 0, code: undefined, requestId: undefined, message: "Network error" });
    xhr.send(form);
  });
}

export async function getAnalysisById(id: string) {
  const res = await fetch(`${BASE_URL}/api/analyze/${id}`, {
    cache: "no-store",
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<ResultDoc>(parsed, "Fetch result by id");
}

export async function getUserResultById({ id }: { id: string }): Promise<ResultDoc> {
  const r = await fetchJson(`${BASE_URL}/api/analyze/${encodeURIComponent(id)}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!r.ok) {
    const data = r.data as { error?: string; requestId?: string };
    const err = new Error(data?.error || "Failed to load report") as Error & {
      status?: number;
      requestId?: string;
    };
    err.status = r.status;
    if (typeof data?.requestId === "string") err.requestId = data.requestId;
    throw err;
  }
  return r.data as ResultDoc;
}

export type RecommendationFeedbackPayload = {
  resultId: string;
  platform: string;
  variantIds: {
    platformMixId?: string | null;
    hashtagPackId?: string | null;
    timePackId?: string | null;
    captionStyleId?: string | null;
    ctaId?: string | null;
  };
  impressions?: number;
  engagement?: number;
};

export async function postRecommendationFeedback(
  payload: RecommendationFeedbackPayload
): Promise<{ ok: boolean; requestId?: string; data?: unknown }> {
  const r = await fetchJson(`${BASE_URL}/api/recommendations/feedback`, {
    method: "POST",
    cache: "no-store",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const data = r.data as {
      error?: string;
      message?: string;
      requestId?: string;
    };
    const err = new Error(
      data?.error || data?.message || "Failed to save recommendation feedback"
    ) as Error & {
      status?: number;
      requestId?: string;
    };
    err.status = r.status;
    if (typeof data?.requestId === "string") err.requestId = data.requestId;
    throw err;
  }

  return {
    ok: true,
    requestId:
      typeof (r.data as { requestId?: unknown })?.requestId === "string"
        ? ((r.data as { requestId?: string }).requestId as string)
        : undefined,
    data: r.data,
  };
}

export async function updateAnalysisById(
  id: string,
  patch: Partial<ResultDoc>
): Promise<ResultDoc> {
  const res = await fetch(`${BASE_URL}/api/analyze/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<ResultDoc>(parsed, "Update analysis");
}
// --- Quick Prompts types ---
export interface SuggestPromptsResponse {
  prompts: string[];
  meta: { plan: string; niche: string; tz: string };
}

// --- Quick Prompts API ---
export async function fetchCoachChatPrompts(): Promise<SuggestPromptsResponse> {
  const url = `${BASE_URL}/api/coach-chat/prompts?ts=${Date.now()}`;
  const r = await fetchJson(url, { method: "GET", cache: "no-store" });
  if (!r.ok) throw new Error("Fetch coach prompts failed");
  return r.data as SuggestPromptsResponse;
}
