import LayoutClient from "./LayoutClient";
import { serverGetUser } from "@/app/utils/serverFetch";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await serverGetUser();
  return <LayoutClient initialUser={initialUser}>{children}</LayoutClient>;
}
