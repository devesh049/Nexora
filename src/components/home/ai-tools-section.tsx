"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, FileText, MessageSquare, Lightbulb, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const aiTools = [
  {
    icon: FileText,
    name: "Text Summarizer",
    description: "Condense long articles and documents into clear, concise summaries.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    status: "demo",
  },
  {
    icon: MessageSquare,
    name: "AI Writing Assistant",
    description: "Improve your writing with AI-powered suggestions, rewrites, and tone adjustments.",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
    status: "pro",
  },
  {
    icon: Lightbulb,
    name: "Idea Generator",
    description: "Brainstorm ideas, outlines, and creative concepts for any topic.",
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    status: "demo",
  },
];

export function AIToolsSection() {
  return (
    <section id="ai-tools" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs text-primary mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Intelligent Tools for Modern Work
          </h2>
          <p className="mt-3 text-foreground-secondary max-w-xl mx-auto">
            AI-powered concepts designed to help you write better, work smarter, and think clearer.
            These experiences are previews; no AI provider is connected.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-foreground-muted">
            <Lock className="h-3.5 w-3.5" />
            AI processing is disabled until a server-side provider is configured.
          </div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-3">
          {aiTools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group rounded-2xl border border-border bg-surface p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${tool.iconColor}`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{tool.name}</h3>
                  {tool.status === "demo" && <Badge variant="default">Demo</Badge>}
                  {tool.status === "pro" && <Badge variant="secondary">Pro</Badge>}
                </div>
                <p className="text-sm text-foreground-secondary">{tool.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/apps">
            <Button variant="primary" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Explore AI Tools
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
