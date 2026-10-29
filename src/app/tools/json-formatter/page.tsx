"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, RotateCcw, Braces } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [tabSize, setTabSize] = useState<2 | 4>(2);
  const [copied, setCopied] = useState(false);

  const format = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter some JSON.");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, tabSize));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }, [input, tabSize]);

  const minify = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter some JSON.");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }, [input]);

  const validate = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter some JSON.");
      setOutput("");
      return;
    }
    try {
      JSON.parse(input);
      setError("");
      setOutput("✓ Valid JSON");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }, [input]);

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
          <Braces className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">JSON Formatter</h1>
      </div>
      <p className="text-sm text-foreground-secondary mb-6">
        Format, validate, and minify JSON data. Everything runs in your browser.
      </p>

      {/* Tab size selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-foreground-secondary">Indent:</span>
        {([2, 4] as const).map((size) => (
          <Button
            key={size}
            variant={tabSize === size ? "primary" : "ghost"}
            size="sm"
            onClick={() => setTabSize(size)}
          >
            {size} spaces
          </Button>
        ))}
      </div>

      {/* Input */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste your JSON here… e.g. {"key":"value"}'
        className="w-full h-48 rounded-xl border border-border bg-surface p-4 text-sm font-mono text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary resize-y"
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="primary" onClick={format}>
          Format / Beautify
        </Button>
        <Button variant="default" onClick={minify}>
          Minify
        </Button>
        <Button variant="default" onClick={validate}>
          Validate
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
          }}
        >
          <RotateCcw className="h-4 w-4" /> Clear
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl bg-error/10 border border-error/20 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Output */}
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
            className="w-full h-48 rounded-xl border border-border bg-background-secondary p-4 text-sm font-mono text-foreground focus:outline-none resize-y"
          />
        </div>
      )}
    </div>
  );
}
