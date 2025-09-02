// src/app/components/AIchat/FloatingChatWidget.tsx
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useFloatingChat } from "@/app/components/AIchat/FloatingChatContext";
import { createEmptyConversation } from "@/app/utils/api";

// Lazy-load chat pieces
const CoachChat = dynamic(() => import("@/app/components/AIchat/CoachChat"), { ssr: false });
const CoachChatHistory = dynamic(
  () => import("@/app/components/AIchat/AiChatHistorySidebar"),
  { ssr: false }
);

function useIsClient() {
  const [c, setC] = useState(false);
  useEffect(() => setC(true), []);
  return c;
}

export default function FloatingChatWidget() {
  const isClient = useIsClient();
  const {
    isOpen,
    open,
    close,
    anchor,
    setAnchor,
    email: emailFromCtx,
  } = useFloatingChat();

  // Chat session state
  const [selectedConvoId, setSelectedConvoId] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  // Header dropdown state
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyRef = useRef<HTMLDivElement | null>(null);

  // Refs for dragging
  const fabRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  
  const anchorRef = useRef(anchor);
  useEffect(() => {
    anchorRef.current = anchor;
  }, [anchor]);

  // ── layout constants ────────────────────────────────────────────────────────
  const MARGIN = 12;
  const BUBBLE = 48;  // h-12 w-12
  const PANEL_W = 420;
  const PANEL_H = 560;

  // Place bottom-right on first mount if still default (24,24)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (anchor.x === 24 && anchor.y === 24) {
      const next = clamp(
        window.innerWidth - BUBBLE - 24,
        window.innerHeight - BUBBLE - 24,
        BUBBLE,
        BUBBLE
      );
      setAnchor(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep inside viewport
  const clamp = useCallback((x: number, y: number, w: number, h: number) => {
    const maxX = Math.max(MARGIN, window.innerWidth - w - MARGIN);
    const maxY = Math.max(MARGIN, window.innerHeight - h - MARGIN);
    return {
      x: Math.min(Math.max(x, MARGIN), maxX),
      y: Math.min(Math.max(y, MARGIN), maxY),
    };
  }, []);

  // Panel opens centered now; no need to compute relative position

  // Drag via React pointerdown + global move/up + rAF
  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startAnchor: { x: 0, y: 0 },
    raf: 0 as number | 0,
    pending: { x: 0, y: 0 },
  });

  const onFabPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const el = e.currentTarget;
      dragState.current.dragging = true;
      dragState.current.startX = e.clientX;
      dragState.current.startY = e.clientY;
      dragState.current.startAnchor = { ...anchorRef.current };
      dragState.current.pending = anchorRef.current;

      try {
        el.setPointerCapture?.(e.pointerId);
      } catch {}
      e.preventDefault();
      document.body.style.userSelect = "none";
      el.style.touchAction = "none";

      const onMove = (ev: PointerEvent) => {
        if (!dragState.current.dragging) return;
        const dx = ev.clientX - dragState.current.startX;
        const dy = ev.clientY - dragState.current.startY;
        const next = clamp(
          dragState.current.startAnchor.x + dx,
          dragState.current.startAnchor.y + dy,
          BUBBLE,
          BUBBLE
        );
        dragState.current.pending = next;
        if (!dragState.current.raf) {
          dragState.current.raf = requestAnimationFrame(() => {
            dragState.current.raf = 0 as number | 0;
            const p = dragState.current.pending;
            if (p.x !== anchorRef.current.x || p.y !== anchorRef.current.y) {
              setAnchor(p);
            }
          });
        }
      };

      const onUp = (ev: PointerEvent) => {
        if (!dragState.current.dragging) return;
        dragState.current.dragging = false;
        try {
          el.releasePointerCapture?.(ev.pointerId);
        } catch {}
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        if (dragState.current.raf) cancelAnimationFrame(dragState.current.raf);
        dragState.current.raf = 0 as number | 0;
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
    },
    [clamp, setAnchor]
  );

  // Resize safety: keep FAB in bounds
  useEffect(() => {
    const onResize = () => {
      const a = anchorRef.current;
      const c = clamp(a.x, a.y, BUBBLE, BUBBLE);
      if (c.x !== a.x || c.y !== a.y) setAnchor(c);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clamp, setAnchor]);

  // Close panel on outside click / Esc
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!panelRef.current || !fabRef.current) return;
      const t = e.target as Node;
      if (panelRef.current.contains(t) || fabRef.current.contains(t)) return;
      close();
      setHistoryOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        setHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [isOpen, close]);

  // Close the history dropdown if clicking outside it
  useEffect(() => {
    if (!historyOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!historyRef.current) return;
      if (historyRef.current.contains(e.target as Node)) return;
      setHistoryOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [historyOpen]);

  if (!isClient) return null;

  const email =
    emailFromCtx ??
    (typeof window !== "undefined" ? localStorage.getItem("userEmail") || "" : "");

  // centered panel, no computed position needed

  // “+ New” from dropdown
  async function handleNewChat() {
  if (!email) return;
  const newId = await createEmptyConversation(email);
  if (newId) {
    setSelectedConvoId(newId);
  }
  setRefreshKey((k) => k + 1);
}

  return createPortal(
    <>
      {/* Floating, draggable button */}
     <button
  ref={fabRef}
  aria-label="AI Coach"
  onPointerDown={onFabPointerDown}
  onClick={() => {
    // ignore click if we were dragging
    if (dragState.current.dragging) return;

    if (isOpen) {
      close();
      setHistoryOpen(false);
    } else {
      open();
    }
  }}
  style={{
    position: "fixed",
    left: 0,
    top: 0,
    transform: `translate3d(${anchor.x}px, ${anchor.y}px, 0)`,
    zIndex: 2147483647,
    touchAction: "none",
    willChange: "transform",
  }}
  className="h-12 w-12 rounded-full shadow-lg border border-gray-700 bg-gray-900 text-white flex items-center justify-center cursor-grab active:cursor-grabbing active:scale-95"
>
  <MessageCircle className="h-6 w-6" />
</button>

      {/* Overlay + centered chat panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay to blur and dim background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                // clicking backdrop closes panel
                close();
                setHistoryOpen(false);
              }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 2147483645,
              }}
              className="bg-black/30 backdrop-blur-sm"
            />

            {/* Center container to perfectly center the panel with padding */}
            <div
              className="fixed inset-0 flex items-center justify-center p-4 md:p-6"
              style={{ zIndex: 2147483646, pointerEvents: "none" }}
            >
              <motion.div
                ref={panelRef}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                style={{
                  width: PANEL_W,
                  maxWidth: "95vw",
                  height: PANEL_H,
                  maxHeight: "80vh",
                  willChange: "transform",
                  pointerEvents: "auto",
                }}
                className="rounded-2xl shadow-2xl border border-[#232B36] bg-[#0f1520] overflow-hidden flex flex-col"
              >
              {/* Header with History dropdown */}
              <div className="relative px-4 py-2 border-b border-[#232B36] bg-[#121A24] text-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium">AI Coach</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHistoryOpen((v) => !v)}
                    className="px-2 py-1 text-xs rounded text-white bg-gray-700 hover:bg-gray-600 transition"
                  >
                    History
                  </button>
                  <button
                    onClick={() => {
                      close();
                      setHistoryOpen(false);
                    }}
                    className="p-1 rounded-md hover:bg-[#1f2732]"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Dropdown popover */}
                {historyOpen && (
                  <div
                    ref={historyRef}
                    className="absolute right-2 top-full mt-2 z-[100] w-[320px]"
                  >
                    <CoachChatHistory
                      userEmail={email}
                      onSelect={(id) => {
                        setSelectedConvoId(id);
                        setHistoryOpen(false);
                      }}
                      selectedId={selectedConvoId}
                      refreshKey={refreshKey}
                      showHeader
                      onNew={handleNewChat}
                      maxHeight={420}
                    />
                  </div>
                )}
              </div>

                {/* Chat body */}
                <div className="flex-1 min-h-0">
                  <CoachChat
                    email={email}
                    initialConversationId={selectedConvoId}
                    onNewConversation={(newId: string) => {
                      setSelectedConvoId(newId);
                      setRefreshKey((k) => k + 1);
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
