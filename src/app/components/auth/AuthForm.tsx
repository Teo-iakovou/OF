"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJson } from "@/app/utils/fetcher";
import { clearUserCache, notifyAuthChange } from "@/app/hooks/useUser";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const USE_BFF = process.env.NEXT_PUBLIC_USE_BFF === "true";

const loginEndpoint = USE_BFF ? "/api/auth/login" : `${API_BASE}/api/auth/login`;
const meEndpoint = USE_BFF ? "/api/auth/me" : `${API_BASE}/api/auth/me`;

type AuthFormProps = {
  redirectTo?: string;
  onSuccess?: () => void;
  footnote?: string;
  submitLabel?: string;
};

export default function AuthForm({
  redirectTo,
  onSuccess,
  footnote = "New here? Enter your email and we'll create your account automatically.",
  submitLabel = "Continue",
}: AuthFormProps) {
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
        throw new Error(msg || "Sign in failed");
      }

      const verify = await fetchJson(meEndpoint, { method: "GET", cache: "no-store" });
      if (!verify.ok) {
        throw new Error("Could not verify your session. Please enable cookies and try again.");
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
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="auth-email" className="text-sm text-gray-300 mb-1 block">
          Email address
        </label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="you@example.com"
          required
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={!email || loading}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 font-semibold text-white shadow-lg transition disabled:opacity-60"
      >
        {loading ? "Signing you in…" : submitLabel}
      </button>
      {footnote ? <p className="text-xs text-gray-400 text-center">{footnote}</p> : null}
    </form>
  );
}
