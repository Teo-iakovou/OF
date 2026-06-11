"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronUp, CircleHelp, CreditCard, LogOut, Settings, User } from "lucide-react";
import { logoutClient } from "@/app/utils/authClient";
import { useUser } from "@/app/hooks/useUser";
import type { SettingsSection } from "@/app/components/dashboard/sidebar/SettingsModal";
import { SUPPORT_EMAIL } from "@/config/contact";

type ProfileMenuButtonProps = {
  expanded: boolean;
  onOpenCookiePreferences?: () => void;
  onOpenSettings?: (section?: SettingsSection) => void;
};

export default function ProfileMenuButton({
  expanded,
  onOpenCookiePreferences,
  onOpenSettings,
}: ProfileMenuButtonProps) {
  const router = useRouter();
  const t = useTranslations("dashboard");
  const { user } = useUser({ required: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const avatarLetter = (user?.email?.trim()?.[0] || "U").toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      const target = event.target as Node;
      if (!rootRef.current.contains(target)) setMenuOpen(false);
    };
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutClient();
      router.replace("/login");
    } finally {
      setLoggingOut(false);
      setMenuOpen(false);
    }
  };

  return (
    <>
      <div ref={rootRef} className="relative w-full">
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`group flex w-full items-center gap-3 rounded-2xl border border-transparent text-left transition ${
            expanded ? "justify-start px-3 py-2.5" : "justify-center py-1.5"
          } ${menuOpen ? "border-[var(--hg-border)] bg-[var(--hg-surface-2)]/65" : "hover:border-[var(--hg-border)]/80 hover:bg-[var(--hg-surface-2)]/50"}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          title={t("sidebar.profile")}
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hg-border)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--hg-surface-2)_95%,transparent),#0f1726)] text-sm font-semibold text-white/75 shadow-sm transition-all duration-200 group-hover:border-[var(--hg-accent)]/35 group-hover:text-white"
          >
            {avatarLetter}
          </span>
          {expanded ? (
            <>
              <span className="text-sm font-medium text-slate-300 group-hover:text-[#9eddf8]">
                {t("sidebar.profile")}
              </span>
              <ChevronUp
                className={`ml-auto h-4 w-4 text-slate-500 transition ${
                  menuOpen ? "" : "rotate-180"
                }`}
              />
            </>
          ) : null}
        </button>

        {menuOpen ? (
          <div
            role="menu"
            className="absolute left-full top-1/2 z-50 ml-3 min-w-[230px] -translate-y-[70%] rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] p-1.5 shadow-[0_12px_26px_rgba(0,0,0,0.26)]"
          >
            <Link
              href="/account/profile"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--hg-text)] transition hover:bg-white/5"
            >
              <User className="h-4 w-4 text-slate-400" />
              {t("sidebar.menu.myAccount")}
            </Link>
            <Link
              href="/account/plans"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--hg-text)] transition hover:bg-white/5"
            >
              <CreditCard className="h-4 w-4 text-slate-400" />
              {t("sidebar.menu.plansBilling")}
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenSettings?.("account");
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--hg-text)] transition hover:bg-white/5"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              {t("sidebar.menu.settings")}
            </button>
            <Link
              href={`mailto:${SUPPORT_EMAIL}`}
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--hg-text)] transition hover:bg-white/5"
            >
              <CircleHelp className="h-4 w-4 text-slate-400" />
              {t("sidebar.menu.helpCenter")}
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenCookiePreferences?.();
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--hg-text)] transition hover:bg-white/5"
            >
              <CircleHelp className="h-4 w-4 text-slate-400" />
              {t("sidebar.menu.cookiePreferences")}
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/10 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? t("sidebar.menu.loggingOut") : t("sidebar.menu.logOut")}
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
