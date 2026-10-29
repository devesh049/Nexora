import type { Metadata } from "next";
import { connection } from "next/server";
import { ToolCatalog } from "@/components/tools/tool-catalog";
import { query } from "@/lib/server/db";
import type { Tool } from "@/types";

export const metadata: Metadata = {
  title: "Online Tools",
  description: "Free browser-based productivity and developer tools on Nexora.",
};

export const instant = false;

type CatalogRecord = { id: string; slug: string; name: string; description: string; icon: string | null; category: string; route: string };

export default async function ToolsPage() {
  await connection();
  let catalog: Array<Tool & { route: string }> = [];
  let unavailable = false;
  try {
    const result = await query<CatalogRecord>(
      'SELECT "id", "slug", "name", "description", "icon", "category", "route" FROM "ToolCatalogItem" WHERE "status" = \'PUBLISHED\' ORDER BY "name" ASC LIMIT 100',
    );
    catalog = result.rows.map((tool) => ({
      id: tool.slug,
      name: tool.name,
      description: tool.description,
      icon: tool.icon ?? "Wrench",
      category: tool.category,
      href: tool.route,
      route: tool.route,
    }));
  } catch {
    unavailable = true;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Browser-based utilities</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Online Tools</h1>
        <p className="mx-auto mt-2 max-w-lg text-foreground-secondary">Published tools run on your device. Tool inputs are not sent to Nexora servers.</p>
      </header>
      {unavailable ? <p role="alert" className="mx-auto max-w-2xl rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-foreground-secondary">Tool catalog unavailable. Set DATABASE_URL and apply the database migration; the existing utility pages remain directly accessible.</p> : <ToolCatalog catalog={catalog} />}
    </div>
  );
}
