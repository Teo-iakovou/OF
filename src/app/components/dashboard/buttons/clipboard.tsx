"use client";

import React from "react";
import { useClipboard } from "@/app/hooks/useClipboard";

type Props = {
  text: string;
  label?: string;          // ← add label prop
  copiedLabel?: string;    // optional custom copied text
  className?: string;      // tailwind classes
  onCopied?: () => void;   // callback after copy (optional)
};

const ClipboardButton: React.FC<Props> = ({
  text,
  label = "Copy",
  copiedLabel = "✓ Copied",
  className = "",
  onCopied,
}) => {
  const { copied, copy } = useClipboard();

  const handleClick = async () => {
    await copy(text);
    onCopied?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`px-3 py-1.5 rounded-lg text-white text-sm ${className}`}
      aria-live="polite"
    >
      {copied ? copiedLabel : label}
    </button>
  );
};

export default ClipboardButton;