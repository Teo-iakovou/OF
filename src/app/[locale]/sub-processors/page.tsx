import { getTranslations } from "next-intl/server";
import LandingNavbar from "@/app/components/landing/LandingNavbar";
import LandingFooter from "@/app/components/landing/LandingFooter";
import { PRIVACY_EMAIL } from "@/config/contact";

export const dynamic = "force-static";

const SUB_PROCESSORS = [
  {
    id: "openai",
    name: "OpenAI, L.L.C.",
    location: "USA",
    transferMechanism: "EU SCCs + DPA",
    privacyUrl: "https://openai.com/policies/privacy-policy",
  },
  {
    id: "heygen",
    name: "HeyGen, Inc.",
    location: "USA",
    transferMechanism: "EU SCCs + DPA",
    privacyUrl: "https://www.heygen.com/policy",
  },
  {
    id: "aws_rekognition",
    name: "Amazon Web Services, Inc. (Rekognition)",
    location: "USA (us-east-1)",
    transferMechanism: "EU SCCs + AWS DPA",
    privacyUrl: "https://aws.amazon.com/privacy/",
  },
  {
    id: "cloudflare_r2",
    name: "Cloudflare, Inc. (R2 storage)",
    location: "USA / Global edge",
    transferMechanism: "EU SCCs + DPA",
    privacyUrl: "https://www.cloudflare.com/privacypolicy/",
  },
  {
    id: "stripe",
    name: "Stripe, Inc.",
    location: "USA (Ireland for EU customers)",
    transferMechanism: "EU SCCs + DPA",
    privacyUrl: "https://stripe.com/privacy",
  },
  {
    id: "mongodb_atlas",
    name: "MongoDB, Inc. (Atlas)",
    location: "Ireland (EEA)",
    transferMechanism: "Within EEA — no transfer",
    privacyUrl: "https://www.mongodb.com/legal/privacy-policy",
  },
  {
    id: "google_oauth",
    name: "Google LLC (OAuth)",
    location: "USA",
    transferMechanism: "EU SCCs + DPA",
    privacyUrl: "https://policies.google.com/privacy",
  },
  {
    id: "railway",
    name: "Railway Corp.",
    location: "USA",
    transferMechanism: "EU SCCs",
    privacyUrl: "https://railway.com/legal/privacy",
  },
  {
    id: "netlify",
    name: "Netlify, Inc.",
    location: "USA",
    transferMechanism: "EU SCCs",
    privacyUrl: "https://www.netlify.com/privacy/",
  },
] as const;

type ProcessorId = (typeof SUB_PROCESSORS)[number]["id"];

export default async function SubProcessorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "subProcessors" });

  return (
    <div className="min-h-screen bg-[var(--hg-bg)] text-[var(--hg-text)]">
      <LandingNavbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <article className="rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 md:p-8">
          <h1 className="text-3xl font-semibold text-white md:text-4xl">{t("title")}</h1>
          <p className="mt-2 text-sm text-[var(--hg-muted)]">
            {t("lastUpdated")}: 2026-06-10
          </p>

          <section className="mt-8 space-y-3">
            <p className="text-sm text-[var(--hg-muted)]">{t("intro")}</p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-white">{t("activeListHeading")}</h2>
            <p className="mt-2 text-sm text-[var(--hg-muted)]">{t("activeListDescription")}</p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-[var(--hg-muted)]">
                    <th className="py-3 pr-4 font-medium">{t("table.processor")}</th>
                    <th className="py-3 pr-4 font-medium">{t("table.purpose")}</th>
                    <th className="py-3 pr-4 font-medium">{t("table.dataCategories")}</th>
                    <th className="py-3 pr-4 font-medium">{t("table.location")}</th>
                    <th className="py-3 font-medium">{t("table.transferMechanism")}</th>
                  </tr>
                </thead>
                <tbody>
                  {SUB_PROCESSORS.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 align-top">
                      <td className="py-4 pr-4">
                        <div className="font-medium text-white">{p.name}</div>
                        <a
                          href={p.privacyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:underline"
                        >
                          {t("table.privacyPolicyLink")} ↗
                        </a>
                      </td>
                      <td className="py-4 pr-4 text-[var(--hg-muted)]">
                        {t(`processors.${p.id as ProcessorId}.purpose`)}
                      </td>
                      <td className="py-4 pr-4 text-xs text-[var(--hg-muted)]">
                        {t(`processors.${p.id as ProcessorId}.dataCategories`)}
                      </td>
                      <td className="py-4 pr-4 text-xs text-[var(--hg-muted)] whitespace-nowrap">
                        {p.location}
                      </td>
                      <td className="py-4 text-xs text-[var(--hg-muted)]">
                        {p.transferMechanism}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10 space-y-8">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">{t("biometricHeading")}</h2>
              <p className="text-sm text-[var(--hg-muted)]">{t("biometricNotice")}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">{t("changesHeading")}</h2>
              <p className="text-sm text-[var(--hg-muted)]">{t("changesNotice")}</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">{t("contactHeading")}</h2>
              <p className="text-sm text-[var(--hg-muted)]">
                {t("contactNotice")}{" "}
                <a
                  href={`mailto:${PRIVACY_EMAIL}`}
                  className="text-blue-400 hover:underline"
                >
                  {PRIVACY_EMAIL}
                </a>
              </p>
            </div>
          </section>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}
