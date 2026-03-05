const memoryStore = new Map<string, number>();
const DEFAULT_TTL_MS = 15_000;

function now() {
  return Date.now();
}

function readStoredExpiry(key: string): number | null {
  const memoryExpiry = memoryStore.get(key);
  if (typeof memoryExpiry === "number") return memoryExpiry;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`toastDedupe:${key}`);
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function shouldToastOnce(key: string, ttlMs = DEFAULT_TTL_MS): boolean {
  const expiry = readStoredExpiry(key);
  if (typeof expiry === "number" && expiry > now()) return false;
  return true;
}

export function markToasted(key: string, ttlMs = DEFAULT_TTL_MS): void {
  const expiry = now() + ttlMs;
  memoryStore.set(key, expiry);
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`toastDedupe:${key}`, String(expiry));
  } catch {}
}
