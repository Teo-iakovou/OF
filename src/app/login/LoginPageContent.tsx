"use client";

import AuthPageShell from "@/app/components/auth/AuthPageShell";

export default function LoginPageContent({
  redirectTo,
  intent,
}: {
  redirectTo?: string;
  intent?: string;
}) {
  return <AuthPageShell mode="login" redirectTo={redirectTo} intent={intent} />;
}
