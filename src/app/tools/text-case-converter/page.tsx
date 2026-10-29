"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  CaseSensitive,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type CaseType =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "camel"
  | "snake"
  | "kebab";

function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  );
}

function toSentenceCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}

function toCamelCase(str: string) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function toSnakeCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .toLowerCase();
}

function toKebabCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

const cases: { label: string; type: CaseType }[] = [
  { label: "UPPERCASE", type: "upper" },
  { label: "lowercase", type: "lower" },
  { label: "Title Case", type: "title" },
  { label: "Sentence case", type: "sentence" },
  { label: "camelCase", type: "camel" },
  { label: "snake_case", type: "snake" },
  { label: "kebab-case", type: "kebab" },
];

export default function TextCaseConverterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(
    (type: CaseType) => {
      if (!input) return;
      const result: Record<CaseType, string> = {
        upper: input.toUpperCase(),
        lower: input.toLowerCase(),
        title: toTitleCase(input),
        sentence: toSentenceCase(input),
        camel: toCamelCase(input),
        snake: toSnakeCase(input),
        kebab: toKebabCase(input),
      };
      setOutput(result[type]);
    },
    [input]
  );

  const copyOutput = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

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
          <CaseSensitive className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Text Case Converter
        </h1>
      </div>
      <p className="text-sm text-foreground-secondary mb-6">
        Convert text between UPPERCASE, lowercase, Title Case, camelCase and
        more.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or paste your text here…"
        className="w-full h-36 rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary resize-y"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {cases.map(({ label, type }) => (
          <Button
            key={type}
            variant="default"
            size="sm"
            onClick={() => convert(type)}
          >
            {label}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setInput("");
            setOutput("");
          }}
        >
          <RotateCcw className="h-4 w-4" /> Clear
        </Button>
      </div>

      {output && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Output</span>
            <Button variant="ghost" size="sm" onClick={copyOutput}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-success" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </Button>
          </div>
          <textarea
            readOnly
            value={output}
            className="w-full h-32 rounded-xl border border-border bg-background-secondary p-4 text-sm font-mono text-foreground focus:outline-none resize-y"
          />
        </div>
      )}
    </div>
  );
}
