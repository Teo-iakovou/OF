// app/utils/debug.ts
export const DEBUG =
  typeof window !== "undefined" &&
  (process.env.NEXT_PUBLIC_DEBUG === "1" ||
    new URLSearchParams(window.location.search).has("debug"));

export function dbg(label: string, data?: unknown) {
  if (!DEBUG) return;
  // safer pretty logging
  try {
    console.groupCollapsed(`[DBG] ${label}`);
    if (data !== undefined) console.log(data);
    console.groupEnd();
  } catch {
    console.log(`[DBG] ${label}`, data);
  }
}