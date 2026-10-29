import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, Terminal, Key, Shield, AlertCircle, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Planned Nexora API documentation. The documented routes and SDK examples are not yet deployed.",
};

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "authentication", title: "Authentication" },
  { id: "endpoints", title: "API Endpoints" },
  { id: "errors", title: "Error Codes" },
  { id: "rate-limits", title: "Rate Limits" },
  { id: "sdks", title: "SDKs & Libraries" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">On this page</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`}
                    className="block px-3 py-1.5 rounded-lg text-sm text-foreground-secondary hover:bg-surface-hover hover:text-foreground transition-colors">
                    {s.title}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t border-border">
                <Link href="/api-keys">
                  <Button variant="primary" size="sm" className="w-full gap-2">
                    <Key className="h-3.5 w-3.5" /> Get API Key
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-12">
            <div id="introduction">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">API Documentation</h1>
                <Badge variant="warning">Planned API</Badge>
              </div>
              <p className="text-foreground-secondary leading-relaxed">
                This page outlines the planned Nexora API. The routes and examples below are illustrative and are not deployed.
              </p>
              <div className="mt-4 rounded-xl border border-info/30 bg-info/5 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground-secondary">
                  <strong>Note:</strong> The Nexora API is currently in development. The endpoints and SDKs shown
                  here represent the planned public API. Sign up to receive early access.
                </p>
              </div>
            </div>

            <div id="authentication">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" /> Authentication
              </h2>
              <p className="text-foreground-secondary mb-4">
                All API requests require authentication via an API key passed in the <code className="px-1.5 py-0.5 rounded bg-surface-hover text-primary font-mono text-sm">Authorization</code> header.
              </p>
              <div className="rounded-xl border border-border bg-surface overflow-hidden">
                <div className="px-4 py-2.5 bg-background-secondary border-b border-border flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-foreground-muted" />
                  <span className="text-xs text-foreground-muted font-mono">HTTP Header</span>
                </div>
                <pre className="p-4 text-sm font-mono text-foreground-secondary overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
                </pre>
              </div>
            </div>

            <div id="endpoints">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-highlight" /> API Endpoints
              </h2>
              <div className="space-y-4">
                {[
                  { method: "GET", path: "/v1/tools", desc: "Returns a paginated list of available tools with metadata.", response: `{ "tools": [...], "total": 10, "page": 1 }` },
                  { method: "POST", path: "/v1/tools/{id}/run", desc: "Execute a tool with the given input parameters.", response: `{ "output": "...", "elapsed_ms": 42 }` },
                  { method: "GET", path: "/v1/apps", desc: "List all published applications on the platform.", response: `{ "apps": [...], "total": 24 }` },
                ].map((ep) => (
                  <div key={ep.path} className="rounded-xl border border-border bg-surface overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background-secondary">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${ep.method === "GET" ? "text-success border-success/30 bg-success/8" : "text-primary border-primary/30 bg-primary/8"}`}>
                        {ep.method}
                      </span>
                      <code className="text-sm font-mono text-foreground">{ep.path}</code>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground-secondary mb-3">{ep.desc}</p>
                      <p className="text-xs text-foreground-muted mb-1.5">Example Response</p>
                      <pre className="text-xs font-mono text-foreground-secondary bg-background-secondary rounded-lg p-3">{ep.response}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="errors">
              <h2 className="text-2xl font-bold text-foreground mb-4">Error Codes</h2>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background-secondary">
                      <th className="px-4 py-3 text-left font-medium text-foreground-muted">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground-muted">Code</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground-muted">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { status: 400, code: "bad_request", desc: "Invalid request body or parameters" },
                      { status: 401, code: "unauthorized", desc: "Missing or invalid API key" },
                      { status: 403, code: "forbidden", desc: "Insufficient permissions for this resource" },
                      { status: 404, code: "not_found", desc: "Resource not found" },
                      { status: 429, code: "rate_limited", desc: "Too many requests — see Rate Limits" },
                      { status: 500, code: "internal_error", desc: "An unexpected server error occurred" },
                    ].map((e) => (
                      <tr key={e.status} className="bg-surface hover:bg-surface-hover transition-colors">
                        <td className="px-4 py-2.5 font-mono text-foreground-secondary">{e.status}</td>
                        <td className="px-4 py-2.5 font-mono text-primary">{e.code}</td>
                        <td className="px-4 py-2.5 text-foreground-secondary">{e.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div id="rate-limits">
              <h2 className="text-2xl font-bold text-foreground mb-4">Rate Limits</h2>
              <p className="text-foreground-secondary mb-4">Rate limits have not been implemented. The following limits are illustrative product-planning examples only.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { plan: "Free", limit: "Illustrative limit", color: "border-border" },
                  { plan: "Pro", limit: "Illustrative limit", color: "border-primary/30" },
                  { plan: "Team", limit: "Illustrative limit", color: "border-accent/30" },
                ].map((r) => (
                  <div key={r.plan} className={`rounded-xl border p-4 bg-surface ${r.color}`}>
                    <p className="font-semibold text-foreground">{r.plan}</p>
                    <p className="text-sm text-foreground-muted mt-0.5">{r.limit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="sdks">
              <h2 className="text-2xl font-bold text-foreground mb-4">SDKs & Libraries</h2>
              <p className="text-foreground-secondary mb-4">Official SDKs are planned for the following languages:</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {["JavaScript / TypeScript", "Python", "Go", "Java"].map((lang) => (
                  <div key={lang} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
                    <Terminal className="h-5 w-5 text-foreground-muted" />
                    <span className="text-sm font-medium text-foreground">{lang}</span>
                    <Badge variant="default" className="ml-auto">Planned</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-foreground-muted text-sm mb-3">Ready to start building?</p>
              <Link href="/api-keys">
                <Button variant="primary" className="gap-2">
                  Create an API Key <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
