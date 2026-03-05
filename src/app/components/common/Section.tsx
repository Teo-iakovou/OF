"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
type SectionProps = {
  id?: string;
  children: ReactNode;
  variant?: "gradient" | "dark" | "darker";
  className?: string;
  contentClassName?: string;
  decorations?: ReactNode;
};

const variantStyles: Record<
  NonNullable<SectionProps["variant"]>,
  { background: string; edgeColor: string }
> = {
  gradient: {
    background: "bg-gradient-to-br from-[var(--hg-surface)] via-[#0d1621] to-[var(--hg-bg)]",
    edgeColor: "var(--hg-border)",
  },
  dark: {
    background: "bg-gradient-to-b from-[var(--hg-bg)] via-[#0a0f16] to-[var(--hg-surface)]",
    edgeColor: "var(--hg-border)",
  },
  darker: {
    background: "bg-[var(--hg-bg)]",
    edgeColor: "var(--hg-border)",
  },
};

export default function Section({
  id,
  children,
  variant = "dark",
  className = "",
  contentClassName = "",
  decorations,
}: SectionProps) {
  const style = variantStyles[variant];

  return (
    <section id={id} className={`relative w-full overflow-hidden ${style.background} ${className}`}>
      {decorations && <div className="pointer-events-none absolute inset-0 -z-10">{decorations}</div>}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 py-24 md:py-28">
        <motion.div
          className={`relative z-10 ${contentClassName}`}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
