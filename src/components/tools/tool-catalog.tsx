"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/tools/favorite-button";
import type { Tool } from "@/types";

type CatalogTool = Tool & { route: string };

function getIcon(iconName: string) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<LucideIcons.LucideProps>>)[iconName];
  return Icon || LucideIcons.Box;
}

export function ToolCatalog({ catalog }: { catalog: CatalogTool[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState<Record<string, string>>({});
  useEffect(() => {
    let active = true;
    fetch("/api/v1/user/favorites")
      .then(async (response) => response.ok ? await response.json() as { data?: Array<{ id: string; toolSlug: string | null }> } : null)
      .then((result) => {
        if (!active || !result?.data) return;
        setFavorites(Object.fromEntries(result.data.filter((favorite) => favorite.toolSlug).map((favorite) => [favorite.toolSlug as string, favorite.id])));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);
  const categories = ["All", ...new Set(catalog.map((tool) => tool.category))];
  const filtered = useMemo(() => catalog.filter((tool) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(term);
    return matchesSearch && (activeCategory === "All" || tool.category === activeCategory);
  }), [catalog, search, activeCategory]);

  return (
    <>
      <div className="relative mx-auto mb-8 max-w-md"><Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" /><label htmlFor="tool-search" className="sr-only">Search tools</label><input id="tool-search" type="search" placeholder="Search tools…" value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary" /></div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">{categories.map((category) => <Button key={category} variant={activeCategory === category ? "primary" : "ghost"} size="sm" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</Button>)}</div>
      {filtered.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((tool, index) => {
        const Icon = getIcon(tool.icon);
        return <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.25) }}>
          <Card className="h-full"><CardContent className="p-6"><div className="mb-4 flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div><Badge>{tool.category}</Badge></div><h2 className="text-lg font-semibold text-foreground">{tool.name}</h2><p className="mt-1 text-sm text-foreground-secondary">{tool.description}</p><Link href={tool.route} className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">Open tool <ArrowRight className="h-4 w-4" /></Link><div className="mt-3 border-t border-border pt-2"><FavoriteButton toolSlug={tool.id} favoriteId={favorites[tool.id] ?? null} onFavoriteChange={(slug, id) => setFavorites((current) => { const next = { ...current }; if (id) next[slug] = id; else delete next[slug]; return next; })} /></div></CardContent></Card>
        </motion.div>;
      })}</div> : <div className="py-16 text-center"><SlidersHorizontal className="mx-auto mb-4 h-10 w-10 text-foreground-muted" /><h2 className="font-semibold text-foreground">No tools found</h2><p className="mt-1 text-sm text-foreground-secondary">Try another search or clear the selected category.</p><Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("All"); }}>Clear filters</Button></div>}
    </>
  );
}
