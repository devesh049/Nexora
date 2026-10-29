"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function hexToHsl(
  hex: string
): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export default function ColorPickerPage() {
  const [color, setColor] = useState("#3b82f6");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const formats = [
    { label: "HEX", value: color.toUpperCase() },
    {
      label: "RGB",
      value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "",
    },
    {
      label: "HSL",
      value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "",
    },
  ];

  const copyFormat = useCallback(async (format: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 1500);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-foreground-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Palette className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Color Picker</h1>
      </div>
      <p className="text-sm text-foreground-secondary mb-6">
        Pick a color and get its HEX, RGB, and HSL values instantly.
      </p>

      {/* Color Picker */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-3">
          Select Color
        </label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-20 w-20 rounded-xl border-2 border-border cursor-pointer"
          />
          <div className="flex-1">
            <div
              className="h-20 rounded-xl border border-border"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      </div>

      {/* Color Formats */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground mb-2">
          Color Formats
        </label>
        {formats.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex-1">
              <div className="text-xs text-foreground-muted mb-1">{label}</div>
              <code className="text-sm font-mono text-foreground font-semibold">
                {value}
              </code>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyFormat(label, value)}
            >
              {copiedFormat === label ? (
                <>
                  <Check className="h-4 w-4 text-success" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
