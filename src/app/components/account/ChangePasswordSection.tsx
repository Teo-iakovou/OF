"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function ChangePasswordSection() {
  const t = useTranslations("dashboard.settings.password");
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/user/password-status", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setHasPassword(!!d.hasPassword))
      .catch(() => setHasPassword(false));
  }, []);

  if (hasPassword === null) return null;

  const isSetMode = !hasPassword;
  const passwordsMatch = newPassword === confirmPassword;
  const canSubmit =
    !busy &&
    newPassword.length >= 8 &&
    passwordsMatch &&
    (isSetMode || oldPassword.length > 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: isSetMode ? undefined : oldPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const code = (data?.error as string) || "GENERIC";
        const knownCodes = [
          "PASSWORD_TOO_SHORT",
          "OLD_PASSWORD_REQUIRED",
          "OLD_PASSWORD_INCORRECT",
          "PASSWORD_UNCHANGED",
        ];
        setErr(knownCodes.includes(code) ? t(`errors.${code}` as Parameters<typeof t>[0]) : t("errors.GENERIC"));
        setBusy(false);
        return;
      }
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setHasPassword(true);
    } catch {
      setErr(t("errors.GENERIC"));
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition placeholder:text-white/30 focus:border-white/20 focus:ring-1 focus:ring-sky-400/30";

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <h3 className="text-sm font-semibold text-white">
        {isSetMode ? t("setTitle") : t("changeTitle")}
      </h3>
      <p className="mt-1 text-xs text-white/45">
        {isSetMode ? t("setDescription") : t("changeDescription")}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {!isSetMode && (
          <input
            type="password"
            placeholder={t("oldPasswordPlaceholder")}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        )}
        <input
          type="password"
          placeholder={t("newPasswordPlaceholder")}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={inputClass}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass}
          autoComplete="new-password"
        />
        {newPassword && newPassword.length < 8 && (
          <p className="text-xs text-white/45">{t("hintMinLength")}</p>
        )}
        {confirmPassword && !passwordsMatch && (
          <p className="text-xs text-red-400">{t("hintMismatch")}</p>
        )}
        {err && <p className="text-sm text-red-400">{err}</p>}
        {success && <p className="text-sm text-emerald-400">{t("success")}</p>}
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-10 rounded-xl bg-[#50C0F0] px-4 text-sm font-semibold text-[#07131d] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? t("submitting") : isSetMode ? t("setButton") : t("changeButton")}
        </button>
      </form>
    </section>
  );
}
