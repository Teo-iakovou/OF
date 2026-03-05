"use client";

import AuthPageShell from "@/app/components/auth/AuthPageShell";

export default function SignupPageContent({
  redirectTo,
  intent,
}: {
  redirectTo?: string;
  intent?: string;
}) {
  return <AuthPageShell mode="signup" redirectTo={redirectTo} intent={intent} />;
}
