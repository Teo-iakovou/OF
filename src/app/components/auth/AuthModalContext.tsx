"use client";

import { createContext, useCallback, useContext, useState } from "react";
import AuthModal from "./AuthModal";

type AuthModalOptions = {
  redirectTo?: string;
  onSuccess?: () => void;
};

type AuthModalContextValue = {
  open: (options?: AuthModalOptions) => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AuthModalOptions | undefined>();

  const handleOpen = useCallback((opts?: AuthModalOptions) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider value={{ open: handleOpen }}>
      {children}
      <AuthModal open={open} onClose={handleClose} redirectTo={options?.redirectTo} onSuccess={options?.onSuccess} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return ctx;
}
