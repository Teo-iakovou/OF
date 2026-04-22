"use client";

export const AUTH_EVENT = "ai-auth-changed";
export const SESSION_EXPIRED_EVENT = "ai-session-expired";

let sessionExpiredInFlight = false;
let suppressUntil = 0;

function isSuppressed() {
  if (typeof window === "undefined") return false;
  return Date.now() < suppressUntil;
}

export function notifySessionExpired() {
  if (typeof window === "undefined") return;
  if (isSuppressed()) return;
  if (sessionExpiredInFlight) return;
  sessionExpiredInFlight = true;
  try {
    window.dispatchEvent(new Event(AUTH_EVENT));
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  } catch {}
  window.setTimeout(() => {
    sessionExpiredInFlight = false;
  }, 1500);
}

export function clearSessionExpiredState() {
  sessionExpiredInFlight = false;
  suppressUntil = 0;
}

export function suppressSessionExpiry(ms = 5000) {
  if (typeof window === "undefined") return;
  suppressUntil = Date.now() + Math.max(0, ms);
}
