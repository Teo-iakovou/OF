import { redirect } from "@/i18n/navigation";

const PASS_THROUGH_PARAMS = ["addon", "status", "kind", "session_id"] as const;

type BillingRedirectPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BillingRedirectPage({
  params,
  searchParams,
}: BillingRedirectPageProps) {
  const { locale } = await params;
  const incoming = await searchParams;
  const next = new URLSearchParams({
    settings: "1",
    tab: "billing",
  });

  for (const key of PASS_THROUGH_PARAMS) {
    const value = incoming[key];
    if (typeof value === "string" && value) {
      next.set(key, value);
    }
  }

  redirect({ href: `/dashboard?${next.toString()}`, locale });
}
