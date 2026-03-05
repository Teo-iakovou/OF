"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { X, User, BarChart3, CreditCard, History } from "lucide-react";
import { useUser } from "@/app/hooks/useUser";
import { usePlanInfo } from "@/app/dashboard/PlanContext";
import HistoryPanel from "@/app/components/dashboard/history/HistoryPanel";
import BillingPanel from "@/app/components/dashboard/billing/BillingPanel";
import { toast } from "sonner";
import { updateUserProfile } from "@/app/utils/api";

type SettingsSection = "account" | "usage" | "billing" | "history";

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection?: SettingsSection;
};

const sections: Array<{ key: SettingsSection; label: string; icon: ComponentType<{ className?: string }> }> = [
  { key: "account", label: "Account", icon: User },
  { key: "usage", label: "Usage", icon: BarChart3 },
  { key: "billing", label: "Plan & Billing", icon: CreditCard },
  { key: "history", label: "History", icon: History },
];

const toPercent = (used: number | null, limit: number | null) => {
  if (limit === null || limit <= 0 || used === null) return 0;
  return Math.max(0, Math.min(100, Math.round((used / limit) * 100)));
};

function UsageBar({
  label,
  used,
  limit,
  remaining,
}: {
  label: string;
  used: number | null;
  limit: number | null;
  remaining: number | null;
}) {
  const pct = toPercent(used, limit);
  const rightLabel = limit === null ? "Unlimited" : `${remaining ?? 0} left`;
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
        {used ?? 0} used{limit !== null ? ` / ${limit}` : ""}
      </div>
    </div>
  );
}

export default function SettingsModal({ open, onOpenChange, initialSection = "account" }: SettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [section, setSection] = useState<SettingsSection>("account");
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
    setSection(initialSection);
  }, [open, initialSection]);

  useEffect(() => {
    const onCloseEvent = () => onOpenChange(false);
    window.addEventListener("dashboard:close-settings", onCloseEvent);
    return () => window.removeEventListener("dashboard:close-settings", onCloseEvent);
  }, [onOpenChange]);

  if (!open || !mounted) return null;

  const hasNameChanges =
    firstName.trim() !== initialFirstName.trim() || lastName.trim() !== initialLastName.trim();

  const uploadsUsed = typeof planData?.uploadsUsed === "number" ? planData.uploadsUsed : null;
  const uploadsLimit =
    typeof planData?.effectiveUploadLimit === "number" ? planData.effectiveUploadLimit : null;
  const uploadsRemaining =
    typeof planData?.uploadsRemaining === "number" ? planData.uploadsRemaining : null;
  const chatUsed =
    typeof planData?.chatUsedTokens === "number"
      ? planData.chatUsedTokens
      : typeof planData?.chatTokensUsed === "number"
        ? planData.chatTokensUsed
        : null;
  const chatLimit =
    typeof planData?.chatLimitTokens === "number"
      ? planData.chatLimitTokens
      : typeof planData?.effectiveChatLimit === "number"
        ? planData.effectiveChatLimit
        : null;
  const chatRemaining =
    typeof planData?.chatRemainingTokens === "number"
      ? planData.chatRemainingTokens
      : typeof planData?.chatRemaining === "number"
        ? planData.chatRemaining
        : null;
  const videosUsed =
    typeof planData?.sadtalkerVideosUsed === "number"
      ? planData.sadtalkerVideosUsed
      : typeof planData?.videosUsed === "number"
        ? planData.videosUsed
        : null;
  const videosLimit =
    typeof planData?.sadtalkerVideosLimit === "number"
      ? planData.sadtalkerVideosLimit
      : typeof planData?.effectiveVideoLimit === "number"
        ? planData.effectiveVideoLimit
        : null;
  const videosRemaining =
    typeof planData?.sadtalkerVideosRemaining === "number"
      ? planData.sadtalkerVideosRemaining
      : typeof planData?.videosRemaining === "number"
        ? planData.videosRemaining
        : null;

  const modal = (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Close settings"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className="absolute left-1/2 top-1/2 z-[130] overflow-hidden rounded-2xl border border-[var(--hg-border)] bg-[var(--hg-surface)] shadow-2xl"
        style={{
          width: "min(1100px, calc(100vw - 32px))",
          height: "min(720px, calc(100vh - 32px))",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex items-center justify-between border-b border-[var(--hg-border-2)] px-4 py-3 md:px-6">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-[var(--hg-muted)] hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid h-[calc(100%-58px)] grid-cols-1 overflow-hidden md:grid-cols-[240px_1fr]">
          <aside className="border-b border-[var(--hg-border-2)] p-3 md:border-b-0 md:border-r">
            <nav className="space-y-1">
              {sections.map((item) => {
                const Icon = item.icon;
                const active = section === item.key;
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
          </aside>

          <section className="h-full overflow-y-auto p-4 md:p-6">
            {section === "account" ? (
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
                    <p className="mt-0.5 text-xs text-white/45">Manage your profile details</p>
                  </div>
                </div>
                <div className="h-px w-full bg-white/10" />
                <div className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="settings-first-name" className="text-xs tracking-wide text-white/60">
                        First name
                      </label>
                      <input
                        id="settings-first-name"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="First name"
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-sky-400/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="settings-last-name" className="text-xs tracking-wide text-white/60">
                        Last name
                      </label>
                      <input
                        id="settings-last-name"
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="Last name"
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-sky-400/30"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-white/45">This appears in your account and receipts.</p>
                  <div className="space-y-1.5">
                    <label htmlFor="settings-email" className="text-xs tracking-wide text-white/60">
                      Email
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
                        toast.success("Saved");
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
                            ? "Profile update is not available in this environment yet."
                            : "Failed to save profile.";
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
                    {saving ? "Saving..." : "Save changes"}
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
                    Cancel
                  </button>
                </div>
                {savedAt ? (
                  <p className="text-xs text-emerald-300">Saved</p>
                ) : null}
                {saveError ? (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                    <p>{saveError.message}</p>
                    {saveSupportId ? (
                      <div className="mt-1 flex items-center gap-2">
                        <span>Support ID: {saveSupportId}</span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(saveSupportId)}
                          className="rounded border border-rose-200/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wide hover:border-rose-100"
                        >
                          Copy
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {section === "usage" ? (
              <div className="space-y-3">
                <UsageBar
                  label="Uploads"
                  used={uploadsUsed}
                  limit={uploadsLimit}
                  remaining={uploadsRemaining}
                />
                <UsageBar
                  label="AI Chat Tokens"
                  used={chatUsed}
                  limit={chatLimit}
                  remaining={chatRemaining}
                />
                <UsageBar
                  label="Talking Head Videos"
                  used={videosUsed}
                  limit={videosLimit}
                  remaining={videosRemaining}
                />
              </div>
            ) : null}

            {section === "billing" ? (
              <BillingPanel embedded />
            ) : null}

            {section === "history" ? (
              <HistoryPanel embedded />
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
