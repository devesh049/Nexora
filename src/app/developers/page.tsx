import type { Metadata } from "next";
import Link from "next/link";
import { Code2, Key, BookOpen, Activity, ArrowRight, Terminal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Developer Portal",
  description: "Explore Nexora's planned API, SDK, and webhook concepts. These integrations are not deployed.",
};

const features = [
  { icon: Key, title: "API Keys", desc: "Key management preview; no real keys can be created yet.", href: "/api-keys" },
  { icon: BookOpen, title: "Documentation", desc: "Planned API concepts, clearly separated from working features.", href: "/docs" },
  { icon: Activity, title: "Service Status", desc: "Current implementation state; uptime monitoring is not configured.", href: "/status" },
  { icon: Terminal, title: "SDKs & CLI", desc: "SDKs and command-line tools are planned, not published.", href: "/docs" },
];

const endpoints = [
  { method: "GET", path: "/api/v1/tools", desc: "List available tools" },
  { method: "POST", path: "/api/v1/tools/{id}/run", desc: "Execute a tool" },
  { method: "GET", path: "/api/v1/apps", desc: "List all applications" },
  { method: "GET", path: "/api/v1/status", desc: "Platform health status" },
];

const methodColors: Record<string, string> = {
  GET: "text-success border-success/30 bg-success/8",
  POST: "text-primary border-primary/30 bg-primary/8",
  PUT: "text-warning border-warning/30 bg-warning/8",
  DELETE: "text-error border-error/30 bg-error/8",
};

export default function DevelopersPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground-muted mb-4">
            <Code2 className="h-3.5 w-3.5" />
            Developer Portal
          </div>
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Build with Nexora</h1>
          <p className="mt-4 text-lg text-foreground-secondary max-w-xl mx-auto">
            Explore the planned Nexora developer ecosystem. The public API, webhooks, and SDKs are not available in this demo yet.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link href="/docs">
              <Button variant="primary" className="gap-2">
                Read the Docs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/api-keys">
              <Button variant="outline" className="gap-2">
                <Key className="h-4 w-4" /> Get API Key
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link key={f.title} href={f.href}>
                <div className="group rounded-2xl border border-border bg-surface p-5 hover:border-primary/30 hover:shadow-md transition-all h-full">
                  <Icon className="h-6 w-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-foreground-muted">{f.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* API Endpoints overview */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">Planned API Endpoints</h2>
          <p className="mb-6 text-sm text-foreground-muted">Examples only. These endpoints are not deployed and cannot be called.</p>
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-3 bg-background-secondary border-b border-border flex items-center gap-2">
              <Terminal className="h-4 w-4 text-foreground-muted" />
              <span className="text-sm text-foreground-muted font-mono">Example routes</span>
              <Badge variant="warning" className="ml-auto">Planned</Badge>
            </div>
            <div className="divide-y divide-border">
              {endpoints.map((ep) => (
                <div key={ep.path} className="flex items-center gap-4 px-5 py-3 bg-surface hover:bg-surface-hover transition-colors">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border flex-shrink-0 ${methodColors[ep.method] || ""}`}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-foreground flex-1">{ep.path}</code>
                  <span className="text-sm text-foreground-muted hidden sm:block">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick start */}
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Planned integration example — not executable
            </h2>
          </div>
          <div className="p-5">
            <pre className="text-sm font-mono text-foreground-secondary overflow-x-auto leading-relaxed">
{`# Install the SDK
npm install @nexora/sdk

# Use it in your project
import { Nexora } from '@nexora/sdk';

const client = new Nexora({
  apiKey: process.env.NEXORA_API_KEY,
});

// Run a tool
const result = await client.tools.run('json-formatter', {
  input: '{"hello":"world"}',
});

console.log(result.output);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
