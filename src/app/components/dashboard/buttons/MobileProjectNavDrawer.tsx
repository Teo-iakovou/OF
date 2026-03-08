"use client";
import { useState } from "react";
import {
  X,
  LayoutDashboard,
  UploadCloud,
  MessageCircle,
  Video,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { logoutClient } from "@/app/utils/authClient";

type Props = {
  open: boolean;
  onClose: () => void;
  onOpenSettings?: () => void;
};

const primaryItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload Content", icon: UploadCloud },
  { href: "/dashboard/ai-chat", label: "AI Chat", icon: MessageCircle },
  { href: "/dashboard/talking-head", label: "AI Video Avatar", icon: Video },
] as const;

export default function MobileProjectNavDrawer({ open, onClose, onOpenSettings }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[2147483648]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Top sheet */}
      <div
        className="absolute inset-x-3 top-3 max-h-[84svh] overflow-hidden rounded-3xl border border-[var(--hg-border)] bg-[color:color-mix(in_oklab,var(--hg-surface)_96%,transparent)] shadow-[0_30px_70px_rgba(0,0,0,0.58)]"
      >
        <div className="flex items-center justify-between border-b border-[var(--hg-border)] px-4 pb-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--hg-muted-2)]">Dashboard</p>
            <p className="text-sm font-semibold text-white">Navigation</p>
          </div>
          <button
            aria-label="Close navigation"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--hg-border)] bg-[var(--hg-surface-2)] text-[var(--hg-muted)] hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="max-h-[calc(84svh-4.5rem)] overflow-y-auto px-3 py-3">
          <p className="px-2 pb-1 text-[10px] uppercase tracking-[0.12em] text-[var(--hg-muted-2)]">
            Workspace
          </p>
          <ul className="space-y-1.5">
            {primaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block rounded-xl px-4 py-3 text-sm transition ${
                      isActive
                        ? "border border-[var(--hg-accent)]/25 bg-[var(--hg-accent)]/14 text-[#9eddf8]"
                        : "border border-transparent text-[var(--hg-text)]/88 hover:bg-[var(--hg-surface-2)] hover:text-[#9eddf8]"
                    }`}
                    onClick={onClose}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? "text-[#50C0F0]" : "text-[var(--hg-muted)]"}`} />
                      <span className="font-medium">{item.label}</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-[var(--hg-muted-2)]" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSettings?.();
            }}
            className="mt-3 flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-left text-sm text-[var(--hg-text)]/88 transition hover:bg-[var(--hg-surface-2)] hover:text-[#9eddf8]"
          >
            <Settings className="h-4 w-4 text-[var(--hg-muted)]" />
            <span className="font-medium">Settings</span>
            <ChevronRight className="ml-auto h-3.5 w-3.5 text-[var(--hg-muted-2)]" />
          </button>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--hg-border)] pt-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-3 py-2.5 text-xs font-semibold text-[var(--hg-muted)] hover:text-white"
              onClick={onClose}
            >
              Exit
            </Link>
            <button
              type="button"
              disabled={isLoggingOut}
              onClick={async () => {
                if (isLoggingOut) return;
                setIsLoggingOut(true);
                try {
                  await logoutClient();
                } finally {
                  onClose();
                  router.replace("/login");
                  setIsLoggingOut(false);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2.5 text-xs font-semibold text-rose-200 disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" />
              {isLoggingOut ? "Logging out" : "Log out"}
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
