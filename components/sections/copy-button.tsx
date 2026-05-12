"use client";

import { useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy email address"
      className="ml-2 text-ash hover:text-bone transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2 rounded-sm"
    >
      {copied ? (
        <IconCheck size={14} stroke={1.5} className="text-plasma" />
      ) : (
        <IconCopy size={14} stroke={1.5} />
      )}
    </button>
  );
}
