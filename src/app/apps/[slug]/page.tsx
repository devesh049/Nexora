import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, ArrowUpRight, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { query } from "@/lib/server/db";

export const instant = false;

interface AppRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string | null;
  destination: string | null;
  requiredPlan: "FREE" | "PRO" | "TEAM";
  createdAt: Date;
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPublishedApp(slug: string): Promise<AppRecord | null> {
  const result = await query<AppRecord>(
    'SELECT "id", "name", "slug", "description", "category", "icon", "destination", "requiredPlan", "createdAt" FROM "Application" WHERE "slug" = $1 AND "status" = \'PUBLISHED\' AND "visibility" = \'PUBLIC\' LIMIT 1',
    [slug],
  );
  return result.rows[0] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  try {
    const app = await getPublishedApp(slug);
    return app ? { title: app.name, description: app.description } : { title: "Application not found" };
  } catch {
    return { title: "Application catalog unavailable" };
  }
}

export default async function AppDetailPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  let app: AppRecord | null;
  try { app = await getPublishedApp(slug); } catch {
    return <div className="mx-auto max-w-3xl px-4 py-16"><h1 className="text-3xl font-bold text-foreground">Catalog unavailable</h1><p className="mt-3 text-foreground-secondary">Configure PostgreSQL and apply migrations to view published application details.</p><Link className="mt-5 inline-block text-primary hover:underline" href="/apps">Back to applications</Link></div>;
  }
  if (!app) notFound();

  let destination: URL | null = null;
  if (app.destination) {
    try {
      const candidate = new URL(app.destination);
      if (candidate.protocol === "https:" || candidate.protocol === "http:") destination = candidate;
    } catch { destination = null; }
  }

  return (
    <div className="min-h-[65vh] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/apps" className="mb-8 inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary"><ArrowLeft className="h-4 w-4" />Back to Applications</Link>
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LayoutGrid className="h-8 w-8" /></span>
          <div className="flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><h1 className="text-3xl font-bold text-foreground">{app.name}</h1><Badge variant="success">Published</Badge></div><p className="text-foreground-secondary">{app.description}</p><div className="mt-3 flex flex-wrap gap-2"><Badge variant="outline">{app.category}</Badge><Badge variant="secondary">{app.requiredPlan}</Badge></div></div>
        </header>
        <section className="rounded-2xl border border-border bg-surface p-6"><h2 className="font-semibold text-foreground">Launch application</h2><p className="mt-2 text-sm text-foreground-secondary">{destination ? "This application has a configured destination." : "This catalog entry has no launch destination configured yet."}</p>{destination && app.requiredPlan === "FREE" ? <a href={destination.toString()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex"><Button variant="primary" className="gap-2">Open application<ArrowUpRight className="h-4 w-4" /></Button></a> : <Button disabled className="mt-5">{app.requiredPlan === "FREE" ? "Not available yet" : "Paid plan integration unavailable"}</Button>}</section>
        <dl className="mt-6 grid gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2"><div><dt className="text-xs uppercase tracking-wide text-foreground-muted">Category</dt><dd className="mt-1 text-sm text-foreground">{app.category}</dd></div><div><dt className="text-xs uppercase tracking-wide text-foreground-muted">Plan</dt><dd className="mt-1 text-sm text-foreground">{app.requiredPlan}</dd></div><div><dt className="text-xs uppercase tracking-wide text-foreground-muted">Published</dt><dd className="mt-1 text-sm text-foreground">{app.createdAt.toLocaleDateString()}</dd></div></dl>
      </div>
    </div>
  );
}
