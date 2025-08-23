"use client";

import React, {
  createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode,
} from "react";

type ChatOpenOpts = { resultId?: string; initialMessage?: string };

type FloatingChatCtx = {
  isOpen: boolean;
  open: (opts?: ChatOpenOpts) => void;
  close: () => void;
  toggle: () => void;
  anchor: { x: number; y: number };
  setAnchor: (pos: { x: number; y: number }) => void;
  contextRef: { resultId?: string; initialMessage?: string } | null;
  setContextRef: (c: { resultId?: string; initialMessage?: string } | null) => void;
  email?: string | null;
};

const Ctx = createContext<FloatingChatCtx | null>(null);
const POS_KEY = "floatingChat.pos";
const OPEN_KEY = "floatingChat.open";

export function FloatingChatProvider({ children, email }: { children: ReactNode; email?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchorState] = useState<{ x: number; y: number }>({ x: 24, y: 24 });
  const [contextRef, setContextRef] = useState<{ resultId?: string; initialMessage?: string } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p?.x === "number" && typeof p?.y === "number") setAnchorState(p);
      }
      const o = localStorage.getItem(OPEN_KEY);
      if (o === "1") setIsOpen(true);
    } catch {}
  }, []);

  const setAnchor = useCallback((pos: { x: number; y: number }) => {
    setAnchorState(pos);
    try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch {}
  }, []);

  const open = useCallback((opts?: ChatOpenOpts) => {
    if (opts) setContextRef(opts);
    setIsOpen(true);
    try { localStorage.setItem(OPEN_KEY, "1"); } catch {}
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    try { localStorage.setItem(OPEN_KEY, "0"); } catch {}
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((p) => {
      const next = !p;
      try { localStorage.setItem(OPEN_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle, anchor, setAnchor, contextRef, setContextRef, email }),
    [isOpen, open, close, toggle, anchor, setAnchor, contextRef, email]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFloatingChat() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFloatingChat must be used within FloatingChatProvider");
  return v;
}