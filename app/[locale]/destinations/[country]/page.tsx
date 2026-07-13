import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Coins, Languages } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSeoPage, type CountryPayload } from "@/lib/data";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/page/page-hero";
import { Breadcrumbs } from "@/components/page/breadcrumbs";
import { FaqSection } from "@/components/page/faq-section";
import { SectionHeading, Prose } from "@/components/page/prose";
import { RegionCard } from "@/components/site/cards";
import { PlanCta } from "@/components/site/plan-cta";
import { JsonLd } from "@/components/site/json-ld";

export const revalidate = 3600;
export const dynamicParams = true;

// pSEO catalogue pages render on-demand and cache via ISR, so the page count
// scales to thousands without a build-time render of every slug. First hit
// renders + caches; revalidate keeps it fresh.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; country: string }> }): Promise<Metadata> {
  const { locale, country } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const page = await getSeoPage<CountryPayload>("country", country, loc);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: page.path, locale: loc, imageKey: page.imageKey });
}

export default async function CountryPage({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale, country } = await params;
  if (!isLocale(locale)) notFound();
  const page = await getSeoPage<CountryPayload>("country", country, locale);
  if (!page) notFound();
  const dict = getDictionary(locale);
  const p = page.payload;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: dict.nav.home, path: "/" }, { name: p.name, path: page.path }], locale)} />
      <JsonLd data={faqJsonLd(p.faqs)} />

      <PageHero
        imageKey={page.imageKey}
        kicker={p.heroKicker}
        title={p.heroTitle}
        meta={
          <>
            <span className="pill glass-chip text-foreground"><Calendar size={13} /> {p.bestTime}</span>
            <span className="pill glass-chip text-foreground"><Coins size={13} /> {p.currency}</span>
            <span className="pill glass-chip text-foreground"><Languages size={13} /> {p.languages}</span>
          </>
        }
      />

      <Breadcrumbs locale={locale as Locale} items={[{ name: dict.nav.home, path: "/" }, { name: p.name }]} />

      <section className="mx-auto max-w-3xl px-5 py-14">
        <Prose text={p.intro} className="text-[17px]" />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-4">
        <SectionHeading eyebrow={dict.common.highlights} title={dict.home.regionsTitle} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {p.highlights.map((h) => (
            <div key={h.title} className="stat-card">
              <h3 className="serif text-[1.2rem] font-semibold tracking-[-0.01em]">{h.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <SectionHeading eyebrow={dict.home.regionsEyebrow} title={dict.nav.regions} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.regions.map((r) => (
            <RegionCard
              key={r.slug}
              locale={locale as Locale}
              region={{ slug: r.slug, display_name: r.displayName, tagline: r.tagline ?? "", image_key: r.imageKey }}
              common={dict.common}
            />
          ))}
        </div>
      </section>

      <FaqSection title={dict.common.faqTitle} faqs={p.faqs} />
      <PlanCta locale={locale as Locale} dict={dict} imageKey="jemaa-el-fnaa" />
    </>
  );
}
