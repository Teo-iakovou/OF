"use client";

import { fetchJson } from "@/app/utils/fetcher";
import { clearUserCache, notifyAuthChange } from "@/app/hooks/useUser";
import { clearApiCaches } from "@/app/utils/api";
import { clearSessionExpiredState } from "@/app/utils/sessionExpiry";

function getLogoutUrl() {
  return "/api/auth/logout";
}

export async function logoutClient() {
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
