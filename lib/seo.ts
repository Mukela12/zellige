import type { Metadata } from "next";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { imageSrc } from "@/lib/images";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Zellige";

/** locale-prefixed path, e.g. localizedPath("fr", "/regions/x") -> /fr/regions/x */
export function localizedPath(locale: string, path: string): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

export function absoluteUrl(locale: string, path: string): string {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}

/**
 * Canonical (self-referential for the current locale) + hreflang alternates
 * for every routable locale + an x-default pointing at the English fallback.
 */
export function buildAlternates(path: string, locale: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localizedPath(l, path);
  languages["x-default"] = localizedPath(defaultLocale, path);
  return { canonical: localizedPath(locale, path), languages };
}

export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  locale: string;
  imageKey?: string | null;
  type?: "website" | "article";
}): Metadata {
  const { title, description, path, locale, imageKey, type = "website" } = opts;
  const image = imageSrc(imageKey);
  return {
    metadataBase: new URL(SITE_URL),
    // absolute: keep the exact SEO title (no brand-template suffix that could
    // push a tuned pSEO title past ~60 chars).
    title: { absolute: title },
    description,
    alternates: buildAlternates(path, locale),
    openGraph: {
      title,
      description,
      url: localizedPath(locale, path),
      siteName: SITE_NAME,
      type,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [{ url: image, width: 1600, height: 1067, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

// ── JSON-LD builders (rendered via <JsonLd/>) ──────────────────────────
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(locale, it.path),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function attractionJsonLd(opts: {
  name: string; description: string; imageKey: string; lat: number; lng: number; url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: opts.name,
    description: opts.description,
    image: `${SITE_URL}${imageSrc(opts.imageKey)}`,
    url: opts.url,
    geo: { "@type": "GeoCoordinates", latitude: opts.lat, longitude: opts.lng },
    address: { "@type": "PostalAddress", addressCountry: "MA" },
  };
}

export function tripJsonLd(opts: {
  name: string; description: string; imageKey: string; url: string; priceFromUsd: number; regionNames: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: opts.name,
    description: opts.description,
    image: `${SITE_URL}${imageSrc(opts.imageKey)}`,
    url: opts.url,
    touristType: "Leisure travellers",
    itinerary: {
      "@type": "ItemList",
      itemListElement: opts.regionNames.map((n, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "TouristDestination", name: n },
      })),
    },
    offers: { "@type": "Offer", price: opts.priceFromUsd, priceCurrency: "USD", availability: "https://schema.org/InStock" },
  };
}
