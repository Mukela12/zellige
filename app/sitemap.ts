import type { MetadataRoute } from "next";
import { getAllSeoPages } from "@/lib/data";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getAllSeoPages();

  const staticPaths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/regions", priority: 0.7 },
    { path: "/itineraries", priority: 0.7 },
    { path: "/plan", priority: 0.6 },
  ];

  const dynamicPaths = pages.map((p) => ({
    path: p.path,
    lastModified: p.updated_at,
    priority: p.page_type === "country" ? 0.9 : 0.8,
  }));

  const all = [
    ...staticPaths.map((s) => ({ ...s, lastModified: new Date() })),
    ...dynamicPaths,
  ];

  const abs = (locale: string, path: string) => `${SITE_URL}/${locale}${path === "/" ? "" : path}`;

  return all.map((entry) => ({
    url: abs(defaultLocale, entry.path),
    lastModified: entry.lastModified,
    changeFrequency: "weekly" as const,
    priority: entry.priority,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, abs(l, entry.path)])),
    },
  }));
}
