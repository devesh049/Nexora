"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap, Star, Building2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pricingPlans } from "@/data/pricing";
import { cn } from "@/lib/utils";

const planIcons = [Zap, Star, Building2];

export function PricingSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground-muted mb-4">
            Simple Pricing
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Start Free, Scale as You Grow
          </h2>
          <p className="mt-3 text-foreground-secondary max-w-md mx-auto">
            Illustrative pricing — billing integration coming soon.
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-foreground-muted">
            <Info className="h-3.5 w-3.5" />
            Prices shown are for illustration only
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {pricingPlans.map((plan, i) => {
            const Icon = planIcons[i];
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={cn(
                  "relative rounded-2xl border p-6 flex flex-col",
                  plan.highlighted
                    ? "border-primary bg-gradient-to-b from-primary/5 to-transparent shadow-xl shadow-primary/10"
                    : "border-border bg-surface"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant="primary" className="px-3 py-1">Most Popular</Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={cn("h-5 w-5", plan.highlighted ? "text-primary" : "text-foreground-muted")} />
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    </div>
                    <p className="text-xs text-foreground-muted">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-foreground-muted text-sm mb-1">/mo</span>
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                      <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.name === "Free" ? <Link href="/signup"><Button variant="primary" className="w-full">Create free account</Button></Link> : <Button variant="outline" className="w-full" disabled>Billing not configured</Button>}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/pricing" className="text-sm text-primary hover:underline">
            View full pricing comparison →
          </Link>
        </div>
      </div>
    </section>
  );
}
