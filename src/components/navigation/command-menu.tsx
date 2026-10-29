"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, X, ArrowRight, LayoutGrid, Wrench, Code2,
  Sparkles, DollarSign, BookOpen, Activity, User
} from "lucide-react";
import { apps } from "@/data/apps";
import { tools } from "@/data/tools";
import { cn } from "@/lib/utils";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quickLinks = [
  { name: "Applications", href: "/apps", icon: LayoutGrid, group: "Pages" },
  { name: "Tools", href: "/tools", icon: Wrench, group: "Pages" },
  { name: "Developer APIs", href: "/developers", icon: Code2, group: "Pages" },
  { name: "AI Tools", href: "/#ai-tools", icon: Sparkles, group: "Pages" },
  { name: "Pricing", href: "/pricing", icon: DollarSign, group: "Pages" },
  { name: "Documentation", href: "/docs", icon: BookOpen, group: "Pages" },
  { name: "Status", href: "/status", icon: Activity, group: "Pages" },
  { name: "Login", href: "/login", icon: User, group: "Account" },
  { name: "Sign Up", href: "/signup", icon: User, group: "Account" },
];

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timeout);
  }, [open]);

  const filteredApps = useMemo(() => apps
    .filter(
      (app) =>
        app.name.toLowerCase().includes(query.toLowerCase()) ||
        app.description.toLowerCase().includes(query.toLowerCase()) ||
        app.category.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4), [query]);

  const filteredTools = useMemo(() => tools
    .filter(
      (tool) =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4), [query]);

  const filteredLinks = useMemo(() => quickLinks.filter(
    (link) =>
      !query || link.name.toLowerCase().includes(query.toLowerCase())
  ), [query]);

  const allResults = useMemo(() => [
    ...filteredLinks.map((l) => ({ ...l, type: "page" as const })),
    ...filteredApps.map((a) => ({ name: a.name, href: a.href, icon: LayoutGrid, type: "app" as const, description: a.description })),
    ...filteredTools.map((t) => ({ name: t.name, href: t.href, icon: Wrench, type: "tool" as const, description: t.description })),
  ], [filteredApps, filteredLinks, filteredTools]);

  const closeMenu = useCallback(() => {
    setQuery("");
    setSelectedIndex(0);
    onOpenChange(false);
  }, [onOpenChange]);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      closeMenu();
    },
    [router, closeMenu]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { closeMenu(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, Math.max(0, allResults.length - 1))); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && allResults[selectedIndex]) {
        navigate(allResults[selectedIndex].href);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, allResults, selectedIndex, navigate, closeMenu]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={closeMenu}
      />

      {/* Dialog */}
      <div role="dialog" aria-modal="true" aria-label="Search Nexora" className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-foreground-muted flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Search apps, tools, pages..."
            className="flex-1 bg-transparent text-foreground placeholder:text-foreground-muted outline-none text-base"
            aria-label="Search command menu"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setSelectedIndex(0); }}
              className="p-1 rounded hover:bg-surface-hover text-foreground-muted"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded border border-border px-2 py-1 text-xs text-foreground-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto py-2">
          {allResults.length === 0 ? (
            <div className="py-12 text-center text-foreground-muted text-sm">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {!query && (
                <div className="px-3 pb-1">
                  <p className="px-2 text-xs font-medium text-foreground-muted uppercase tracking-wider">Quick Navigation</p>
                </div>
              )}
              {query && filteredApps.length > 0 && (
                <div className="px-3 pb-1 pt-2">
                  <p className="px-2 text-xs font-medium text-foreground-muted uppercase tracking-wider">Applications</p>
                </div>
              )}
              {allResults.map((result, i) => {
                const Icon = result.icon;
                return (
                  <button
                    key={result.href + result.name}
                    onClick={() => navigate(result.href)}
                    className={cn(
                      "w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors",
                      i === selectedIndex
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-surface-hover"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-foreground-muted" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{result.name}</p>
                      {"description" in result && result.description && (
                        <p className="text-xs text-foreground-muted truncate">{result.description}</p>
                      )}
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-foreground-muted flex-shrink-0" />
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-background-secondary">
          <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">↵</kbd> open
          </span>
          <span className="flex items-center gap-1.5 text-xs text-foreground-muted ml-auto">
            <kbd className="rounded border border-border px-1.5 py-0.5 text-xs">ESC</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
