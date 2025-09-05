"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = {
  categories: ConsentCategories;
  timestamp: number;
  locale?: string | null;
  version: string; // policy version
  gpc?: boolean;
  userId?: string | null;
};

const CONSENT_KEY = "consent.v1"; // bump when policy changes
const POLICY_VERSION = "1.0";

type Ctx = {
  consent: ConsentRecord | null;
  open: () => void;
  close: () => void;
  save: (cats: Omit<ConsentCategories, "necessary">) => Promise<void>;
  isOpen: boolean;
};

const ConsentCtx = createContext<Ctx | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [consent, setConsent] = useState<ConsentRecord | null>(null);

  // On mount: read stored consent; honor GPC if present and no stored consent
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConsentRecord;
        setConsent(parsed);
        return;
      }
    } catch {}

    // default: EU-safe — only necessary allowed until explicit choice
    const gpc = typeof navigator !== "undefined" && (navigator as any).globalPrivacyControl === true;
    const base: ConsentRecord = {
      categories: { necessary: true, analytics: false, marketing: false },
      timestamp: Date.now(),
      locale: typeof navigator !== "undefined" ? navigator.language : undefined,
      version: POLICY_VERSION,
      gpc,
    };
    setConsent(base);
    setIsOpen(true); // show banner
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const save = useCallback(async (cats: Omit<ConsentCategories, "necessary">) => {
    const gpc = typeof navigator !== "undefined" && (navigator as any).globalPrivacyControl === true;
    const rec: ConsentRecord = {
      categories: { necessary: true, ...cats },
      timestamp: Date.now(),
      locale: typeof navigator !== "undefined" ? navigator.language : undefined,
      version: POLICY_VERSION,
      gpc,
    };
    setConsent(rec);
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(rec)); } catch {}

    // fire-and-forget log
    try {
      fetch("/api/consent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rec) });
    } catch {}

    setIsOpen(false);
  }, []);

  const value = useMemo(() => ({ consent, open, close, save, isOpen }), [consent, open, close, save, isOpen]);
  return <ConsentCtx.Provider value={value}>{children}</ConsentCtx.Provider>;
}

export function useConsent() {
  const v = useContext(ConsentCtx);
  if (!v) throw new Error("useConsent must be used within ConsentProvider");
  return v;
}

