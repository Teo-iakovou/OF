"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/utils/fetcher";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/hooks/useUser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: userLoading } = useUser({ required: false });
  const [alreadySignedIn, setAlreadySignedIn] = useState(false);
  const search = useSearchParams();
  const redirectDest = search?.get("redirect") || "/dashboard";

  // If a signed-in user opens the login page, notify and redirect to destination
  useEffect(() => {
    if (!userLoading && user) {
      setAlreadySignedIn(true);
      const t = setTimeout(() => router.replace(redirectDest), 1000);
      return () => clearTimeout(t);
    }
  }, [user, userLoading, router, redirectDest]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Login failed");
      }
      try { sessionStorage.setItem("justLoggedIn", "1"); } catch {}
      router.replace(redirectDest);
    } catch (e: any) {
      setError(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow"
      >
        <h1 className="text-2xl font-bold mb-2">Sign in</h1>
        {alreadySignedIn && (
          <div className="mb-3 text-sm text-cyan-300 bg-cyan-900/30 border border-cyan-700 rounded p-2">
            You are already signed in. Redirecting {redirectDest === "/" ? "home" : "to your dashboard"}…
          </div>
        )}
        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-600 mb-3"
          placeholder="you@example.com"
          required
          />
        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}
        <button
          type="submit"
          disabled={loading || !email || alreadySignedIn}
          className="w-full py-2 rounded bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
