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
    background: "bg-gradient-to-r from-[#44186f] via-[#1b1e5a] to-[#020414]",
    edgeColor: "#1b1e5a",
  },
  dark: {
    background: "bg-gradient-to-b from-[#050819] via-[#040b1f] to-[#020414]",
    edgeColor: "#1b1e5a",
  },
  darker: {
    background: "bg-gradient-to-b from-[#020414] via-[#010712] to-[#01030a]",
    edgeColor: "#010712",
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
