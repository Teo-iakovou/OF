"use client";

import AuthForm from "@/app/components/auth/AuthForm";
import Link from "next/link";

export default function SignupPageContent({ redirectTo }: { redirectTo: string }) {
  return (
    <div className="min-h-screen bg-[#050819] flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1624] p-6 shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-400">Create account</p>
          <h1 className="text-3xl font-bold">Join the studio</h1>
          <p className="text-sm text-gray-400">Enter your email to unlock AI-powered workflows.</p>
        </div>
        <AuthForm
          redirectTo={redirectTo}
          submitLabel="Create account"
          footnote="We'll send you straight in — no passwords required."
        />
        <div className="text-center text-sm text-gray-400 space-y-2">
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2">
            Already have an account? Sign in →
          </Link>
          <div>
            <Link href="/" className="text-gray-500 hover:text-gray-300 underline underline-offset-2">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
