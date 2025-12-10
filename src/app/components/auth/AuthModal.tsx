"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJson } from "@/app/utils/fetcher";
import { clearUserCache, notifyAuthChange } from "@/app/hooks/useUser";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
  onSuccess?: () => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const USE_BFF = process.env.NEXT_PUBLIC_USE_BFF === "true";

const loginEndpoint = USE_BFF ? "/api/auth/login" : `${API_BASE}/api/auth/login`;
const meEndpoint = USE_BFF ? "/api/auth/me" : `${API_BASE}/api/auth/me`;

export default function AuthModal({ open, onClose, redirectTo, onSuccess }: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

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
      onClose();
      if (onSuccess) {
        onSuccess();
      } else if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl bg-[#0f1624] p-6 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-white"
          onClick={onClose}
          aria-label="Close sign in modal"
        >
          ×
        </button>
        <div className="space-y-2 mb-6">
          <p className="text-sm uppercase tracking-widest text-cyan-400">Welcome back</p>
          <h2 className="text-2xl font-bold text-white">Sign in to continue</h2>
          <p className="text-sm text-gray-400">Enter your email to access premium tools.</p>
        </div>
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
            {loading ? "Signing you in…" : "Continue"}
          </button>
          <p className="text-xs text-gray-400 text-center">
            New here? Enter your email and we&apos;ll create your account automatically.
          </p>
        </form>
      </div>
    </div>
  );
}
