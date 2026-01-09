import LayoutClient from "./LayoutClient";
import { serverGetUser } from "@/app/utils/serverFetch";
import { redirect } from "next/navigation";
import { PlanProvider } from "@/app/dashboard/PlanContext";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await serverGetUser();
  if (!initialUser) {
    redirect("/login?next=/dashboard");
  }
  return (
    <PlanProvider>
      <LayoutClient initialUser={initialUser}>{children}</LayoutClient>
    </PlanProvider>
  );
}
