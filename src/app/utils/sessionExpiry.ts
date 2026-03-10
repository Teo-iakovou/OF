"use client";

export const AUTH_EVENT = "ai-auth-changed";
export const SESSION_EXPIRED_EVENT = "ai-session-expired";

let sessionExpiredInFlight = false;

export function notifySessionExpired() {
  if (typeof window === "undefined") return;
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
}

