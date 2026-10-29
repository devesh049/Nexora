"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedAppsSection() {
  return (
    <section className="bg-background-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground-muted">Featured Applications</div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Your next workspace starts here</h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground-secondary">Applications will appear as real destinations are published. In the meantime, Nexora&apos;s browser tools are ready to use.</p>
        </motion.div>
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
          <LayoutGrid className="mx-auto h-8 w-8 text-foreground-muted" />
          <p className="mt-3 font-medium text-foreground">No applications are published yet</p>
          <p className="mt-1 text-sm text-foreground-secondary">Use the working browser tools while the application catalog is being prepared.</p>
          <Link href="/apps" className="mt-5 inline-flex"><Button variant="outline" className="gap-2">Browse catalog <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}
