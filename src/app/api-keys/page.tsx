import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "API Keys",
  description: "API key management is not yet available in the Nexora demo.",
};

export default function ApiKeysPage() {
  return (
    <div className="min-h-[60vh] py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><KeyRound className="h-6 w-6 text-primary" /></div>
          <div><h1 className="text-3xl font-bold text-foreground">API Keys</h1><p className="mt-1 text-foreground-secondary">Manage credentials for your integrations.</p></div>
        </div>

        <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div><p className="font-medium text-foreground">Not available in this demo</p><p className="mt-1 text-sm text-foreground-secondary">Nexora has no authentication or API backend configured. No keys can be created or used here, and no placeholder credentials are displayed.</p></div>
        </div>

        <div className="mt-5 flex gap-3 rounded-xl border border-border bg-surface p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-foreground-secondary">Production key management requires authenticated server-side key generation, hashed storage, permission enforcement, revocation, and rate limiting. These controls are not implemented yet.</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/docs"><Button variant="primary" className="gap-2">Read API status <ArrowRight className="h-4 w-4" /></Button></Link>
          <Link href="/developers"><Button variant="outline">Developer portal</Button></Link>
        </div>
      </div>
    </div>
  );
}
