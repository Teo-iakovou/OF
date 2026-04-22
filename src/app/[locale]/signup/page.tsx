import { redirect } from "@/i18n/navigation";
import SignupPageContent from "@/app/signup/SignupPageContent";
import { serverFetchJson, serverGetUser } from "@/app/utils/serverFetch";
import { sanitizeRedirect } from "@/app/utils/sanitizeRedirect";

export default async function SignupPage({
  searchParams,
  params,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const hasExplicitNext = typeof resolvedSearchParams?.next !== "undefined";
  const redirectTo = hasExplicitNext ? sanitizeRedirect(resolvedSearchParams?.next) : undefined;
  const intent = Array.isArray(resolvedSearchParams?.intent)
    ? resolvedSearchParams?.intent?.[0]
    : resolvedSearchParams?.intent;
  const user = await serverGetUser();
  if (user) {
    const pkg = await serverFetchJson("/api/user/check-package", { method: "GET" });
    const packageData = pkg.data as { hasAccess?: boolean; packageInstanceId?: string } | null;
    const hasActiveAccess = Boolean(packageData?.hasAccess && packageData?.packageInstanceId);
    if (hasActiveAccess) {
      redirect({ href: "/dashboard", locale });
    }
    redirect({ href: redirectTo || "/dashboard", locale });
  }
  return <SignupPageContent redirectTo={redirectTo} intent={intent} />;
}
