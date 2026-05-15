"use client";

import AuthScreen from "@/app/components/auth/AuthScreen";

export default function SignupPageContent({
  redirectTo,
  intent,
}: {
  redirectTo?: string;
  intent?: string;
}) {
  return <AuthScreen initialMode="signup" redirectTo={redirectTo} intent={intent} />;
}
