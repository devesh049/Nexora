import type { Metadata } from "next";
import { connection } from "next/server";
import { AppCatalog } from "@/components/apps/app-catalog";
import { query } from "@/lib/server/db";
import type { App } from "@/types";

export const metadata: Metadata = {
  title: "Applications",
  description: "Discover published Nexora applications.",
};

export const instant = false;

type CatalogRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string | null;
  destination: string | null;
  requiredPlan: "FREE" | "PRO" | "TEAM";
};

export default async function AppsPage() {
  await connection();
  let applications: Array<App & { slug: string }> = [];
  let unavailable = false;
  try {
    const result = await query<CatalogRecord>(
      'SELECT "id", "name", "slug", "description", "category", "icon", "destination", "requiredPlan" FROM "Application" WHERE "status" = \'PUBLISHED\' AND "visibility" = \'PUBLIC\' ORDER BY "name" ASC LIMIT 100',
    );
    applications = result.rows.map((app) => ({
      id: app.id,
      slug: app.slug,
      name: app.name,
      description: app.description,
      category: app.category,
      icon: app.icon ?? "LayoutGrid",
      href: `/apps/${app.slug}`,
      status: "available",
      plan: app.requiredPlan.toLowerCase() as App["plan"],
    }));
  } catch {
    unavailable = true;
  }

  return (
    <div className="min-h-[65vh] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Discover</p><h1 className="mt-2 text-4xl font-bold text-foreground">Applications</h1><p className="mt-2 text-foreground-secondary">Applications are loaded from the published catalog. Only real, public database entries appear here.</p></div>
        {unavailable ? <p role="alert" className="mb-6 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-foreground-secondary">The application catalog is unavailable. Configure DATABASE_URL and apply the database migration.</p> : <AppCatalog applications={applications} />}
      </div>
    </div>
  );
}
