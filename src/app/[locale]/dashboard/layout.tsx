import LayoutClient from "@/app/dashboard/LayoutClient";
import { serverGetUser } from "@/app/utils/serverFetch";
import { redirect } from "@/i18n/navigation";
import { PlanProvider } from "@/app/dashboard/PlanContext";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const initialUser = await serverGetUser();
  const { locale } = await params;
  if (!initialUser) {
    redirect({ href: "/login?next=/dashboard", locale });
  }
  return (
    <PlanProvider>
      <LayoutClient initialUser={initialUser}>{children}</LayoutClient>
    </PlanProvider>
  );
}
