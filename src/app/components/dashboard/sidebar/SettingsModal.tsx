"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { X, User, BarChart3, CreditCard, History } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useUser } from "@/app/hooks/useUser";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import HistoryPanel from "@/app/components/dashboard/history/HistoryPanel";
import BillingPanel from "@/app/components/dashboard/billing/BillingPanel";
import { resolveQuotaContract } from "@/app/utils/quotaContract";
import { toast } from "sonner";
import { updateUserProfile } from "@/app/utils/api";
import { FeedbackWidget } from "@/app/components/features/FeedbackWidget";
import { logoutClient } from "@/app/utils/authClient";
import DeleteAccountModal from "@/app/components/DeleteAccountModal";

export type SettingsSection = "account" | "usage" | "billing" | "history";

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection?: SettingsSection;
  initialBillingAddon?: "uploads" | "chat" | "videos";
};

const SECTION_ICONS: Record<SettingsSection, ComponentType<{ className?: string }>> = {
  account: User,
  usage: BarChart3,
  billing: CreditCard,
  history: History,
};

const isSettingsSection = (value: unknown): value is SettingsSection =>
  value === "account" || value === "usage" || value === "billing" || value === "history";

const fmtN = (value: number | null): string => {
  if (value === null || value === undefined) return "∞";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(Math.round(value));
};

const toPercent = (used: number | null, limit: number | null) => {
  if (limit === null || limit <= 0 || used === null) return 0;
  return Math.max(0, Math.min(100, Math.round((used / limit) * 100)));
};

function UsageBar({
  label,
  used,
  limit,
  remaining,
  isUnlimited = false,
  unlimitedLabel = "Unlimited",
  remainingLabel,
  usedLabel = "used",
}: {
  label: string;
  used: number | null;
  limit: number | null;
  remaining: number | null;
  isUnlimited?: boolean;
  unlimitedLabel?: string;
  remainingLabel?: string;
  usedLabel?: string;
}) {
  const pct = isUnlimited ? 0 : toPercent(used, limit);
  const rightLabel = isUnlimited
    ? unlimitedLabel
    : (remainingLabel ?? `${fmtN(remaining ?? 0)} left`);
  return (
    <div className="rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--hg-text)]">{label}</span>
        <span className="text-[var(--hg-muted)]">{rightLabel}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#50C0F0]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-[11px] text-[var(--hg-muted)]">
        {fmtN(used ?? 0)} {usedLabel}{!isUnlimited && limit !== null ? ` / ${fmtN(limit)}` : ""}
      </div>
    </div>
  );
}

export default function SettingsModal({
  open,
  onOpenChange,
  initialSection = "account",
  initialBillingAddon,
}: SettingsModalProps) {
  const t = useTranslations("dashboard.settings");
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [section, setSection] = useState<SettingsSection>(
    isSettingsSection(initialSection) ? initialSection : "account"
  );
  const { user } = useUser({ required: false });
  const { data: planData } = usePlanInfo();
  const [profileName, setProfileName] = useState<{ firstName: string; lastName: string }>({
    firstName: "",
    lastName: "",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [billingRefreshToken, setBillingRefreshToken] = useState(0);
  const [saveError, setSaveError] = useState<{ message: string; requestId?: string | null } | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [saveSupportId, setSaveSupportId] = useState<string | null>(null);

  const initials = useMemo(() => {
    const source =
      profileName.firstName?.trim() ||
      user?.firstName?.trim() ||
      user?.email?.trim() ||
      "U";
    return source.slice(0, 1).toUpperCase();
  }, [profileName.firstName, user?.firstName, user?.email]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open || !user?.id) return;
    const nextFirst = typeof user?.firstName === "string" ? user.firstName : "";
    const nextLast = typeof user?.lastName === "string" ? user.lastName : "";
    setProfileName({ firstName: nextFirst, lastName: nextLast });
    setFirstName(nextFirst);
    setLastName(nextLast);
    setInitialFirstName(nextFirst);
    setInitialLastName(nextLast);
    setSaveError(null);
    setSavedAt(null);
    setSaveSupportId(null);
  }, [open, user?.id, user?.firstName, user?.lastName]);

  useEffect(() => {
    if (!open) return;
    setSection(isSettingsSection(initialSection) ? initialSection : "account");
  }, [open, initialSection]);

  useEffect(() => {
    const onCloseEvent = () => onOpenChange(false);
    window.addEventListener("dashboard:close-settings", onCloseEvent);
    return () => window.removeEventListener("dashboard:close-settings", onCloseEvent);
  }, [onOpenChange]);

  useEffect(() => {
    const onAddonApplied = () => setBillingRefreshToken((prev) => prev + 1);
    window.addEventListener("dashboard:addon-purchase-applied", onAddonApplied);
    return () => window.removeEventListener("dashboard:addon-purchase-applied", onAddonApplied);
  }, []);

  const sections: Array<{ key: SettingsSection; label: string; icon: ComponentType<{ className?: string }> }> = [
    { key: "account", label: t("tabAccount"), icon: SECTION_ICONS.account },
    { key: "usage", label: t("tabUsage"), icon: SECTION_ICONS.usage },
    { key: "billing", label: t("tabBilling"), icon: SECTION_ICONS.billing },
    { key: "history", label: t("tabHistory"), icon: SECTION_ICONS.history },
  ];

  if (!open || !mounted) return null;

  const activeSection: SettingsSection = isSettingsSection(section) ? section : "account";

  const hasNameChanges =
    firstName.trim() !== initialFirstName.trim() || lastName.trim() !== initialLastName.trim();

  const quotas = resolveQuotaContract(planData, "settings.modal");
  const uploadsUsed = quotas.uploads.used;
  const uploadsLimit = quotas.uploads.effectiveLimit;
  const uploadsRemaining = quotas.uploads.remaining;
  const uploadsUnlimited = quotas.uploads.isUnlimited;
  const chatUsed = quotas.aiTokens.used;
  const chatLimit = quotas.aiTokens.effectiveLimit;
  const chatRemaining = quotas.aiTokens.remaining;
  const chatUnlimited = quotas.aiTokens.isUnlimited;
  const videosUsed = quotas.videos.used;
  const videosLimit = quotas.videos.effectiveLimit;
  const videosRemaining = quotas.videos.remaining;
  const videosUnlimited = quotas.videos.isUnlimited;

  const modal = (
    <div className="fixed inset-0 z-[120]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label={t("closeBackdropAriaLabel")}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Panel — full-screen on mobile, centered card on desktop */}
      <div
        className="fixed inset-0 z-[130] flex flex-col overflow-hidden bg-[var(--hg-surface)] shadow-2xl
          md:absolute md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:rounded-2xl md:border md:border-[var(--hg-border)]
          md:w-[min(1100px,calc(100vw-32px))] md:h-[min(720px,calc(100dvh-32px))]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--hg-border-2)] px-4 py-3 md:px-6">
          <h2 className="text-lg font-semibold text-white">{t("heading")}</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-[var(--hg-muted)] hover:text-white"
            aria-label={t("closeBtnAriaLabel")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-y-auto md:min-h-0 md:overflow-hidden md:grid md:grid-cols-[240px_1fr]">

          {/* Nav — horizontal scrollable tabs on mobile, vertical sidebar on desktop */}
          <aside className="shrink-0 border-b border-[var(--hg-border-2)] md:flex md:flex-col md:border-b-0 md:border-r md:p-3">
            {/* Mobile tabs */}
            <nav className="flex gap-1 overflow-x-auto px-3 py-2 md:hidden">
              {sections.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSection(item.key)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition ${
                      active
                        ? "bg-[var(--hg-accent-soft)] text-[#50C0F0]"
                        : "text-[var(--hg-muted)] hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop sidebar nav */}
            <nav className="hidden space-y-1 md:block">
              {sections.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSection(item.key)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-[var(--hg-accent-soft)] text-[#50C0F0]"
                        : "text-[var(--hg-muted)] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop-only footer actions */}
            <div className="mt-4 hidden border-t border-[var(--hg-border-2)] pt-3 md:block">
              <button
                type="button"
                onClick={async () => {
                  if (loggingOut) return;
                  setLoggingOut(true);
                  try {
                    await logoutClient();
                    onOpenChange(false);
                    router.replace("/login");
                  } finally {
                    setLoggingOut(false);
                  }
                }}
                disabled={loggingOut}
                className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/10 disabled:opacity-60"
              >
                {loggingOut ? t("signingOut") : t("signOut")}
              </button>
            </div>
          </aside>

          {/* Content */}
          <section className="p-4 md:min-h-0 md:flex-1 md:overflow-y-auto md:p-6">
            {activeSection === "account" ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 text-sm font-medium text-white/85 shadow-sm">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white/90">
                      {[profileName.firstName, profileName.lastName].filter(Boolean).join(" ").trim() ||
                        user?.email ||
                        "Account"}
                    </p>
                    <p className="truncate text-xs text-white/60">{user?.email ?? "—"}</p>
                    <p className="mt-0.5 text-xs text-white/45">{t("manageProfile")}</p>
                  </div>
                </div>
                <div className="h-px w-full bg-white/10" />
                <div className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="settings-first-name" className="text-xs tracking-wide text-white/60">
                        {t("firstName")}
                      </label>
                      <input
                        id="settings-first-name"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder={t("firstNamePlaceholder")}
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-sky-400/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="settings-last-name" className="text-xs tracking-wide text-white/60">
                        {t("lastName")}
                      </label>
                      <input
                        id="settings-last-name"
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder={t("lastNamePlaceholder")}
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-sky-400/30"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-white/45">{t("emailHint")}</p>
                  <div className="space-y-1.5">
                    <label htmlFor="settings-email" className="text-xs tracking-wide text-white/60">
                      {t("email")}
                    </label>
                    <input
                      id="settings-email"
                      type="text"
                      value={user?.email ?? "—"}
                      disabled
                      readOnly
                      className="h-11 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-3 text-sm text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={async () => {
                      setSaveError(null);
                      setSavedAt(null);
                      setSaveSupportId(null);
                      if (!hasNameChanges || saving) return;
                      try {
                        setSaving(true);
                        const payload = await updateUserProfile({
                          firstName: firstName.trim(),
                          lastName: lastName.trim(),
                        });
                        const nextFirst =
                          typeof payload?.user?.firstName === "string"
                            ? payload.user.firstName
                            : firstName.trim();
                        const nextLast =
                          typeof payload?.user?.lastName === "string"
                            ? payload.user.lastName
                            : lastName.trim();
                        setProfileName({ firstName: nextFirst, lastName: nextLast });
                        setFirstName(nextFirst);
                        setLastName(nextLast);
                        setInitialFirstName(nextFirst);
                        setInitialLastName(nextLast);
                        setSavedAt(Date.now());
                        toast.success(t("saved"));
                      } catch (err: unknown) {
                        const requestId =
                          err && typeof err === "object" && "requestId" in err
                            ? (err as { requestId?: string }).requestId || null
                            : null;
                        const status =
                          err && typeof err === "object" && "status" in err
                            ? (err as { status?: number }).status
                            : null;
                        const fallbackMessage =
                          status === 404
                            ? t("failedSaveEnv")
                            : t("failedSave");
                        setSaveError({
                          message: err instanceof Error ? err.message || fallbackMessage : fallbackMessage,
                          requestId,
                        });
                        setSaveSupportId(requestId);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={!hasNameChanges || saving}
                    className="h-10 rounded-xl bg-[#50C0F0] px-4 text-sm font-semibold text-[#07131d] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? t("saving") : t("saveChanges")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFirstName(initialFirstName);
                      setLastName(initialLastName);
                      setSaveError(null);
                      setSaveSupportId(null);
                    }}
                    disabled={saving || !hasNameChanges}
                    className="h-10 rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface-2)] px-4 text-sm text-[var(--hg-muted)] transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("cancel")}
                  </button>
                </div>
                {savedAt ? (
                  <p className="text-xs text-emerald-300">{t("saved")}</p>
                ) : null}
                {saveError ? (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                    <p>{saveError.message}</p>
                    {saveSupportId ? (
                      <div className="mt-1 flex items-center gap-2">
                        <span>{t("supportId", { id: saveSupportId })}</span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(saveSupportId)}
                          className="rounded border border-rose-200/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wide hover:border-rose-100"
                        >
                          {t("copy")}
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {/* Danger Zone */}
                <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
                  <h3 className="text-sm font-semibold text-red-400">{t("dangerZone.title")}</h3>
                  <p className="mt-1 text-xs text-zinc-400">{t("dangerZone.description")}</p>
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    className="mt-3 rounded-lg border border-red-500/40 bg-transparent px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    {t("dangerZone.deleteButton")}
                  </button>
                </div>
              </div>
            ) : null}

            <DeleteAccountModal
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onSuccess={() => {
                window.location.href = "/";
              }}
            />

            {activeSection === "usage" ? (
              <div className="space-y-3">
                <p className="text-xs text-[var(--hg-muted)]">
                  {t("usageDesc")}
                </p>
                <UsageBar
                  label={t("usageUploads")}
                  used={uploadsUsed}
                  limit={uploadsLimit}
                  remaining={uploadsRemaining}
                  isUnlimited={uploadsUnlimited}
                  unlimitedLabel={t("usageUnlimited")}
                  remainingLabel={t("usageRemaining", { n: fmtN(uploadsRemaining ?? 0) })}
                  usedLabel={t("usageUsed")}
                />
                <UsageBar
                  label={t("usageAiTokens")}
                  used={chatUsed}
                  limit={chatLimit}
                  remaining={chatRemaining}
                  isUnlimited={chatUnlimited}
                  unlimitedLabel={t("usageUnlimited")}
                  remainingLabel={t("usageRemaining", { n: fmtN(chatRemaining ?? 0) })}
                  usedLabel={t("usageUsed")}
                />
                <UsageBar
                  label={t("usageAvatarVideos")}
                  used={videosUsed}
                  limit={videosLimit}
                  remaining={videosRemaining}
                  isUnlimited={videosUnlimited}
                  unlimitedLabel={t("usageUnlimited")}
                  remainingLabel={t("usageRemaining", { n: fmtN(videosRemaining ?? 0) })}
                  usedLabel={t("usageUsed")}
                />
              </div>
            ) : null}

            {activeSection === "billing" ? (
              <BillingPanel
                embedded
                refreshToken={billingRefreshToken}
                initialAddon={initialBillingAddon}
              />
            ) : null}

            {activeSection === "history" ? (
              <HistoryPanel embedded />
            ) : null}
          </section>
        </div>

        {/* Mobile-only footer actions */}
        <div className="shrink-0 border-t border-[var(--hg-border-2)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          <div className="mb-3">
            <FeedbackWidget variant="inline" />
          </div>
          <div>
            <button
              type="button"
              onClick={async () => {
                if (loggingOut) return;
                setLoggingOut(true);
                try {
                  await logoutClient();
                  onOpenChange(false);
                  router.replace("/login");
                } finally {
                  setLoggingOut(false);
                }
              }}
              disabled={loggingOut}
              className="flex w-full items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-60"
            >
              {loggingOut ? t("signingOut") : t("signOut")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
