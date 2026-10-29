"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Key, BookOpen, Webhook, Terminal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Key,
    title: "API Key Management",
    description: "Preview the planned key management flow. Real keys are not available yet.",
    href: "/api-keys",
    color: "text-amber-400",
    bg: "from-amber-500/15 to-orange-500/15",
  },
  {
    icon: BookOpen,
    title: "Full Documentation",
    description: "Explore clearly labeled concepts for the planned developer platform.",
    href: "/docs",
    color: "text-blue-400",
    bg: "from-blue-500/15 to-cyan-500/15",
  },
  {
    icon: Webhook,
    title: "Webhooks & Events (planned)",
    description: "Webhook delivery and event subscriptions are not implemented yet.",
    href: "/developers",
    color: "text-purple-400",
    bg: "from-purple-500/15 to-violet-500/15",
  },
  {
    icon: Terminal,
    title: "CLI & SDKs (planned)",
    description: "Official SDKs and a CLI have not been published.",
    href: "/docs",
    color: "text-emerald-400",
    bg: "from-emerald-500/15 to-teal-500/15",
  },
];

const codeExample = `// Initialize the Nexora client
import { Nexora } from '@nexora/sdk';

const client = new Nexora({
  apiKey: process.env.NEXORA_API_KEY,
});

// Generate or process content
const result = await client.tools.run('json-formatter', {
  input: '{"name":"Nexora","version":1}',
  options: { indent: 2 },
});

console.log(result.output);`;

export function DeveloperSection() {
  return (
    <section className="py-20 bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground-muted mb-4">
              <Code2 className="h-3.5 w-3.5" />
              Developer Ecosystem
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Built for Developers, by Developers
            </h2>
            <p className="mt-4 text-foreground-secondary leading-relaxed">
              The developer portal presents the planned integration surface. APIs and SDKs are examples only until a backend is deployed.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link key={feature.title} href={feature.href}>
                    <div className="group rounded-xl border border-border bg-surface p-4 hover:border-primary/30 transition-all duration-200 h-full">
                      <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${feature.bg} flex items-center justify-center mb-3`}>
                        <Icon className={`h-4 w-4 ${feature.color}`} />
                      </div>
                      <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-xs text-foreground-muted">{feature.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3">
              <Link href="/docs">
                <Button variant="primary" className="gap-2">
                  Read the Docs <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/api-keys">
                <Button variant="outline">Get API Key</Button>
              </Link>
            </div>
          </motion.div>

          {/* Right - Code Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-xl">
              {/* Code header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background-secondary">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-error/60" />
                  <div className="h-3 w-3 rounded-full bg-warning/60" />
                  <div className="h-3 w-3 rounded-full bg-success/60" />
                </div>
                <span className="text-xs text-foreground-muted font-mono">planned-example.ts</span>
                <div className="w-14" />
              </div>
              <pre className="p-5 text-xs font-mono text-foreground-secondary overflow-x-auto leading-relaxed">
                <code>{codeExample}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
