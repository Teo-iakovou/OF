// src/app/utils/api.ts
import type { ResultDoc } from "@/app/types/analysis";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// -------------------------------
// Small helpers
// -------------------------------
export function getClientEmail(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("userEmail") || "";
}

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
  email: string,
  page = 1,
  limit = 10
): Promise<{ results: ResultDoc[]; total: number }> {
  const params = new URLSearchParams({
    email,
    page: String(page),
    limit: String(limit),
    ts: String(Date.now()),
  });

  const res = await fetch(`${BASE_URL}/api/analyze?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<{ results: ResultDoc[]; total: number }>(
    parsed,
    "Fetch analysis history"
  );
}

export async function deleteAnalysisResult(id: string) {
  const res = await fetch(`${BASE_URL}/api/analyze/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<{ message: string }>(parsed, "Delete analysis result");
}

// -------------------------------
/** Stripe (unchanged) */
export async function startCheckout(email: string, packageId: string) {
  const res = await fetch(`${BASE_URL}/api/checkout/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, packageId }),
  });
  const { ok, data } = await readJsonOrText(res);
  if (!ok)
    throw new Error(
      typeof data === "string" ? data : data?.error || "Failed to start checkout"
    );
  if (!data?.url) throw new Error("No checkout URL returned");
  window.location.href = data.url;
}

export async function verifySession(sessionId: string) {
  const res = await fetch(
    `${BASE_URL}/api/checkout/verify-session?session_id=${encodeURIComponent(
      sessionId
    )}`
  );
  const parsed = await readJsonOrText(res);
  return ensureOk<{ status: string; email?: string; packageId?: string }>(
    parsed,
    "Verify session"
  );
}

export type PurchaseResponse = { message: string };

export async function purchasePackage(email: string, packageId: string) {
  const res = await fetch(`${BASE_URL}/api/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, packageId }),
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<PurchaseResponse>(parsed, "Purchase package");
}

// -------------------------------
/** User/package */
export interface UserPackageResponse {
  hasAccess: boolean;
  package?: string;
  uploadsRemaining?: number;
  expiresAt?: string;
}

export async function checkUserPackage(
  email: string
): Promise<UserPackageResponse> {
  const res = await fetch(
    `${BASE_URL}/api/user/check-package?email=${encodeURIComponent(email)}`
  );
  const parsed = await readJsonOrText(res);
  return ensureOk<UserPackageResponse>(parsed, "Check user package");
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
  role: "user" | "assistant";
  content: string;
  _id?: string;
  meta?: ChatMeta;
}

export interface ChatConversation {
  _id: string;
  title?: string;
  messages: ChatMessage[];
  updatedAt?: string;
}

export interface ConversationSummary {
  _id: string;
  title?: string;
  updatedAt?: string;
}

export interface Conversation {
  _id: string;
  title?: string;
  messages: ChatMessage[];
  updatedAt?: string;
}

// 200 OK payload
export interface CoachChatResponse {
  ai: string;
  conversation: ChatConversation;
  usedContextIds?: string[];
  requestId?: string;
  latencyMs?: number;
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
  | { status: 0; data: CoachChatNetworkError }
  | { status: number; data: CoachChatGenericError };

// -------------------------------
/** Coach chat + conversations */
export async function coachChat({
  email,
  question,
  latestContentInfo,
  conversationId,
  title,
}: {
  email: string;
  question: string;
  latestContentInfo?: string;
  conversationId?: string;
  title?: string;
}): Promise<CoachChatResult> {
  try {
    const res = await fetch(`${BASE_URL}/api/coach-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
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
    if (res.status === 429)
      return { status: 429, data: parsed.data as CoachChatRateLimitData };
    return { status: res.status, data: parsed.data as CoachChatGenericError };
  } catch {
    return { status: 0, data: { error: "Network error" } };
  }
}

export async function fetchConversation(id: string): Promise<Conversation> {
  const res = await fetch(`${BASE_URL}/api/conversations/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<Conversation>(parsed, "Fetch conversation");
}

export async function deleteConversation(conversationId: string) {
  const res = await fetch(`${BASE_URL}/api/conversations/${conversationId}`, {
    method: "DELETE",
  });
  const parsed = await readJsonOrText(res);
  return ensureOk(parsed, "Delete conversation");
}

export async function createEmptyConversation(
  email: string
): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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
      body: JSON.stringify({ firstUserMessage }),
      cache: "no-store",
    }
  );
  const parsed = await readJsonOrText(res);
  const data = ensureOk<{ title: string | null }>(parsed, "Generate title");
  return data.title || null;
}

export async function fetchConversations(
  email: string
): Promise<ConversationSummary[]> {
  const url = `${BASE_URL}/api/conversations?email=${encodeURIComponent(
    email
  )}&ts=${Date.now()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<ConversationSummary[]>(parsed, "Fetch conversations");
}

// -------------------------------
/** Feedback */
export async function sendFeedback(
  message: string,
  email?: string
): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, email }),
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

export function analyzeImageMultipart(opts: {
  file: File;
  email: string;
  goal?: "subs" | "ppv" | "customs";
  linkBase?: string;
  captions?: boolean; // default true
  onProgress?: (pct: number) => void;
}): Promise<AnalyzeResponse> {
  const { file, email, goal, linkBase, onProgress, captions = true } = opts;

  const form = new FormData();
  form.append("image", file);
  form.append("email", email);
  if (goal) form.append("goal", goal);
  if (linkBase) form.append("linkBase", linkBase);

  // Include browser timezone so backend returns local windows
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) form.append("timezone", timezone);
  } catch {}

  const url =
    `${BASE_URL}/api/analyze` + (captions === false ? `?captions=false` : "");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);

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
          reject(new Error(err?.error || `Upload failed (${xhr.status})`));
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

export async function updateAnalysisById(
  id: string,
  patch: Partial<ResultDoc>
): Promise<ResultDoc> {
  const res = await fetch(`${BASE_URL}/api/analyze/${id}`, {
    method: "PATCH",
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
export async function fetchCoachChatPrompts(
  email: string
): Promise<SuggestPromptsResponse> {
  const url = `${BASE_URL}/api/coach-chat/prompts?email=${encodeURIComponent(email)}&ts=${Date.now()}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  const parsed = await readJsonOrText(res);
  return ensureOk<SuggestPromptsResponse>(parsed, "Fetch coach prompts");
}