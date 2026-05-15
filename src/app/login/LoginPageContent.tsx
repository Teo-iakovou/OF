"use client";

import AuthScreen from "@/app/components/auth/AuthScreen";

export default function LoginPageContent({
  redirectTo,
  intent,
}: {
  redirectTo?: string;
  intent?: string;
}) {
  return <AuthScreen initialMode="signin" redirectTo={redirectTo} intent={intent} />;
}
