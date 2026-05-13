import { redirect } from "@/i18n/navigation";
import { serverGetUser, serverGetActivePackage } from "@/app/utils/serverFetch";
import LandingPage from "./LandingPage";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const user = await serverGetUser();

  if (user) {
    const hasPackage = await serverGetActivePackage();
    if (hasPackage) {
      redirect({ href: "/dashboard", locale });
    } else {
      redirect({ href: "/account/plans", locale });
    }
  }

  return <LandingPage />;
}
