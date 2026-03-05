"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronUp, CircleHelp, LogOut, Settings } from "lucide-react";
import { logoutClient } from "@/app/utils/authClient";
import SettingsModal from "@/app/components/dashboard/sidebar/SettingsModal";
import { useUser } from "@/app/hooks/useUser";

type ProfileMenuButtonProps = {
  expanded: boolean;
  onOpenCookiePreferences?: () => void;
};

export default function ProfileMenuButton({
  expanded,
  onOpenCookiePreferences,
}: ProfileMenuButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser({ required: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<"account" | "usage" | "billing" | "history">("account");
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

  useEffect(() => {
    const modal = searchParams.get("modal");
    const settings = searchParams.get("settings");
    const tab = searchParams.get("tab");
    const shouldOpen = modal === "settings" || settings === "1";
    if (!shouldOpen) return;

    const nextSection =
      tab === "history" || tab === "billing" || tab === "usage" || tab === "account"
        ? tab
        : "account";
    setSettingsSection(nextSection);
    setSettingsOpen(true);

    const next = new URLSearchParams(searchParams.toString());
    next.delete("modal");
    next.delete("settings");
    next.delete("tab");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [searchParams, pathname, router]);

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
          className={`group flex w-full items-center gap-3 rounded-xl text-left transition ${
            expanded ? "justify-start px-3 py-2" : "justify-center py-1"
          }`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          title="Profile"
        >
          <span
            className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 text-white/70 shadow-sm hover:shadow-md hover:text-white hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            {avatarLetter}
          </span>
          {expanded ? (
            <>
              <span className="text-sm font-medium text-slate-300 group-hover:text-[#50C0F0]">
                Profile
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
            className="absolute left-full ml-3 top-1/2 -translate-y-[70%] z-50 min-w-[220px] rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-1.5 shadow-xl"
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSettingsOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--hg-text)] hover:bg-white/5"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              Settings
            </button>
            <Link
              href="mailto:support@yourapp.com"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--hg-text)] hover:bg-white/5"
            >
              <CircleHelp className="h-4 w-4 text-slate-400" />
              Help Center
            </Link>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenCookiePreferences?.();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--hg-text)] hover:bg-white/5"
            >
              <CircleHelp className="h-4 w-4 text-slate-400" />
              Cookie preferences
            </button>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-200 hover:bg-rose-500/10 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        ) : null}
      </div>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        initialSection={settingsSection}
      />
    </>
  );
}
