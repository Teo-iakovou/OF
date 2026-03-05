"use client";

import React from "react";
import Reveal from "@/app/components/common/Reveal";

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
  delay?: number;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className">;

export default function SectionReveal({
  children,
  className = "",
  as = "section",
  delay = 0,
  ...rest
}: SectionRevealProps) {
  return (
    <Reveal
      as={as}
      delay={delay}
      once
      threshold={0.08}
      className={`duration-[750ms] ease-out [&.opacity-0]:translate-y-10 [&.opacity-0]:blur-[6px] [&.opacity-100]:translate-y-0 [&.opacity-100]:blur-0 ${className}`}
      {...rest}
    >
      {children}
    </Reveal>
  );
}
