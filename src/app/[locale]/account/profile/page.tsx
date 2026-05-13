"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/hooks/useUser";
import { updateUserProfile } from "@/app/utils/api";
import { toast } from "sonner";

export default function AccountProfilePage() {
  const { user, loading: userLoading } = useUser({ required: false });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const f = user.firstName ?? "";
    const l = user.lastName ?? "";
    setFirstName(f);
    setLastName(l);
    setInitialFirstName(f);
    setInitialLastName(l);
  }, [user]);

  const hasChanges =
    firstName.trim() !== initialFirstName.trim() ||
    lastName.trim() !== initialLastName.trim();

  const handleSave = async () => {
    if (!hasChanges || saving) return;
    setSaveError(null);
    try {
      setSaving(true);
      const result = await updateUserProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      const f = result.user.firstName ?? firstName.trim();
      const l = result.user.lastName ?? lastName.trim();
      setFirstName(f);
      setLastName(l);
      setInitialFirstName(f);
      setInitialLastName(l);
      toast.success("Profile saved");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-sm text-slate-400">Manage your account details.</p>
      </div>

      {/* Profile info */}
      <section className="rounded-2xl border border-[var(--hg-border)] bg-white/5 p-5 space-y-5">
        <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500">Info</h2>

        {userLoading ? (
          <div className="space-y-3">
            <div className="h-10 animate-pulse rounded-xl bg-white/10" />
            <div className="h-10 animate-pulse rounded-xl bg-white/10" />
            <div className="h-10 animate-pulse rounded-xl bg-white/10" />
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="profile-first-name" className="text-xs text-slate-400">
                  First name
                </label>
                <input
                  id="profile-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 focus:ring-1 focus:ring-sky-400/30 transition"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="profile-last-name" className="text-xs text-slate-400">
                  Last name
                </label>
                <input
                  id="profile-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20 focus:ring-1 focus:ring-sky-400/30 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-email" className="text-xs text-slate-400">
                Email
              </label>
              <input
                id="profile-email"
                type="text"
                value={user?.email ?? ""}
                disabled
                readOnly
                className="h-10 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-3 text-sm text-white/50 outline-none"
              />
            </div>

            {saveError ? (
              <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                {saveError}
              </p>
            ) : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={!hasChanges || saving}
                className="h-9 rounded-xl bg-[#50C0F0] px-4 text-sm font-semibold text-[#07131d] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFirstName(initialFirstName);
                  setLastName(initialLastName);
                  setSaveError(null);
                }}
                disabled={!hasChanges || saving}
                className="h-9 rounded-xl border border-[var(--hg-border)] bg-white/5 px-4 text-sm text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </section>

      {/* Change password */}
      <section className="rounded-2xl border border-[var(--hg-border)] bg-white/5 p-5 space-y-5">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500">Security</h2>
          <p className="mt-2 text-sm text-slate-400">
            Change your password below.
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="current-password" className="text-xs text-slate-400">
              Current password
            </label>
            <input
              id="current-password"
              type="password"
              placeholder="••••••••"
              disabled
              className="h-10 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-3 text-sm text-white/50 placeholder:text-white/20 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="new-password" className="text-xs text-slate-400">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="••••••••"
              disabled
              className="h-10 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-3 text-sm text-white/50 placeholder:text-white/20 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="text-xs text-slate-400">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              disabled
              className="h-10 w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-3 text-sm text-white/50 placeholder:text-white/20 outline-none"
            />
          </div>
        </div>

        {/* TODO: wire up password change once backend endpoint exists (POST /api/user/change-password) */}
        <button
          type="button"
          disabled
          className="h-9 cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-slate-500 opacity-50"
          title="Password change coming soon"
        >
          Update password
        </button>
        <p className="text-xs text-slate-500">Password change will be available soon.</p>
      </section>
    </div>
  );
}
