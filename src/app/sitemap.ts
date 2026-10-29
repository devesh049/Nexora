import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/apps", "/tools", "/developers", "/docs", "/pricing", "/about", "/contact", "/status"];
  return staticPaths.map((path) => ({ url: `${siteConfig.url}${path}`, changeFrequency: "weekly" as const, priority: path ? 0.7 : 1 }));
}
