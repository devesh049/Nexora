"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Globe, Shield, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const mockApps = [
  { name: "Project Workspace", desc: "Application preview", color: "from-indigo-500/20 to-violet-500/20", icon: "🗂️" },
  { name: "AI Writing Assistant", desc: "Planned experience", color: "from-violet-500/20 to-purple-500/20", icon: "✨" },
  { name: "Developer Playground", desc: "Planned experience", color: "from-blue-500/20 to-cyan-500/20", icon: "⚡" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] translate-y-1/4 -translate-x-1/4 rounded-full bg-accent/5 blur-[100px]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm text-primary mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Product preview
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              Your Digital World,{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent">
                Connected.
              </span>
            </h1>

            <p className="mt-6 text-lg text-foreground-secondary max-w-xl leading-relaxed">
              Discover powerful applications, simplify everyday tasks, and
              access developer-friendly services — all from one unified platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/apps">
                <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                  Explore Applications
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Tools
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-5 text-sm text-foreground-muted">
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                Browser-based
              </div>
              <div className="h-1 w-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Privacy-first
              </div>
              <div className="h-1 w-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                No install needed
              </div>
            </div>
          </motion.div>

          {/* Right Column - Product Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            {/* Main Card */}
            <div className="relative rounded-2xl border border-border bg-surface shadow-xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background-secondary">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-error/70" />
                  <div className="h-3 w-3 rounded-full bg-warning/70" />
                  <div className="h-3 w-3 rounded-full bg-success/70" />
                </div>
                <div className="flex items-center gap-2 bg-surface rounded-md px-3 py-1 text-xs text-foreground-muted border border-border">
                  <span>nexora.app/dashboard</span>
                </div>
                <div className="w-14" />
              </div>

              <div className="p-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: "Apps", value: "Preview", color: "text-primary" },
                    { label: "Tools", value: "In browser", color: "text-accent" },
                    { label: "APIs", value: "Planned", color: "text-highlight" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border bg-background p-3 text-center">
                      <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-foreground-muted mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* App list */}
                <div className="space-y-2.5">
                  {mockApps.map((app, i) => (
                    <motion.div
                      key={app.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3 rounded-xl border border-border p-3 bg-background hover:border-primary/30 transition-colors cursor-default"
                    >
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center text-lg flex-shrink-0`}>
                        {app.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{app.name}</p>
                        <p className="text-xs text-foreground-muted">{app.desc}</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-success flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="absolute -top-5 -right-5 rounded-xl border border-border bg-surface/90 backdrop-blur p-3 shadow-lg hidden lg:block"
            >
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-warning fill-warning" />
                <span className="text-sm font-semibold text-foreground">Featured</span>
              </div>
              <p className="text-xs text-foreground-muted mt-0.5">Explore the catalog</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="absolute -bottom-5 -left-5 rounded-xl border border-border bg-surface/90 backdrop-blur p-3 shadow-lg hidden lg:block"
            >
              <div className="flex items-center gap-1.5 text-success">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium">Local demo experience</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
