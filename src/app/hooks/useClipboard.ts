import { useState } from "react";

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return { copied, copy };
}