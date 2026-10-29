"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tools, toolCategories } from "@/data/tools";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function ToolIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Wrench;
  return <Icon className="h-5 w-5" />;
}

const categoryColors: Record<string, string> = {
  Developer: "from-blue-500/15 to-cyan-500/15 text-blue-400",
  Text: "from-emerald-500/15 to-teal-500/15 text-emerald-400",
  Utilities: "from-amber-500/15 to-orange-500/15 text-amber-400",
  Security: "from-red-500/15 to-rose-500/15 text-red-400",
  Design: "from-purple-500/15 to-pink-500/15 text-purple-400",
};

export function PopularToolsSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? tools.slice(0, 8)
    : tools.filter((t) => t.category === activeCategory).slice(0, 8);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground-muted mb-4">
            Browser-Based Tools
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Popular Online Tools
          </h2>
          <p className="mt-3 text-foreground-secondary max-w-xl mx-auto">
            Fast, privacy-respecting utilities that run entirely in your browser — no sign-up required.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {toolCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "border-border text-foreground-secondary hover:border-primary/50 hover:text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((tool, i) => {
            const colors = categoryColors[tool.category] || "from-primary/15 to-accent/15 text-primary";
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              >
                <Link href={tool.href}>
                  <div className="group rounded-xl border border-border bg-surface p-4 hover:border-primary/30 hover:bg-surface-hover transition-all duration-200 cursor-pointer h-full">
                    <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3", colors)}>
                      <ToolIcon name={tool.icon} />
                    </div>
                    <h3 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground-muted line-clamp-2">
                      {tool.description}
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline" size="sm">{tool.category}</Badge>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/tools">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Browse All Tools
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
