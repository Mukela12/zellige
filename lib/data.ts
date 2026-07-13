import "server-only";
import { cache } from "react";
import { sql } from "@/db";

export type PageType = "country" | "region" | "attraction" | "itinerary";

export interface FAQ { q: string; a: string }
export interface KV { label: string; value: string }
export interface RegionRef { slug: string; name: string; displayName: string; tagline?: string; imageKey: string }
export interface AttractionRef { slug: string; name: string; category: string; shortDescription?: string; imageKey: string }
export interface ItineraryRef { slug: string; title: string; durationDays: number; priceFromUsd: number; imageKey: string }

export interface CountryPayload {
  name: string; heroTitle: string; heroKicker: string; intro: string;
  bestTime: string; currency: string; languages: string;
  highlights: { title: string; body: string }[]; faqs: FAQ[]; regions: RegionRef[];
}
export interface RegionPayload {
  name: string; displayName: string; tagline: string; intro: string;
  lat: number; lng: number; knownFor: string[]; faqs: FAQ[];
  country: { slug: string; name: string };
  attractions: AttractionRef[]; itineraries: ItineraryRef[];
}
export interface AttractionPayload {
  name: string; category: string; shortDescription: string; body: string;
  lat: number; lng: number; practical: KV[]; faqs: FAQ[];
  region: { slug: string; name: string; displayName: string };
  nearby: AttractionRef[];
}
export interface ItineraryDay { day: number; title: string; body: string; attractions: AttractionRef[] }
export interface ItineraryPayload {
  title: string; subtitle: string; summary: string; durationDays: number;
  priceFromUsd: number; includes: string[]; faqs: FAQ[];
  regions: RegionRef[]; days: ItineraryDay[];
}

export interface SeoPage<P = unknown> {
  pageType: PageType;
  slug: string;
  locale: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroKicker: string;
  imageKey: string;
  updatedAt: Date;
  payload: P;
}

/**
 * Read a complete landing-page payload from vw_seo_landing_pages in a SINGLE
 * indexed query. The whole page tree (parent + child collections) arrives as
 * jsonb on the row, so there is no per-child round-trip and no N+1.
 *
 * Locale resolution + English fallback happen in SQL: we match the requested
 * locale OR 'en' and order so a real localized row wins, else fall back to
 * English. Wrapped in React cache() so generateMetadata and the page component
 * share one query per request.
 */
export const getSeoPage = cache(
  async <P = unknown>(pageType: PageType, slug: string, locale: string): Promise<SeoPage<P> | null> => {
    const rows = await sql`
      SELECT page_type, slug, path, meta_title, meta_description,
             h1, hero_kicker, image_key, updated_at, payload
      FROM vw_seo_landing_pages
      WHERE page_type = ${pageType}
        AND slug = ${slug}
        AND locale IN (${locale}, 'en')
      ORDER BY (locale = ${locale}) DESC
      LIMIT 1`;
    if (!rows.length) return null;
    const r = rows[0];
    return {
      pageType: r.page_type,
      slug: r.slug,
      locale, // requested locale, for URL/hreflang building; content may be the en fallback
      path: r.path,
      metaTitle: r.meta_title,
      metaDescription: r.meta_description,
      h1: r.h1,
      heroKicker: r.hero_kicker,
      imageKey: r.image_key,
      updatedAt: r.updated_at,
      payload: r.payload as P,
    };
  },
);

// Every publishable page — powers sitemap.xml.
export const getAllSeoPages = cache(async () => {
  const rows = await sql<{ page_type: PageType; slug: string; path: string; updated_at: Date }[]>`
    SELECT page_type, slug, path, updated_at FROM vw_seo_landing_pages ORDER BY page_type, slug`;
  return rows;
});

export type RegionListItem = { slug: string; display_name: string; tagline: string; image_key: string; place_count: number };
export type ItineraryListItem = { slug: string; title: string; subtitle: string; duration_days: number; price_from_usd: number; image_key: string };
export type AttractionListItem = { slug: string; name: string; category: string; short_description: string; image_key: string };
export type CountryRow = {
  slug: string; name: string; hero_title: string; hero_kicker: string; intro: string;
  best_time: string; currency: string; languages: string; image_key: string;
  highlights: { title: string; body: string }[];
};

// Landing-page data. Queries run sequentially (never Promise.all on the
// low-max pool) and each is a single flat read.
export const getLandingData = cache(async () => {
  const country = (
    await sql<CountryRow[]>`SELECT slug, name, hero_title, hero_kicker, intro, best_time, currency, languages, image_key, highlights
              FROM countries WHERE slug = 'morocco' LIMIT 1`
  )[0];
  const regions = await sql<RegionListItem[]>`
    SELECT r.slug, r.display_name, r.tagline, r.image_key,
           (SELECT count(*)::int FROM attractions a WHERE a.region_id = r.id AND a.published) AS place_count
    FROM regions r WHERE r.published ORDER BY r.name`;
  const itineraries = await sql<ItineraryListItem[]>`
    SELECT slug, title, subtitle, duration_days, price_from_usd, image_key
    FROM itineraries WHERE published ORDER BY duration_days`;
  const attractions = await sql<AttractionListItem[]>`
    SELECT slug, name, category, short_description, image_key
    FROM attractions WHERE published ORDER BY name LIMIT 6`;
  return { country, regions, itineraries, attractions };
});

export const listRegions = cache(async () => {
  return sql<RegionListItem[]>`SELECT r.slug, r.display_name, r.tagline, r.image_key,
              (SELECT count(*)::int FROM attractions a WHERE a.region_id = r.id AND a.published) AS place_count
             FROM regions r WHERE r.published ORDER BY r.name`;
});

export const listItineraries = cache(async () => {
  return sql<ItineraryListItem[]>`SELECT slug, title, subtitle, duration_days, price_from_usd, image_key
             FROM itineraries WHERE published ORDER BY duration_days`;
});

// Enabled locales -> hreflang set + language switcher.
export const getEnabledLocales = cache(async () => {
  return sql<{ code: string; name: string; english_name: string; is_default: boolean }[]>`
    SELECT code, name, english_name, is_default FROM locales WHERE enabled ORDER BY sort_order`;
});
