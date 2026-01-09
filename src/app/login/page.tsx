import { redirect } from "next/navigation";
import LoginPageContent from "./LoginPageContent";
import { serverGetUser } from "@/app/utils/serverFetch";
import { sanitizeRedirect } from "@/app/utils/sanitizeRedirect";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const redirectTo = sanitizeRedirect(resolvedSearchParams?.next);
  const user = await serverGetUser();
  if (user) {
    redirect(redirectTo || "/dashboard");
  }

  return <LoginPageContent redirectTo={redirectTo} />;
}
