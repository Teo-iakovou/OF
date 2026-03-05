"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = [
  { key: "en", label: "EN" },
  { key: "el", label: "ΕΛ" },
  { key: "es", label: "ES" },
  { key: "it", label: "IT" },
] as const;

const supportedLocales = LOCALES.map((item) => item.key);

type SupportedLocale = (typeof supportedLocales)[number];

function stripLocalePrefix(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length > 0 && supportedLocales.includes(parts[0] as SupportedLocale)) {
    const stripped = `/${parts.slice(1).join("/")}`;
    return stripped === "/" ? "/" : stripped;
  }
  return pathname;
}

export default function LandingNavbar() {
  const t = useTranslations("navbar");
  const [open, setOpen] = useState(false);
  const [desktopLangOpen, setDesktopLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale() as SupportedLocale;
  const currentLocale = LOCALES.find((item) => item.key === locale) || LOCALES[0];

  const links = useMemo(
    () => [
      { label: t("links.features"), href: "#features" },
      { label: t("links.howItWorks"), href: "#how" },
      { label: t("links.pricing"), href: "#pricing" },
      { label: t("links.faq"), href: "#faq" },
    ],
    [t]
  );

  const basePath = useMemo(() => stripLocalePrefix(pathname), [pathname]);
  const isLandingPath = basePath === "/";

  const sectionHref = (hash: string) => {
    if (isLandingPath) return hash;
    return locale === "en" ? `/${hash}` : `/${locale}${hash}`;
  };

  const getLocalePath = () => basePath;

  const changeLocale = (nextLocale: SupportedLocale) => {
    const query = searchParams.toString();
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const target = `${getLocalePath()}${query ? `?${query}` : ""}${hash}`;
    router.replace(target, { locale: nextLocale });
    setDesktopLangOpen(false);
    setMobileLangOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    setDesktopLangOpen(false);
    setMobileLangOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-6xl rounded-full border border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-surface)_82%,transparent)] shadow-lg shadow-black/20 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href={locale === "en" ? "/" : `/${locale}`} className="inline-flex items-center gap-2">
            <Image src="/echofy-removebg-preview.png" alt="Echofy" width={34} height={34} className="rounded-full" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={sectionHref(link.href)}
                className="text-sm text-[var(--hg-muted)] transition hover:text-[var(--hg-text)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setDesktopLangOpen((v) => !v)}
                className="inline-flex h-10 items-center gap-1 rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 text-xs font-medium text-[var(--hg-muted)] hover:text-[var(--hg-text)]"
                aria-label={t("language")}
              >
                <Globe className="h-3.5 w-3.5" />
                {currentLocale.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {desktopLangOpen ? (
                <div className="absolute right-0 top-11 z-20 w-24 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-1 shadow-lg shadow-black/20">
                  {LOCALES.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => changeLocale(item.key)}
                      className={`flex w-full items-center justify-center rounded-lg px-2 py-1.5 text-xs font-medium ${
                        item.key === locale
                          ? "bg-[var(--hg-surface-2)] text-[var(--hg-text)]"
                          : "text-[var(--hg-muted)] hover:bg-[var(--hg-surface-2)] hover:text-[var(--hg-text)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface)] px-4 text-sm font-medium text-[var(--hg-text)] hover:border-[var(--hg-accent)]/45"
            >
              {t("signIn")}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface-2)] text-[var(--hg-text)] md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed left-4 right-4 top-[76px] z-50 md:hidden">
          <div className="flex flex-col gap-1 rounded-2xl border border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-surface)_90%,transparent)] px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-md">
            {links.map((link) => (
              <a
                key={link.href}
                href={sectionHref(link.href)}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-[var(--hg-muted)] hover:bg-[var(--hg-surface-2)] hover:text-[var(--hg-text)]"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMobileLangOpen((v) => !v)}
                  className="inline-flex h-10 items-center gap-1 rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 text-xs font-medium text-[var(--hg-muted)]"
                  aria-label={t("language")}
                >
                  <Globe className="h-3.5 w-3.5" />
                  {currentLocale.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {mobileLangOpen ? (
                  <div className="absolute left-0 top-11 z-10 w-24 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-1 shadow-lg shadow-black/20">
                    {LOCALES.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => changeLocale(item.key)}
                        className={`flex w-full items-center justify-center rounded-lg px-2 py-1.5 text-xs font-medium ${
                          item.key === locale
                            ? "bg-[var(--hg-surface-2)] text-[var(--hg-text)]"
                            : "text-[var(--hg-muted)] hover:bg-[var(--hg-surface-2)] hover:text-[var(--hg-text)]"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 text-sm font-medium text-[var(--hg-text)]"
              >
                {t("signIn")}
              </Link>
              <a
                href={sectionHref("#pricing")}
                onClick={() => setOpen(false)}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-[var(--hg-accent)] px-4 text-sm font-semibold text-[#07131d]"
              >
                {t("getStarted")}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
