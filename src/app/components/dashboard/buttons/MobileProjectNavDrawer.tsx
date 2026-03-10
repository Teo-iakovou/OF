"use client";
import {
  X,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { getTopLevelDashboardNavItems } from "@/app/components/dashboard/navigation/dashboardNav.config";
import { useTranslations } from "next-intl";
import type { SettingsSection } from "@/app/components/dashboard/sidebar/SettingsModal";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenSettings?: (section?: SettingsSection) => void;
};

export default function MobileProjectNavDrawer({ open, onClose, onOpenSettings }: Props) {
  const t = useTranslations("dashboardNav");
  const pathname = usePathname();
  const navItems = getTopLevelDashboardNavItems("mobile");
  const isItemActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[2147483648]">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      <div className="fixed left-4 right-4 top-[calc(env(safe-area-inset-top,0px)+4.2rem)] z-[2147483649] md:hidden">
        <div className="rounded-2xl border border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-surface)_90%,transparent)] px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between border-b border-[var(--hg-border)]/35 pb-2">
            <Image
              src="/echofy-removebg-preview.png"
              alt="Echofy"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--hg-muted-2)]">
              Menu
            </span>
            <button
              aria-label="Close navigation"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface-2)] text-[var(--hg-text)]"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const href = item.type === "route" ? item.href : undefined;
                const isActive = Boolean(href && isItemActive(href));
                const label = item.labelKey ? t(item.labelKey) : item.label;

                if (!href) {
                  return (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenSettings?.(item.actionSection || "account");
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-[var(--hg-muted)] transition hover:bg-[var(--hg-surface-2)] hover:text-[var(--hg-text)]"
                      >
                        <Icon className="h-5 w-5 shrink-0 text-current" />
                        <span>{label}</span>
                        <ChevronRight className="ml-auto h-3.5 w-3.5 text-[var(--hg-muted-2)]" />
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={item.key}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition ${
                        isActive
                          ? "border border-[var(--hg-border)]/70 bg-[var(--hg-surface-2)] text-[var(--hg-text)]"
                          : "text-[var(--hg-muted)] hover:bg-[var(--hg-surface-2)] hover:text-[var(--hg-text)]"
                      }`}
                      onClick={onClose}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-current" />
                      <span>{label}</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-[var(--hg-muted-2)]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
