"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Globe, Menu } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { DASHBOARD_LAYOUT } from "@/app/dashboard/dashboardLayout.constants";

const LOCALES = [
  { key: "en", label: "EN" },
  { key: "el", label: "ΕΛ" },
  { key: "es", label: "ES" },
  { key: "it", label: "IT" },
] as const;

type SupportedLocale = (typeof LOCALES)[number]["key"];

type Props = {
  onOpenMenu: () => void;
};

export default function DashboardTopBar({ onOpenMenu }: Props) {
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const locale = useLocale() as SupportedLocale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentLocale = LOCALES.find((item) => item.key === locale) || LOCALES[0];

  useEffect(() => {
    setMobileLangOpen(false);
  }, [pathname]);

  const changeLocale = (nextLocale: SupportedLocale) => {
    const query = searchParams.toString();
    const target = `${pathname}${query ? `?${query}` : ""}`;
    router.replace(target, { locale: nextLocale, scroll: false });
    setMobileLangOpen(false);
  };

  return (
    <div className={`md:hidden fixed left-0 right-0 ${DASHBOARD_LAYOUT.mobileTopBarTopOffset} z-40 flex justify-center`}>
      <div className="w-full max-w-6xl bg-[color:color-mix(in_oklab,white_3%,transparent)] backdrop-blur-[2px]">
        <div className="mx-auto flex h-[calc(env(safe-area-inset-top,0px)+3.8rem)] w-full items-end justify-between px-4 pb-2">
          <button
            aria-label="Open dashboard menu"
            onClick={onOpenMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            <Menu size={18} />
          </button>
          <div className="flex-1" />
          <div className="relative">
            <button
              type="button"
              onClick={() => setMobileLangOpen((v) => !v)}
              aria-label="Change language"
              className="inline-flex h-10 min-w-[56px] items-center justify-center gap-1 rounded-lg px-2.5 text-xs font-semibold text-[var(--hg-muted)] transition hover:bg-white/10 hover:text-[var(--hg-text)]"
            >
              <Globe className="h-3.5 w-3.5" />
              {currentLocale.label}
              <ChevronDown className={`h-3.5 w-3.5 transition ${mobileLangOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileLangOpen ? (
              <div className="absolute right-0 top-11 z-50 w-24 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-1 shadow-[0_10px_22px_rgba(0,0,0,0.24)]">
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
        </div>
      </div>
    </div>
  );
}
