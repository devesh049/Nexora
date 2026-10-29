"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "default";
}

export function CopyButton({ text, className, size = "default" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-border bg-surface-hover transition-all",
        "hover:bg-border-hover text-foreground-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
        className
      )}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <Check className={cn("text-success", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
      ) : (
        <Copy className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} />
      )}
    </button>
  );
}
