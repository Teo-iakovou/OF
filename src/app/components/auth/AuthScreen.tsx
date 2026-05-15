"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import AuthForm from "@/app/components/auth/AuthForm";
import { AnimatePresence, motion } from "framer-motion";

const supportedLocales = ["en", "el", "es", "it"] as const;
type SupportedLocale = (typeof supportedLocales)[number];

type AuthScreenProps = {
  initialMode: "signin" | "signup";
  redirectTo?: string;
  intent?: string;
};

// Colored Google "G" icon — copied from GymOS _AuthLayout.tsx
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// Echofy wordmark — bold "echo" + light accent "fy", tight letter-spacing (GymOS logo pattern)
function EchofyWordmark({ size = 20 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-dm-sans, 'DM Sans'), sans-serif",
        fontSize: size,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      <span style={{ color: "#ffffff", fontWeight: 700 }}>echo</span>
      <span style={{ color: "var(--hg-accent)", fontWeight: 300 }}>fy</span>
    </span>
  );
}

export default function AuthScreen({ initialMode, redirectTo, intent }: AuthScreenProps) {
  const t = useTranslations("authScreen");
  const tAuth = useTranslations("auth");
  const tNav = useTranslations("navbar");
  const locale = useLocale() as SupportedLocale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [langOpen, setLangOpen] = useState(false);
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

  const switchMode = (next: "signin" | "signup") => {
    setMode(next);
    router.replace(next === "signin" ? `/login${query}` : `/signup${query}`);
  };

  const features = t.raw("features") as string[];

  return (
    <div
      className="relative flex min-h-screen w-full text-[var(--hg-text)]"
      style={{ fontFamily: "var(--font-dm-sans, 'DM Sans'), sans-serif" }}
    >
      {/* Full-screen subtle grid — GymOS pattern, cyan at 1.5% opacity */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(80,192,240,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(80,192,240,0.015) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* ── Left panel: branding, hidden on mobile ── */}
      <div className="relative hidden flex-col overflow-hidden bg-[var(--hg-bg)] md:flex md:w-1/2">
        {/* Static blobs — no blur, no animation, 4% opacity (GymOS pattern) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-[var(--hg-accent)]"
          style={{ opacity: 0.04 }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-[var(--hg-accent)]"
          style={{ opacity: 0.04 }}
        />

        {/* Content */}
        <div className="relative flex flex-1 flex-col justify-center px-14 py-16 lg:px-16">
          <div className="max-w-sm">
            {/* Logo */}
            <div className="mb-12">
              <EchofyWordmark size={22} />
            </div>

            {/* Heading — 28px / semibold (GymOS: fontSize:28, fontWeight:600) */}
            <h1
              className="mb-3 font-semibold text-white"
              style={{ fontSize: 28, lineHeight: 1.3 }}
            >
              {t("headingLine1")}
              <br />
              <span className="gradient-word">{t("headingLine2")}</span>
            </h1>

            {/* Subheading */}
            <p className="mb-8 text-sm text-[var(--hg-muted)]" style={{ lineHeight: 1.65 }}>
              {t("leftSubheading")}
            </p>

            {/* Accent line before features (GymOS: 32px × 2px) */}
            <div
              className="mb-4 rounded-sm bg-[var(--hg-accent)]"
              style={{ width: 32, height: 2 }}
            />

            {/* Feature bullets */}
            <ul className="space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--hg-accent)]/10">
                    <Check className="h-3 w-3 text-[var(--hg-accent)]" />
                  </span>
                  <span className="text-[13px] text-[var(--hg-muted)]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom terms */}
        <div className="relative px-14 pb-8 lg:px-16">
          <p className="text-xs text-[var(--hg-muted)]/40">
            {tAuth("termsLine")}{" "}
            <Link href="/terms" className="text-[var(--hg-accent)]/50 hover:underline">
              {tAuth("terms")}
            </Link>{" "}
            &{" "}
            <Link href="/privacy" className="text-[var(--hg-accent)]/50 hover:underline">
              {tAuth("privacy")}
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="relative flex flex-1 flex-col bg-[var(--hg-bg)] md:w-1/2">
        {/* Top bar: lang switcher */}
        <div className="flex justify-end px-6 pt-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 text-xs font-medium text-[var(--hg-muted)] transition-all duration-150 hover:text-[var(--hg-text)]"
            >
              <Globe className="h-3.5 w-3.5" />
              {tNav(`languages.${locale}`)}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-10 z-20 w-24 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-1 shadow-lg shadow-black/20">
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
            )}
          </div>
        </div>

        {/* Centered form content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-[380px]">
            {/* Mobile logo */}
            <div className="mb-8 md:hidden">
              <EchofyWordmark size={20} />
            </div>

            {/* Heading — ABOVE tabs (GymOS order), crossfade on mode switch */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="mb-6"
              >
                <h1 className="font-semibold text-white" style={{ fontSize: 24, lineHeight: 1.3 }}>
                  {mode === "signin" ? t("signIn.heading") : t("createAccount.heading")}
                </h1>
                <p className="mt-1 text-[13px] text-[var(--hg-muted)]">
                  {mode === "signin" ? t("signIn.subheading") : t("createAccount.subheading")}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Tab toggle — CSS only, GymOS style: active = bg-[hg-bg] on bg-[hg-surface] container */}
            <div
              className="mb-6 flex rounded-lg p-[3px]"
              style={{
                background: "var(--hg-surface)",
                border: "0.5px solid var(--hg-border)",
              }}
            >
              {(["signin", "signup"] as const).map((tabKey) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => switchMode(tabKey)}
                  className="flex-1 rounded-md text-[13px] transition-all duration-150"
                  style={{
                    padding: "9px 0",
                    minHeight: 44,
                    background: mode === tabKey ? "var(--hg-bg)" : "transparent",
                    border: `0.5px solid ${mode === tabKey ? "var(--hg-border)" : "transparent"}`,
                    color: mode === tabKey ? "#ffffff" : "var(--hg-muted)",
                    fontWeight: mode === tabKey ? 500 : 400,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  {tabKey === "signin" ? t("tabs.signIn") : t("tabs.createAccount")}
                </button>
              ))}
            </div>

            {/* Google OAuth */}
            <div className="mb-4">
              <a
                href={oauthReady ? googleOauthHref() : undefined}
                className={`inline-flex w-full items-center justify-center gap-[10px] rounded-lg transition-all duration-150 ${
                  oauthReady
                    ? "cursor-pointer hover:border-[var(--hg-accent)]/40"
                    : "cursor-not-allowed"
                }`}
                style={{
                  height: 44,
                  background: "var(--hg-surface)",
                  border: "0.5px solid var(--hg-border)",
                  borderRadius: 8,
                  fontSize: 14,
                  color: oauthReady ? "var(--hg-muted)" : "var(--hg-muted-2)",
                  fontFamily: "inherit",
                }}
              >
                <GoogleIcon />
                {tAuth("continueWithGoogle")}
              </a>
              {oauthReady === false && (
                <p className="mt-2 text-center text-xs text-[var(--hg-muted)]">
                  {tAuth("oauthComingSoon")}
                </p>
              )}
            </div>

            {/* OR divider — hairline (GymOS: height 0.5px) */}
            <div className="mb-4 flex items-center gap-3" style={{ margin: "16px 0" }}>
              <div className="flex-1 bg-[var(--hg-border)]" style={{ height: "0.5px" }} />
              <span
                className="text-[var(--hg-muted)]"
                style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" }}
              >
                {t("orDivider")}
              </span>
              <div className="flex-1 bg-[var(--hg-border)]" style={{ height: "0.5px" }} />
            </div>

            {/* Auth form — keyed to mode so it re-mounts cleanly on tab switch */}
            <AuthForm
              key={mode}
              mode={mode === "signin" ? "login" : "signup"}
              redirectTo={redirectTo}
              intent={intent}
              showForgotPassword={mode === "signin"}
            />

            {/* Bottom toggle link (GymOS pattern) */}
            <div
              className="mt-5 text-center"
              style={{ fontSize: 12, color: "var(--hg-muted)" }}
            >
              {mode === "signin" ? (
                <>
                  {t("switchHint.noAccount")}{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--hg-accent)",
                      cursor: "pointer",
                      fontSize: 12,
                      padding: 0,
                      fontFamily: "inherit",
                    }}
                  >
                    {t("switchHint.createOne")}
                  </button>
                </>
              ) : (
                <>
                  {t("switchHint.haveAccount")}{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--hg-accent)",
                      cursor: "pointer",
                      fontSize: 12,
                      padding: 0,
                      fontFamily: "inherit",
                    }}
                  >
                    {t("tabs.signIn")}
                  </button>
                </>
              )}
            </div>

            {/* Terms — mobile only */}
            <p className="mt-4 text-center text-xs text-[var(--hg-muted)] md:hidden">
              {tAuth("termsLine")}{" "}
              <Link href="/terms" className="text-[var(--hg-accent)] hover:underline">
                {tAuth("terms")}
              </Link>{" "}
              &{" "}
              <Link href="/privacy" className="text-[var(--hg-accent)] hover:underline">
                {tAuth("privacy")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
