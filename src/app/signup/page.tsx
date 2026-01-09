import { redirect } from "next/navigation";
import SignupPageContent from "./SignupPageContent";
import { serverGetUser } from "@/app/utils/serverFetch";
import { sanitizeRedirect } from "@/app/utils/sanitizeRedirect";

export default async function SignupPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const redirectTo = sanitizeRedirect(searchParams?.next);
  const user = await serverGetUser();
  if (user) {
    redirect(redirectTo || "/dashboard");
  }
  return <SignupPageContent redirectTo={redirectTo} />;
}
