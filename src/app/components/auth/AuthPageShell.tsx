"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Globe, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import AuthForm from "@/app/components/auth/AuthForm";

const supportedLocales = ["en", "el", "es", "it"] as const;
type SupportedLocale = (typeof supportedLocales)[number];

type AuthPageShellProps = {
  mode: "login" | "signup";
  redirectTo?: string;
  intent?: string;
};

export default function AuthPageShell({ mode, redirectTo, intent }: AuthPageShellProps) {
  const t = useTranslations("auth");
  const tNav = useTranslations("navbar");
  const locale = useLocale() as SupportedLocale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [langOpen, setLangOpen] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [oauthReady, setOauthReady] = useState<boolean | null>(null);

  const query = useMemo(() => {
    const q = searchParams.toString();
    return q ? `?${q}` : "";
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/google?probe=1", { method: "GET" });
        if (!cancelled) setOauthReady(res.ok);
      } catch {
        if (!cancelled) setOauthReady(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onLocaleChange = (nextLocale: SupportedLocale) => {
    router.replace(`${pathname}${query}`, { locale: nextLocale });
    setLangOpen(false);
  };

  const googleOauthHref = () => {
    const params = new URLSearchParams();
    if (redirectTo) params.set("next", redirectTo);
    if (intent) params.set("intent", intent);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return `/api/auth/google${suffix}`;
  };

  const toggleHref = mode === "login" ? `/signup${query}` : `/login${query}`;

  return (
    <div className="min-h-screen bg-[var(--hg-bg)] text-[var(--hg-text)]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6 md:px-8">
        <div className="flex justify-end">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="inline-flex h-10 items-center gap-1 rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 text-xs font-medium text-[var(--hg-muted)] hover:text-[var(--hg-text)]"
            >
              <Globe className="h-3.5 w-3.5" />
              {tNav(`languages.${locale}`)}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {langOpen ? (
              <div className="absolute right-0 top-11 z-20 w-20 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-1 shadow-lg shadow-black/20">
                {supportedLocales.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onLocaleChange(item)}
                    className={`flex w-full items-center justify-center rounded-lg px-2 py-1.5 text-xs font-medium ${
                      item === locale
                        ? "bg-[var(--hg-surface-2)] text-[var(--hg-text)]"
                        : "text-[var(--hg-muted)] hover:bg-[var(--hg-surface-2)] hover:text-[var(--hg-text)]"
                    }`}
                  >
                    {tNav(`languages.${item}`)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-7">
            <div className="mb-5 space-y-2 text-center">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--hg-muted)]">
                {mode === "login" ? t("signInEyebrow") : t("signUpEyebrow")}
              </p>
              <h1 className="text-2xl font-semibold text-white md:text-3xl">{t("title")}</h1>
              <p className="text-sm text-[var(--hg-muted)]">{t("subtitle")}</p>
            </div>

            <div className="space-y-2">
              <a
                href={oauthReady ? googleOauthHref() : undefined}
                className={`inline-flex h-11 w-full items-center justify-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] text-sm font-medium ${
                  oauthReady ? "text-white hover:border-[var(--hg-accent)]/50" : "cursor-not-allowed text-[var(--hg-muted)]"
                }`}
              >
                {t("continueWithGoogle")}
              </a>
              <button
                type="button"
                onClick={() => setShowEmail((v) => !v)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--hg-accent)] px-4 text-sm font-semibold text-[#07131d] hover:opacity-90"
              >
                <Mail className="h-4 w-4" />
                {t("continueWithEmail")}
              </button>
            </div>

            {oauthReady === false ? (
              <p className="mt-3 text-center text-xs text-[var(--hg-muted)]">{t("oauthComingSoon")}</p>
            ) : null}

            {showEmail ? (
              <div className="mt-5 border-t border-[var(--hg-border)] pt-5">
                <AuthForm
                  mode={mode}
                  redirectTo={redirectTo}
                  intent={intent}
                  submitLabel={mode === "login" ? t("continueWithEmail") : t("createAccount")}
                />
              </div>
            ) : null}

            <div className="mt-5 text-center text-sm text-[var(--hg-muted)]">
              <Link href={toggleHref} className="text-[#9fd9f3] hover:underline">
                {mode === "login" ? t("goToSignup") : t("goToLogin")}
              </Link>
            </div>

            <p className="mt-5 text-center text-xs text-[var(--hg-muted)]">
              {t("termsLine")}{" "}
              <Link href="/terms" className="text-[#9fd9f3] hover:underline">
                {t("terms")}
              </Link>{" "}
              &{" "}
              <Link href="/privacy" className="text-[#9fd9f3] hover:underline">
                {t("privacy")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
