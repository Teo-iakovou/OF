import { redirect } from "@/i18n/navigation";
import LoginPageContent from "@/app/login/LoginPageContent";
import { serverGetUser } from "@/app/utils/serverFetch";
import { sanitizeRedirect } from "@/app/utils/sanitizeRedirect";

export default async function LoginPage({
  searchParams,
  params,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const redirectTo = sanitizeRedirect(resolvedSearchParams?.next);
  const user = await serverGetUser();
  if (user) {
    redirect({ href: redirectTo || "/dashboard", locale });
  }

  return <LoginPageContent redirectTo={redirectTo} />;
}
