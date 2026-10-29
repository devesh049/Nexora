"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-background-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-accent/5 to-highlight/5 p-10 sm:p-16 text-center overflow-hidden"
        >
          {/* Background lights */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/8 blur-[60px] rounded-full pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              Free to get started
            </div>

            <h2 className="text-3xl font-bold text-foreground sm:text-5xl max-w-2xl mx-auto leading-tight">
              Ready to build with{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent">
                Nexora?
              </span>
            </h2>

            <p className="mt-5 text-lg text-foreground-secondary max-w-xl mx-auto">
              Join the platform where developers and creators discover tools, build products, and connect digital services.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="gap-2 w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/apps">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore the Platform
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
