"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { FitBadge } from "./FitBadge";
import { BrandIcon } from "./BrandIcons";

type FitScore = { score: number; tier: "great" | "good" | "limited" };

type Props = {
  platforms: string[];
  fitScores: Record<string, FitScore | null | undefined>;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function PlatformTabBar({ platforms, fitScores, activeIndex, onSelect }: Props) {
  const t = useTranslations("dashboard.recommendations");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onSelect(Math.min(activeIndex + 1, platforms.length - 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onSelect(Math.max(activeIndex - 1, 0));
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLElement>('[data-active="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div className="sticky top-0 z-10 bg-[var(--hg-surface-2)]/95 px-4 pb-4 pt-4 backdrop-blur-sm">
      <nav
        aria-label={t("tabsAriaLabel")}
        className="relative rounded-[12px] border border-[var(--hg-border)] bg-[var(--hg-surface-2)] p-1.5"
      >
        <div
          ref={containerRef}
          role="tablist"
          onKeyDown={handleKeyDown}
          className="flex gap-1.5 overflow-x-auto scrollbar-none"
        >
          {platforms.map((name, idx) => {
            const isActive = idx === activeIndex;
            const fit = fitScores[name] ?? null;
            return (
              <button
                key={name}
                role="tab"
                aria-selected={isActive}
                data-active={isActive ? "true" : undefined}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onSelect(idx)}
                className={`
                  relative flex shrink-0 items-center whitespace-nowrap rounded-[10px] px-3.5 py-2 text-[13px]
                  transition-[color,opacity] duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hg-accent)]
                  ${isActive ? "font-medium text-white" : "text-[var(--hg-muted)] hover:text-white"}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-[10px] border border-[var(--hg-border)] bg-[var(--hg-surface)] shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <BrandIcon
                    platform={name}
                    size={14}
                    className={isActive ? "opacity-100" : "opacity-50"}
                  />
                  {name}
                  {fit ? (
                    <FitBadge
                      score={fit.score}
                      tier={fit.tier}
                      active={isActive}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
        {/* Right-edge fade affordance for overflowing tabs */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-8 rounded-r-[11px] bg-gradient-to-l from-[var(--hg-surface-2)] to-transparent" />
      </nav>
    </div>
  );
}
