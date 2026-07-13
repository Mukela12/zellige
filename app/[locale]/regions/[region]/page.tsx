import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSeoPage, type RegionPayload } from "@/lib/data";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/page/page-hero";
import { Breadcrumbs } from "@/components/page/breadcrumbs";
import { FaqSection } from "@/components/page/faq-section";
import { SectionHeading, Prose } from "@/components/page/prose";
import { AttractionCard, ItineraryCard } from "@/components/site/cards";
import { PlanCta } from "@/components/site/plan-cta";
import { JsonLd } from "@/components/site/json-ld";

export const revalidate = 3600;
export const dynamicParams = true;

// On-demand ISR — pSEO pages render + cache on first hit.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; region: string }> }): Promise<Metadata> {
  const { locale, region } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const page = await getSeoPage<RegionPayload>("region", region, loc);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: page.path, locale: loc, imageKey: page.imageKey });
}

export default async function RegionPage({ params }: { params: Promise<{ locale: string; region: string }> }) {
  const { locale, region } = await params;
  if (!isLocale(locale)) notFound();
  const page = await getSeoPage<RegionPayload>("region", region, locale);
  if (!page) notFound();
  const dict = getDictionary(locale);
  const p = page.payload;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.home, path: "/" },
            { name: dict.nav.regions, path: "/regions" },
            { name: p.displayName, path: page.path },
          ],
          locale,
        )}
      />
      <JsonLd data={faqJsonLd(p.faqs)} />

      <PageHero
        imageKey={page.imageKey}
        kicker={p.country.name}
        title={p.displayName}
        subtitle={p.tagline}
        meta={p.knownFor.slice(0, 4).map((k) => (
          <span key={k} className="pill glass-chip text-foreground">{k}</span>
        ))}
      />

      <Breadcrumbs
        locale={locale as Locale}
        items={[{ name: dict.nav.home, path: "/" }, { name: dict.nav.regions, path: "/regions" }, { name: p.displayName }]}
      />

      <section className="mx-auto max-w-3xl px-5 py-14">
        <Prose text={p.intro} className="text-[17px]" />
        {p.knownFor?.length > 0 && (
          <div className="mt-8">
            <p className="eyebrow mb-3">{dict.common.knownFor}</p>
            <div className="flex flex-wrap gap-2">
              {p.knownFor.map((k) => (
                <span key={k} className="pill pill--accent">{k}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {p.attractions.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-6">
          <SectionHeading eyebrow={dict.common.inThisRegion} title={dict.nav.attractions} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {p.attractions.map((a) => (
              <AttractionCard
                key={a.slug}
                locale={locale as Locale}
                attraction={{ slug: a.slug, name: a.name, category: a.category, shortDescription: a.shortDescription, imageKey: a.imageKey }}
              />
            ))}
          </div>
        </section>
      )}

      {p.itineraries.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-14">
          <SectionHeading eyebrow={dict.common.relatedItineraries} title={dict.nav.itineraries} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {p.itineraries.map((it) => (
              <ItineraryCard
                key={it.slug}
                locale={locale as Locale}
                itinerary={{ slug: it.slug, title: it.title, subtitle: "", duration_days: it.durationDays, price_from_usd: it.priceFromUsd, image_key: it.imageKey }}
                common={dict.common}
              />
            ))}
          </div>
        </section>
      )}

      <FaqSection title={dict.common.faqTitle} faqs={p.faqs} />
      <PlanCta locale={locale as Locale} dict={dict} imageKey={page.imageKey} />
    </>
  );
}
