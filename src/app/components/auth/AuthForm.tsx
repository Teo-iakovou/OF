"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { fetchJson } from "@/app/utils/fetcher";
import { clearUserCache, notifyAuthChange } from "@/app/hooks/useUser";
import { checkUserPackage } from "@/app/utils/api";
import { decidePostAuthRedirect } from "@/app/utils/postAuthRedirect";

const loginEndpoint = "/api/auth/login";
const registerEndpoint = "/api/auth/register";
const meEndpoint = "/api/auth/me";

async function parseErrorResponse(
  res: Response,
  t: (key: string) => string,
): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.error === "string" && data.error.length > 0) {
      return data.error;
    }
  } catch {
    // Response wasn't JSON — fall through to status-based fallback
  }
  if (res.status === 429) return t("errors.tooManyAttempts");
  if (res.status === 401) return t("errors.invalidCredentials");
  if (res.status === 403) return t("errors.accessDenied");
  if (res.status === 500) return t("errors.serverError");
  return "";
}

type AuthFormProps = {
  mode?: "login" | "signup";
  redirectTo?: string;
  intent?: string;
  onSuccess?: () => void;
  footnote?: string;
  submitLabel?: string;
  showForgotPassword?: boolean;
};

export default function AuthForm({
  mode = "login",
  redirectTo,
  intent,
  onSuccess,
  footnote,
  submitLabel,
  showForgotPassword = false,
}: AuthFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === "signup" && !name) return;
    if (mode === "signup" && password !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }
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
        const msg = await parseErrorResponse(res, t);
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
      notifyAuthChange();

      onSuccess?.();

      // Compute destination BEFORE triggering any server re-render, so no SSR redirect
      // can race with the client navigation.
      const packageState = await checkUserPackage({ force: true }).catch(() => null);
      const hasActiveAccess = Boolean(packageState?.hasAccess && packageState?.packageInstanceId);
      const destination = decidePostAuthRedirect({
        next: redirectTo ?? null,
        intent: intent ?? null,
        hasActivePackage: hasActiveAccess,
      });

      // Navigate first, then refresh (refresh applies to destination, not login page)
      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || t(mode === "signup" ? "errors.signUpFailed" : "errors.signInFailed"));
    } finally {
      setLoading(false);
    }
  }

  const isValid =
    email &&
    password &&
    (mode === "login" || (Boolean(name) && confirmPassword === password));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label htmlFor="auth-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[var(--hg-muted)]">
            {t("nameLabel")}
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--hg-muted)]" />
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] py-2.5 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--hg-accent)]/60"
              placeholder={t("namePlaceholder")}
              required
            />
          </div>
        </div>
      )}
      <div>
        <label htmlFor="auth-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[var(--hg-muted)]">
          {t("emailLabel")}
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--hg-muted)]" />
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] py-2.5 pl-10 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--hg-accent)]/60"
            placeholder={t("emailPlaceholder")}
            required
          />
        </div>
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="auth-password" className="block text-xs font-semibold uppercase tracking-widest text-[var(--hg-muted)]">
            {t("passwordLabel")}
          </label>
          {showForgotPassword && (
            <a href="/forgot-password" className="text-xs text-[#9fd9f3] hover:underline">
              {t("forgotPassword")}
            </a>
          )}
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--hg-muted)]" />
          <input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] py-2.5 pl-10 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--hg-accent)]/60"
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
      {mode === "signup" && (
        <div>
          <label htmlFor="auth-confirm-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[var(--hg-muted)]">
            {t("confirmPasswordLabel")}
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--hg-muted)]" />
            <input
              id="auth-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--hg-border)] bg-[var(--hg-surface)] py-2.5 pl-10 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--hg-accent)]/60"
              placeholder={t("confirmPasswordPlaceholder")}
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--hg-muted)] transition hover:text-[var(--hg-text)]"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
      <button
        type="submit"
        disabled={!isValid || loading}
        className="h-12 w-full rounded-xl bg-[var(--hg-accent)] font-semibold text-[#07131d] shadow-lg transition disabled:opacity-60"
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
