import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight, MapPin } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSeoPage, type ItineraryPayload } from "@/lib/data";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd, tripJsonLd, absoluteUrl } from "@/lib/seo";
import { PageHero } from "@/components/page/page-hero";
import { Breadcrumbs } from "@/components/page/breadcrumbs";
import { FaqSection } from "@/components/page/faq-section";
import { Prose } from "@/components/page/prose";
import { JsonLd } from "@/components/site/json-ld";
import { formatUsd } from "@/lib/utils";

export const revalidate = 3600;
export const dynamicParams = true;

// On-demand ISR — pSEO pages render + cache on first hit.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; itinerary: string }> }): Promise<Metadata> {
  const { locale, itinerary } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const page = await getSeoPage<ItineraryPayload>("itinerary", itinerary, loc);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: page.path, locale: loc, imageKey: page.imageKey, type: "article" });
}

export default async function ItineraryPage({ params }: { params: Promise<{ locale: string; itinerary: string }> }) {
  const { locale, itinerary } = await params;
  if (!isLocale(locale)) notFound();
  const page = await getSeoPage<ItineraryPayload>("itinerary", itinerary, locale);
  if (!page) notFound();
  const dict = getDictionary(locale);
  const p = page.payload;
  const planHref = `/${locale}/plan?itinerary=${page.slug}`;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: dict.nav.home, path: "/" },
            { name: dict.nav.itineraries, path: "/itineraries" },
            { name: p.title, path: page.path },
          ],
          locale,
        )}
      />
      <JsonLd
        data={tripJsonLd({
          name: p.title,
          description: p.subtitle,
          imageKey: page.imageKey,
          url: absoluteUrl(locale, page.path),
          priceFromUsd: p.priceFromUsd,
          regionNames: p.regions.map((r) => r.displayName),
        })}
      />
      <JsonLd data={faqJsonLd(p.faqs)} />

      <PageHero
        imageKey={page.imageKey}
        kicker={`${p.durationDays} ${dict.common.days} · ${p.regions.length} ${dict.nav.regions.toLowerCase()}`}
        title={p.title}
        subtitle={p.subtitle}
        meta={
          <>
            <span className="pill glass-chip text-foreground">
              {dict.common.from} {formatUsd(p.priceFromUsd)} {dict.common.perPerson}
            </span>
          </>
        }
      />

      <Breadcrumbs
        locale={locale as Locale}
        items={[{ name: dict.nav.home, path: "/" }, { name: dict.nav.itineraries, path: "/itineraries" }, { name: p.title }]}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <Prose text={p.summary} className="text-[17px]" />

          {/* regions passed through */}
          {p.regions.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {p.regions.map((r) => (
                <Link key={r.slug} href={`/${locale}/regions/${r.slug}`} className="pill pill--accent hover:opacity-80">
                  <MapPin size={12} /> {r.displayName}
                </Link>
              ))}
            </div>
          )}

          {/* day-by-day timeline */}
          <h2 className="serif mt-12 text-[1.9rem] font-semibold tracking-[-0.02em]">{dict.common.dayByDay}</h2>
          <ol className="mt-6 space-y-6 border-l border-border pl-6">
            {p.days.map((d) => (
              <li key={d.day} className="relative">
                <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-primary/12 font-mono text-[11px] font-semibold text-primary">
                  {d.day}
                </span>
                <h3 className="serif text-[1.25rem] font-semibold tracking-[-0.01em]">{d.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{d.body}</p>
                {d.attractions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {d.attractions.map((a) => (
                      <Link key={a.slug} href={`/${locale}/attractions/${a.slug}`} className="pill pill--outline hover:border-primary/40 hover:text-primary">
                        {a.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* sticky booking rail */}
        <aside>
          <div className="panel sticky top-24 p-6">
            <p className="text-xs text-muted-foreground">{dict.common.from}</p>
            <p className="stat-num serif text-[2.2rem] font-semibold leading-none tracking-[-0.02em]">{formatUsd(p.priceFromUsd)}</p>
            <p className="text-xs text-muted-foreground">{dict.common.perPerson}</p>

            <Link href={planHref} className="btn btn--primary mt-5 w-full">
              {dict.common.planTrip} <ArrowRight size={16} />
            </Link>

            <div className="mt-6">
              <p className="eyebrow mb-3">{dict.common.whatsIncluded}</p>
              <ul className="space-y-2.5">
                {p.includes.map((inc) => (
                  <li key={inc} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check size={16} className="mt-0.5 shrink-0 text-success" />
                    <span className="leading-snug">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </section>

      <FaqSection title={dict.common.faqTitle} faqs={p.faqs} />
    </>
  );
}
