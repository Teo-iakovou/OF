"use client";

import AuthForm from "@/app/components/auth/AuthForm";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
  onSuccess?: () => void;
};

export default function AuthModal({ open, onClose, redirectTo, onSuccess }: AuthModalProps) {
  if (!open) return null;

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
        <AuthForm
          redirectTo={redirectTo}
          onSuccess={() => {
            onClose();
            if (onSuccess) onSuccess();
          }}
        />
      </div>
    </div>
  );
}
