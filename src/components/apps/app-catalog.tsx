"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { App } from "@/types";

type CatalogApp = App & { slug: string };

export function AppCatalog({ applications }: { applications: CatalogApp[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("name");
  const categories = ["All", ...new Set(applications.map((app) => app.category))];
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = applications.filter((app) =>
      (category === "All" || app.category === category) &&
      (!term || `${app.name} ${app.description} ${app.category}`.toLowerCase().includes(term)),
    );
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "newest") result.reverse();
    return result;
  }, [applications, category, search, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <label className="relative flex-1"><span className="sr-only">Search applications</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search published applications" className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" /></label>
        <label className="flex items-center gap-2 text-sm text-foreground-muted"><SlidersHorizontal className="h-4 w-4" /><span className="sr-only">Sort applications</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"><option value="name">Name A–Z</option><option value="newest">Recently added</option></select></label>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${category === item ? "border-primary bg-primary text-white" : "border-border text-foreground-secondary hover:border-primary/50"}`}>{item}</button>)}</div>
      {!filtered.length ? <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center"><p className="font-medium text-foreground">No published applications yet</p><p className="mt-2 text-sm text-foreground-secondary">Application previews are not listed as live services. Check back when a real destination is published.</p>{(search || category !== "All") && <button className="mt-4 text-sm text-primary hover:underline" onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</button>}</div> : <><p className="mb-4 text-sm text-foreground-muted">{filtered.length} published application{filtered.length === 1 ? "" : "s"}</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((app) => {
        const Icon = (Icons as unknown as Record<string, React.ComponentType<Icons.LucideProps>>)[app.icon] || Icons.LayoutGrid;
        return <Link key={app.id} href={`/apps/${app.slug}`} className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:border-primary/30 hover:shadow-md"><div className="mb-4 flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span><Badge variant="outline">{app.category}</Badge></div><h2 className="font-semibold text-foreground group-hover:text-primary">{app.name}</h2><p className="mt-1 text-sm text-foreground-secondary">{app.description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">View details <ArrowRight className="h-4 w-4" /></span></Link>;
      })}</div></>}
    </div>
  );
}
