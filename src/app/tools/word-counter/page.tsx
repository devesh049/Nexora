"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Type } from "lucide-react";

export default function WordCounterPage() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    const text = input;
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const withoutSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed
      ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || (words > 0 ? 1 : 0)
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length
      : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    return { words, characters, withoutSpaces, sentences, paragraphs, readingTime };
  }, [input]);

  const tiles = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "No Spaces", value: stats.withoutSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Read Time", value: `${stats.readingTime} min` },
  ];

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
          <Type className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Word Counter</h1>
      </div>
      <p className="text-sm text-foreground-secondary mb-6">
        Count words, characters, sentences, and estimate reading time — all in
        real time.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Start typing or paste your text here…"
        className="w-full h-48 rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary resize-y"
      />

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-6">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="rounded-xl border border-border bg-surface p-4 text-center"
          >
            <div className="text-2xl font-bold text-foreground">{t.value}</div>
            <div className="text-xs text-foreground-muted mt-1">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
