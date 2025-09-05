"use client";

import React from "react";

type Props = {
  className?: string;
};

export function Skeleton({ className = "" }: Props) {
  return (
    <div
      className={[
        "animate-pulse rounded-md bg-gray-200/20 dark:bg-gray-700/40",
        className,
      ].join(" ")}
      aria-hidden
    />
  );
}

