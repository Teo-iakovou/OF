export function sanitizeRedirect(input?: string | string[]) {
  const value = Array.isArray(input) ? input[0] : input;
  if (typeof value !== "string" || !value.startsWith("/")) return "/dashboard";
  try {
    const url = new URL(value, "http://localhost");
    return url.pathname + url.search + url.hash;
  } catch {
    return "/dashboard";
  }
}
