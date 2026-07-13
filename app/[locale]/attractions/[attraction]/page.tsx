import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSeoPage, type AttractionPayload } from "@/lib/data";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, attractionJsonLd, absoluteUrl } from "@/lib/seo";
import { PageHero } from "@/components/page/page-hero";
import { Breadcrumbs } from "@/components/page/breadcrumbs";
import { FaqSection } from "@/components/page/faq-section";
import { SectionHeading, Prose } from "@/components/page/prose";
import { AttractionCard } from "@/components/site/cards";
import { PlanCta } from "@/components/site/plan-cta";
import { JsonLd } from "@/components/site/json-ld";

export const revalidate = 3600;
export const dynamicParams = true;

// On-demand ISR — pSEO pages render + cache on first hit.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; attraction: string }> }): Promise<Metadata> {
  const { locale, attraction } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const page = await getSeoPage<AttractionPayload>("attraction", attraction, loc);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: page.path, locale: loc, imageKey: page.imageKey, type: "article" });
}

export default async function AttractionPage({ params }: { params: Promise<{ locale: string; attraction: string }> }) {
  const { locale, attraction } = await params;
  if (!isLocale(locale)) notFound();
  const page = await getSeoPage<AttractionPayload>("attraction", attraction, locale);
  if (!page) notFound();
  const dict = getDictionary(locale);
  const p = page.payload;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.home, path: "/" },
            { name: p.region.displayName, path: `/regions/${p.region.slug}` },
            { name: p.name, path: page.path },
          ],
          locale,
        )}
      />
      <JsonLd
        data={attractionJsonLd({
          name: p.name,
          description: p.shortDescription,
          imageKey: page.imageKey,
          lat: p.lat,
          lng: p.lng,
          url: absoluteUrl(locale, page.path),
        })}
      />
      <JsonLd data={faqJsonLd(p.faqs)} />

      <PageHero
        imageKey={page.imageKey}
        kicker={`${p.category} · ${p.region.displayName}`}
        title={p.name}
        subtitle={p.shortDescription}
      />

      <Breadcrumbs
        locale={locale as Locale}
        items={[
          { name: dict.nav.home, path: "/" },
          { name: p.region.displayName, path: `/regions/${p.region.slug}` },
          { name: p.name },
        ]}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Prose text={p.body} className="text-[17px]" />
        </div>
        <aside className="lg:pl-4">
          <div className="panel sticky top-24 p-6">
            <p className="eyebrow mb-4">{dict.common.practicalInfo}</p>
            <dl className="space-y-3.5">
              {p.practical.map((kv) => (
                <div key={kv.label} className="flex flex-col gap-0.5 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">{kv.label}</dt>
                  <dd className="text-sm text-foreground">{kv.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>

      {p.nearby.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-6">
          <SectionHeading eyebrow={dict.common.nearby} title={p.region.displayName} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {p.nearby.slice(0, 4).map((a) => (
              <AttractionCard
                key={a.slug}
                locale={locale as Locale}
                attraction={{ slug: a.slug, name: a.name, category: a.category, imageKey: a.imageKey }}
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
