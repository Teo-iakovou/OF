"use client";

import { fetchJson } from "@/app/utils/fetcher";
import { clearUserCache, notifyAuthChange } from "@/app/hooks/useUser";
import { clearApiCaches } from "@/app/utils/api";
import { clearSessionExpiredState, suppressSessionExpiry } from "@/app/utils/sessionExpiry";

function getLogoutUrl() {
  return "/api/auth/logout";
}

export async function logoutClient() {
  // Intentional sign-out: suppress global session-expired notifications caused by
  // in-flight dashboard requests that may 401 during redirect to login.
  suppressSessionExpiry(6000);
  try {
    await fetchJson(getLogoutUrl(), { method: "POST" });
  } catch (_) {
    // Ignore network failures; we'll clear state locally regardless.
  }
  try {
    sessionStorage.removeItem("justLoggedIn");
  } catch {}
  try {
    clearUserCache();
  } catch {}
  try {
    clearApiCaches();
  } catch {}
  try {
    clearSessionExpiredState();
  } catch {}
  notifyAuthChange();
}
