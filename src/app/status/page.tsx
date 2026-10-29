import type { Metadata } from "next";
import { Activity, CircleHelp, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Service Status",
  description: "Current implementation status of Nexora demo services.",
};

const components = [
  { name: "Nexora website", state: "Running in this deployment", detail: "Availability monitoring is not configured." },
  { name: "Browser-based utilities", state: "Available", detail: "Selected tools run locally in your browser." },
  { name: "Application catalog", state: "Preview", detail: "Application detail pages are illustrative and do not launch external services." },
  { name: "Public API, accounts, AI, and billing", state: "Not configured", detail: "These integrations are not available in this demo." },
];

export default function StatusPage() {
  return (
    <div className="min-h-[65vh] py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground-muted"><Activity className="h-3.5 w-3.5" /> Product status</div>
          <h1 className="text-4xl font-bold text-foreground">Nexora service status</h1>
          <p className="mt-3 text-foreground-secondary">This page describes the demo&apos;s implementation state. It is not a live uptime monitor.</p>
        </div>
        <div className="mb-6 flex gap-3 rounded-xl border border-info/30 bg-info/5 p-4">
          <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-info" />
          <p className="text-sm text-foreground-secondary">No external status provider, historical incident feed, or availability measurements are connected, so no uptime figures are published.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          {components.map((component, index) => (
            <div key={component.name} className={`flex flex-col gap-3 bg-surface p-5 sm:flex-row sm:items-center ${index ? "border-t border-border" : ""}`}>
              <Wrench className="hidden h-5 w-5 shrink-0 text-foreground-muted sm:block" />
              <div className="flex-1"><p className="font-medium text-foreground">{component.name}</p><p className="mt-1 text-sm text-foreground-muted">{component.detail}</p></div>
              <Badge variant={component.state === "Available" ? "success" : "default"}>{component.state}</Badge>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-foreground-muted">No support channel is configured for this preview.</p>
      </div>
    </div>
  );
}
