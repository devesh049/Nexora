"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, RotateCcw, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UrlEncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = useCallback(() => {
    if (!input) {
      setError("Please enter text to encode.");
      setOutput("");
      return;
    }
    try {
      setOutput(encodeURIComponent(input));
      setError("");
    } catch {
      setError("Failed to encode input.");
      setOutput("");
    }
  }, [input]);

  const decode = useCallback(() => {
    if (!input) {
      setError("Please enter text to decode.");
      setOutput("");
      return;
    }
    try {
      setOutput(decodeURIComponent(input));
      setError("");
    } catch {
      setError("Invalid URL-encoded string.");
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
          <LinkIcon className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          URL Encoder / Decoder
        </h1>
      </div>
      <p className="text-sm text-foreground-secondary mb-6">
        Encode or decode URL parameters and query strings. Handles all special
        characters.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text or URL-encoded string…"
        className="w-full h-40 rounded-xl border border-border bg-surface p-4 text-sm font-mono text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary resize-y"
      />

      <div className="flex flex-wrap gap-2 mt-4">
        <Button variant="primary" onClick={encode}>
          Encode
        </Button>
        <Button variant="default" onClick={decode}>
          Decode
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

      {error && (
        <div className="mt-4 rounded-xl bg-error/10 border border-error/20 p-3 text-sm text-error">
          {error}
        </div>
      )}

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
