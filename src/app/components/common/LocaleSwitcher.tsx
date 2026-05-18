"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

const LOCALES = [
  { key: "en", label: "EN" },
  { key: "el", label: "ΕΛ" },
  { key: "es", label: "ES" },
  { key: "it", label: "IT" },
] as const;

type SupportedLocale = (typeof LOCALES)[number]["key"];

type Props = {
  /**
   * "pill"    — AuthScreen style: rounded-full border, full locale name
   * "compact" — Dashboard style: no border, short code label (EN / ΕΛ / ES / IT)
   */
  variant?: "pill" | "compact";
  className?: string;
};

export default function LocaleSwitcher({ variant = "compact", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const locale = useLocale() as SupportedLocale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tNav = useTranslations("navbar");

  // Close dropdown on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const changeLocale = (nextLocale: SupportedLocale) => {
    const query = searchParams.toString();
    const target = `${pathname}${query ? `?${query}` : ""}`;
    router.replace(target, { locale: nextLocale, scroll: false });
    setOpen(false);
  };

  const currentLocale = LOCALES.find((l) => l.key === locale) ?? LOCALES[0];

  if (variant === "pill") {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Change language"
          aria-expanded={open}
          className="inline-flex h-9 items-center gap-1 rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 text-xs font-medium text-[var(--hg-muted)] transition-all duration-150 hover:text-[var(--hg-text)]"
        >
          <Globe className="h-3.5 w-3.5" />
          {tNav(`languages.${locale}`)}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        {open && (
          <div className="absolute right-0 top-10 z-20 w-24 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-1 shadow-lg shadow-black/20">
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
                {tNav(`languages.${item.key}`)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // compact variant
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
        className="inline-flex h-9 min-w-[56px] items-center justify-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-[var(--hg-muted)] transition hover:bg-white/10 hover:text-[var(--hg-text)]"
      >
        <Globe className="h-3.5 w-3.5" />
        {currentLocale.label}
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="absolute right-0 top-10 z-50 w-24 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-1 shadow-[0_10px_22px_rgba(0,0,0,0.24)]">
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
  );
}
