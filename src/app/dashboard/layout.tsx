import LayoutClient from "./LayoutClient";
import { serverGetUser, serverFetchJson } from "@/app/utils/serverFetch";
import { redirect } from "next/navigation";
import type { UserPackageResponse } from "@/app/utils/api";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await serverGetUser();
  if (!initialUser) {
    redirect("/");
  }

  const pkg = await serverFetchJson("/api/user/check-package", { method: "GET" });
  const data = pkg.data as UserPackageResponse | null;
  if (!pkg.ok || !data?.hasAccess) {
    redirect("/#packages");
  }

  return <LayoutClient initialUser={initialUser}>{children}</LayoutClient>;
}
