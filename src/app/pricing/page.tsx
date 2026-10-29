import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap, Star, Building2, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { pricingPlans } from "@/data/pricing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Illustrative Nexora plan previews. No paid plans or billing are currently available.",
};

const planIcons = [Zap, Star, Building2];
const planColors = ["text-blue-400", "text-primary", "text-purple-400"];

const comparisonFeatures = [
  { name: "Access to tools", free: true, pro: true, team: true },
  { name: "Basic applications", free: true, pro: true, team: true },
  { name: "Premium applications", free: false, pro: true, team: true },
  { name: "AI-powered features", free: false, pro: true, team: true },
  { name: "Storage", free: "5 GB", pro: "50 GB", team: "500 GB" },
  { name: "API requests/month", free: "1,000", pro: "50,000", team: "500,000" },
  { name: "Custom integrations", free: false, pro: true, team: true },
  { name: "Team workspace", free: false, pro: false, team: true },
  { name: "Advanced analytics", free: false, pro: false, team: true },
  { name: "SSO integration", free: false, pro: false, team: true },
  { name: "Dedicated support", free: false, pro: false, team: true },
  { name: "Custom branding", free: false, pro: false, team: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="h-4 w-4 text-success mx-auto" />;
  if (value === false) return <span className="text-foreground-muted text-xs">—</span>;
  return <span className="text-sm text-foreground-secondary">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-foreground-secondary max-w-xl mx-auto">
            Start free and upgrade when you need more power. No hidden fees.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-foreground-muted">
            <Info className="h-4 w-4" />
            Prices shown are illustrative — billing integration coming soon
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {pricingPlans.map((plan, i) => {
            const Icon = planIcons[i];
            const color = planColors[i];
            return (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl border p-6 flex flex-col",
                  plan.highlighted
                    ? "border-primary bg-gradient-to-b from-primary/8 to-surface shadow-xl shadow-primary/10"
                    : "border-border bg-surface"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant="primary" className="px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={cn("h-5 w-5", color)} />
                    <h2 className="text-lg font-semibold text-foreground">{plan.name}</h2>
                  </div>
                  <p className="text-sm text-foreground-muted">{plan.description}</p>
                </div>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-foreground-muted mb-1">/mo</span>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground-secondary">
                      <Check className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.name === "Free" ? <Link href="/signup"><Button variant="outline" className="w-full">Create free account</Button></Link> : <Button variant="outline" className="w-full" disabled>Billing not configured</Button>}
              </div>
            );
          })}
        </div>

        {/* Feature comparison table */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 bg-background-secondary border-b border-border">
            <h2 className="font-semibold text-foreground">Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-medium text-foreground-muted">Feature</th>
                  {pricingPlans.map((p) => (
                    <th key={p.name} className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((f, i) => (
                  <tr key={f.name} className={i % 2 === 0 ? "bg-surface" : "bg-background-secondary"}>
                    <td className="px-6 py-3 text-sm text-foreground">{f.name}</td>
                    <td className="px-6 py-3 text-center"><Cell value={f.free} /></td>
                    <td className="px-6 py-3 text-center"><Cell value={f.pro} /></td>
                    <td className="px-6 py-3 text-center"><Cell value={f.team} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ / CTA */}
        <div className="mt-12 text-center">
          <p className="text-foreground-secondary mb-4">
            Have questions? We&apos;re happy to help.
          </p>
          <Link href="/signup">
            <Button variant="primary" className="gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
