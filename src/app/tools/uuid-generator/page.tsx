"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = useCallback((count: number) => {
    const newUuids = Array.from({ length: count }, () => crypto.randomUUID());
    setUuids(newUuids);
    setCopiedIndex(null);
    setCopiedAll(false);
  }, []);

  const copyOne = useCallback(async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }, []);

  const copyAll = useCallback(async () => {
    if (uuids.length === 0) return;
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  }, [uuids]);

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
          <Fingerprint className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">UUID Generator</h1>
      </div>
      <p className="text-sm text-foreground-secondary mb-6">
        Generate cryptographically secure UUIDs (v4). Uses crypto.randomUUID()
        for true randomness.
      </p>

      {/* Generate Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[1, 5, 10, 25].map((count) => (
          <Button
            key={count}
            variant="default"
            size="sm"
            onClick={() => generate(count)}
          >
            <RefreshCw className="h-4 w-4" /> Generate {count}
          </Button>
        ))}
      </div>

      {/* UUIDs List */}
      {uuids.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">
              {uuids.length} UUID{uuids.length > 1 ? "s" : ""}
            </span>
            {uuids.length > 1 && (
              <Button variant="ghost" size="sm" onClick={copyAll}>
                {copiedAll ? (
                  <>
                    <Check className="h-4 w-4 text-success" /> Copied All!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy All
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {uuids.map((uuid, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 group hover:border-primary/30 transition-colors"
              >
                <code className="text-sm font-mono text-foreground flex-1">
                  {uuid}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyOne(uuid, index)}
                  className="ml-3"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4 text-success" />
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
      )}
    </div>
  );
}
