"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { fetchJson } from "@/app/utils/fetcher";
import { clearUserCache, notifyAuthChange } from "@/app/hooks/useUser";
import { inferPackageIdFromPath } from "@/app/utils/authRedirect";
import { checkUserPackage } from "@/app/utils/api";

const loginEndpoint = "/api/auth/login";
const registerEndpoint = "/api/auth/register";
const meEndpoint = "/api/auth/me";

type AuthFormProps = {
  mode?: "login" | "signup";
  redirectTo?: string;
  intent?: string;
  onSuccess?: () => void;
  footnote?: string;
  submitLabel?: string;
};

export default function AuthForm({
  mode = "login",
  redirectTo,
  intent,
  onSuccess,
  footnote,
  submitLabel,
}: AuthFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === "signup" && !name) return;
    setError(null);
    setLoading(true);
    try {
      const endpoint = mode === "signup" ? registerEndpoint : loginEndpoint;
      const body = mode === "signup"
        ? { email, password, name }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || t(mode === "signup" ? "errors.signUpFailed" : "errors.signInFailed"));
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
      const target = redirectTo || "/dashboard";
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
      setError(err?.message || t(mode === "signup" ? "errors.signUpFailed" : "errors.signInFailed"));
    } finally {
      setLoading(false);
    }
  }

  const isValid = email && password && (mode === "login" || Boolean(name));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label htmlFor="auth-name" className="mb-1 block text-sm text-[var(--hg-muted)]">
            {t("nameLabel")}
          </label>
          <input
            id="auth-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--hg-accent)]/60"
            placeholder={t("namePlaceholder")}
            required
          />
        </div>
      )}
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
      <div>
        <label htmlFor="auth-password" className="mb-1 block text-sm text-[var(--hg-muted)]">
          {t("passwordLabel")}
        </label>
        <div className="relative">
          <input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--hg-accent)]/60"
            placeholder={t("passwordPlaceholder")}
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--hg-muted)] transition hover:text-[var(--hg-text)]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full rounded-xl bg-[var(--hg-accent)] py-2.5 font-semibold text-[#07131d] shadow-lg transition disabled:opacity-60"
      >
        {loading
          ? t(mode === "signup" ? "creatingAccount" : "signingIn")
          : submitLabel || t(mode === "signup" ? "createAccount" : "continueWithEmail")}
      </button>
      {(footnote || t("emailFootnote")) ? (
        <p className="text-center text-xs text-[var(--hg-muted)]">{footnote || t("emailFootnote")}</p>
      ) : null}
    </form>
  );
}
