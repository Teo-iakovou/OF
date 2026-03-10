"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  PanelRight,
  GemIcon,
} from "lucide-react";
import Image from "next/image";
import ProfileMenuButton from "@/app/components/dashboard/sidebar/ProfileMenuButton";
import PackagesModal from "@/app/components/dashboard/sidebar/PackagesModal";
import { Link as I18nLink, usePathname } from "@/i18n/navigation";
import { getTopLevelDashboardNavItems } from "@/app/components/dashboard/navigation/dashboardNav.config";
import { DASHBOARD_LAYOUT } from "@/app/dashboard/dashboardLayout.constants";
import type { SettingsSection } from "@/app/components/dashboard/sidebar/SettingsModal";

const navItems = getTopLevelDashboardNavItems("desktop").filter(
  (item) => item.type === "route" && item.href
);

export default function DashboardSidebar({
  expanded,
  setExpanded,
  onOpenCookiePreferences,
  onOpenSettings,
}: {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  onOpenCookiePreferences?: () => void;
  onOpenSettings?: (section?: SettingsSection) => void;
}) {
  const t = useTranslations("dashboardNav");
  const pathname = usePathname();
  const [packagesOpen, setPackagesOpen] = useState(false);
  const packagesIconSize = 22;

  useEffect(() => {
    const onOpenPackages = () => setPackagesOpen(true);
    window.addEventListener("dashboard:open-packages", onOpenPackages);
    return () => window.removeEventListener("dashboard:open-packages", onOpenPackages);
  }, []);

  // Helper: exact match for root (/dashboard), prefix match for subpages
  const isItemActive = (href?: string) => {
    if (!href) return false;
    if (href === "/dashboard") return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className={`
        flex flex-col justify-between items-center overflow-visible
        border border-[var(--hg-border)] rounded-3xl
        bg-[color:color-mix(in_oklab,var(--hg-surface)_94%,transparent)]
        shadow-[0_14px_34px_rgba(0,0,0,0.24)]
        transition-all duration-300 ease-out fixed ${DASHBOARD_LAYOUT.sidebarTopOffset} ${DASHBOARD_LAYOUT.sidebarLeftOffset}
        ${expanded ? "w-64" : "w-16"}
        py-3 px-2 z-30
      `}
      style={{
        minWidth: expanded ? DASHBOARD_LAYOUT.sidebarExpandedWidth : DASHBOARD_LAYOUT.sidebarCollapsedWidth,
        maxWidth: expanded ? DASHBOARD_LAYOUT.sidebarExpandedWidth : DASHBOARD_LAYOUT.sidebarCollapsedWidth,
        height: "calc(100svh - 2rem)",
      }}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center gap-2 pt-1.5">
        {/* Toggle: PanelRightOpen icon */}
        <div
          role="button"
          tabIndex={0}
          className="flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full border border-transparent bg-[var(--hg-surface)]/35 text-slate-400 transition hover:border-[var(--hg-border)] hover:text-[#50C0F0]"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setExpanded(!expanded);
          }}
        >
          <PanelRight
            size={22}
            className={`${expanded ? "" : "rotate-180 transition-transform duration-300"}`}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-2 px-1 pt-1.5">
          <I18nLink href="/dashboard" className="flex flex-col items-center group transition">
            <Image
              src="/echofy-removebg-preview.png"
              alt="Platform Logo"
              width={expanded ? 52 : 44}
              height={expanded ? 52 : 44}
              className="rounded-full object-cover border border-[var(--hg-border)] ring-1 ring-black/10 group-hover:scale-105 transition"
            />
          </I18nLink>
        </div>

        <div className="mt-2 h-px w-full bg-[var(--hg-border)]/80" />

        {/* Nav Items */}
        <ul className="mt-5 flex w-full flex-col items-center gap-2 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);
            const label = item.labelKey ? t(item.labelKey) : item.label;

            const base =
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer font-medium text-[15px] transition-all duration-200 w-full border";
            const itemSurface = active
              ? "border-transparent bg-[color:color-mix(in_oklab,var(--hg-accent)_5%,transparent)]"
              : "border-transparent hover:border-[var(--hg-border)]/60 hover:bg-[var(--hg-surface-2)]/50";
            const labelCls = active ? "text-[#aee5fb]" : "text-slate-300/95 group-hover:text-[#9eddf8]";
            const iconCls = active ? "text-[#63c9f5] drop-shadow-[0_0_6px_rgba(80,192,240,0.24)]" : "text-slate-400 group-hover:text-[#50C0F0]";

            return (
              <li key={item.key} className="relative group w-full">
                {active ? (
                  <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-[#63c9f5]" />
                ) : null}
                {item.href ? (
                  <I18nLink href={item.href}>
                    <span className={`${base} ${itemSurface}`}>
                      <Icon size={22} className={iconCls} />
                      {expanded && (
                        <span className={`whitespace-nowrap leading-none ${labelCls}`}>{label}</span>
                      )}
                    </span>
                  </I18nLink>
                ) : (
                  <span className={`${base} ${itemSurface}`}>
                    <Icon size={22} className={iconCls} />
                    {expanded && <span className={`whitespace-nowrap ${labelCls}`}>{label}</span>}
                  </span>
                )}

                {!expanded && (
                  <div className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 py-1 text-xs font-semibold text-white opacity-0 shadow-[0_8px_18px_rgba(0,0,0,0.28)] transition group-hover:pointer-events-auto group-hover:opacity-100">
                    {label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex w-full flex-col items-center gap-1.5 px-1 pb-1">
        <button
          type="button"
          onClick={() => setPackagesOpen(true)}
          className="group relative flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-left text-[15px] font-medium transition-all duration-200 hover:border-[var(--hg-border)]/80 hover:bg-[var(--hg-surface-2)]/65"
          title="Packages"
        >
          {packagesOpen ? (
            <span className="absolute left-0 top-1/2 h-7 w-[2px] -translate-y-1/2 rounded-full bg-[#50C0F0]" />
          ) : null}
          <GemIcon
            size={packagesIconSize}
            className={`${
              packagesOpen
                ? "text-[#50C0F0] block shrink-0"
                : "text-slate-400 group-hover:text-[#50C0F0] block shrink-0"
            }`}
          />
          {expanded ? (
            <span className={packagesOpen ? "text-[#50C0F0]" : "text-slate-300 group-hover:text-[#50C0F0]"}>
              Packages
            </span>
          ) : null}
          {!expanded ? (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto bg-[var(--hg-surface-2)] border border-[var(--hg-border)] text-white px-3 py-1 rounded shadow-lg text-xs font-semibold z-50 transition whitespace-nowrap">
              Packages
            </div>
          ) : null}
        </button>
        <ProfileMenuButton
          expanded={expanded}
          onOpenCookiePreferences={onOpenCookiePreferences}
          onOpenSettings={onOpenSettings}
        />
      </div>
      <PackagesModal open={packagesOpen} onOpenChange={setPackagesOpen} />
    </nav>
  );
}
