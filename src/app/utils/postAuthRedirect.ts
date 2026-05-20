import { inferPackageIdFromPath } from "@/app/utils/authRedirect";

/**
 * Single source of truth for post-login/signup redirect destination.
 * Used by AuthForm (client), login/page.tsx (server), signup/page.tsx (server).
 *
 * Priority:
 *  1. Checkout intent on a package detail page (next=/pro) → /checkout?packageId=pro
 *  2. Explicit ?next= → use it as-is
 *  3. Package state → /dashboard (has package) or /account/plans (no package)
 */
export function decidePostAuthRedirect({
  next,
  intent,
  hasActivePackage,
}: {
  next: string | null | undefined;
  intent: string | null | undefined;
  hasActivePackage: boolean;
}): string {
  if (intent === "checkout" && next) {
    const packageId = inferPackageIdFromPath(next);
    if (packageId) return `/checkout?packageId=${encodeURIComponent(packageId)}`;
  }
  if (next) return next;
  return hasActivePackage ? "/dashboard" : "/account/plans";
}
