import { redirect } from "@/i18n/navigation";
import { serverGetUser } from "@/app/utils/serverFetch";
import { PlanProvider } from "@/app/dashboard/PlanContext";
import AccountShell from "@/app/account/AccountShell";

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const initialUser = await serverGetUser();
  const { locale } = await params;

  if (!initialUser) {
    redirect({ href: "/login?next=/account/plans", locale });
  }

  return (
    <PlanProvider>
      <AccountShell>{children}</AccountShell>
    </PlanProvider>
  );
}
