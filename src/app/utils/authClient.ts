"use client";

import { BASE_URL } from "@/app/utils/fetcher";
import { clearUserCache, notifyAuthChange } from "@/app/hooks/useUser";
import { clearApiCaches } from "@/app/utils/api";

const USE_BFF = process.env.NEXT_PUBLIC_USE_BFF === "true";

function getLogoutUrl() {
  return USE_BFF ? "/api/auth/logout" : `${BASE_URL}/api/auth/logout`;
}

export async function logoutClient() {
  try {
    await fetch(getLogoutUrl(), { method: "POST", credentials: "include" });
  } catch (_) {
    // Ignore network failures; we'll clear state locally regardless.
  }
  try {
    localStorage.removeItem("ai_token");
  } catch {}
  try {
    sessionStorage.removeItem("justLoggedIn");
  } catch {}
  try {
    clearUserCache();
  } catch {}
  try {
    clearApiCaches();
  } catch {}
  notifyAuthChange();
}
