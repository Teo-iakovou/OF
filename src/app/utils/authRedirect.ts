import { sanitizeRedirect } from "@/app/utils/sanitizeRedirect";

const localePattern = /^(en|el|es|it)$/;
const packageIds = new Set(["lite", "pro", "ultimate"]);

function detectLocalePrefix(pathname: string): string {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && localePattern.test(first) ? `/${first}` : "";
}

export function inferPackageIdFromPath(path: string): string | null {
  const safe = sanitizeRedirect(path);
  const parts = safe.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean) || [];
  if (parts.length === 0) return null;

  const withoutLocale = localePattern.test(parts[0]) ? parts.slice(1) : parts;
  if (withoutLocale.length === 0) return null;

  const direct = withoutLocale[0];
  if (packageIds.has(direct)) return direct;

  const pkgIndex = withoutLocale.indexOf("packages");
  if (pkgIndex >= 0) {
    const candidate = withoutLocale[pkgIndex + 1];
    if (candidate && packageIds.has(candidate)) return candidate;
  }

  return null;
}

export function buildLoginHref(pathname: string, nextPath: string, intent?: string): string {
  const safeNext = sanitizeRedirect(nextPath);
  const localePrefix = detectLocalePrefix(pathname);
  const params = new URLSearchParams({ next: safeNext });
  if (intent) params.set("intent", intent);
  return `${localePrefix}/login?${params.toString()}`;
}
