export function sanitizeRedirect(input?: string | string[]) {
  const value = Array.isArray(input) ? input[0] : input;
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const url = new URL(value, "http://localhost");
    if (!url.pathname.startsWith("/")) return "/";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}
