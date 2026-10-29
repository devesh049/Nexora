"use client";

import { motion } from "framer-motion";
import { Search, Play, Save } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description: "Browse our curated collection of apps and tools. Use the search or category filters to find exactly what you need.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    number: "02",
    icon: Play,
    title: "Open & Use",
    description: "Launch any tool or app directly in your browser. No installation, no accounts required for most tools.",
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400",
  },
  {
    number: "03",
    icon: Save,
    title: "Save & Share",
    description: "Sign up to save your work, access your history, and share results with your team — all from your dashboard.",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground-muted mb-4">
            How It Works
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Up and Running in Seconds
          </h2>
          <p className="mt-3 text-foreground-secondary max-w-md mx-auto">
            No complex setup. Just open Nexora and start being productive.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="absolute top-16 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative text-center"
                >
                  <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 relative`}>
                    <Icon className={`h-7 w-7 ${step.iconColor}`} />
                    <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-surface border-2 border-border flex items-center justify-center text-xs font-bold text-foreground-muted">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
