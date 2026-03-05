"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { fetchJson } from "@/app/utils/fetcher";
import { clearUserCache, notifyAuthChange } from "@/app/hooks/useUser";
import { inferPackageIdFromPath } from "@/app/utils/authRedirect";
import { checkUserPackage } from "@/app/utils/api";

const loginEndpoint = "/api/auth/login";
const meEndpoint = "/api/auth/me";

type AuthFormProps = {
  redirectTo?: string;
  intent?: string;
  onSuccess?: () => void;
  footnote?: string;
  submitLabel?: string;
};

export default function AuthForm({
  redirectTo,
  intent,
  onSuccess,
  footnote,
  submitLabel,
}: AuthFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(loginEndpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || t("errors.signInFailed"));
      }

      const verify = await fetchJson(meEndpoint, { method: "GET", cache: "no-store" });
      if (!verify.ok) {
        throw new Error(t("errors.verifyFailed"));
      }

      try {
        sessionStorage.setItem("justLoggedIn", "1");
      } catch {}
      try {
        clearUserCache();
      } catch {}
      router.refresh();
      notifyAuthChange();

      onSuccess?.();
      const target = redirectTo || "/";
      const packageState = await checkUserPackage({ force: true }).catch(() => null);
      const hasActiveAccess = Boolean(packageState?.hasAccess && packageState?.packageInstanceId);
      if (hasActiveAccess) {
        router.replace("/dashboard");
        return;
      }
      if (intent === "checkout") {
        const packageId = inferPackageIdFromPath(target);
        if (packageId) {
          router.push(`/checkout?packageId=${encodeURIComponent(packageId)}`);
          return;
        }
      }
      router.push(target);
    } catch (err: any) {
      setError(err?.message || t("errors.signInFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="auth-email" className="mb-1 block text-sm text-[var(--hg-muted)]">
          {t("emailLabel")}
        </label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--hg-accent)]/60"
          placeholder={t("emailPlaceholder")}
          required
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={!email || loading}
        className="w-full rounded-xl bg-[var(--hg-accent)] py-2.5 font-semibold text-[#07131d] shadow-lg transition disabled:opacity-60"
      >
        {loading ? t("signingIn") : submitLabel || t("continueWithEmail")}
      </button>
      {(footnote || t("emailFootnote")) ? (
        <p className="text-center text-xs text-[var(--hg-muted)]">{footnote || t("emailFootnote")}</p>
      ) : null}
    </form>
  );
}
