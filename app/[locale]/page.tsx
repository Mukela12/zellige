import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLandingData } from "@/lib/data";
import { buildMetadata, SITE_NAME, websiteJsonLd } from "@/lib/seo";
import { imageSrc, BLUR } from "@/lib/images";
import { RegionCard, ItineraryCard, AttractionCard } from "@/components/site/cards";
import { SectionHeading, Prose } from "@/components/page/prose";
import { PlanCta } from "@/components/site/plan-cta";
import { JsonLd } from "@/components/site/json-ld";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  return buildMetadata({
    title: `${SITE_NAME} — Morocco travel, arranged with care`,
    description:
      "Small-group and tailor-made journeys across Morocco. Explore regions, itineraries and places, then plan your trip in four short steps.",
    path: "/",
    locale: loc,
    imageKey: "morocco",
  });
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { country, regions, itineraries, attractions } = await getLandingData();
  const l = (p: string) => `/${locale}${p}`;

  return (
    <>
      <JsonLd data={websiteJsonLd()} />

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[78vh] min-h-[520px] w-full">
          <Image src={imageSrc("morocco")} alt="Morocco" fill priority sizes="100vw" placeholder="blur" blurDataURL={BLUR} className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,10,0.42)_0%,rgba(20,16,10,0.18)_35%,rgba(20,16,10,0.78)_100%)]" />
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-5 pb-12 sm:pb-16">
            <p className="eyebrow mb-4" style={{ color: "hsl(40 40% 90%)" }}>{dict.home.heroKicker}</p>
            <h1 className="max-w-3xl text-balance serif text-[2.7rem] font-semibold leading-[1.03] tracking-[-0.02em] text-[hsl(40_40%_96%)] sm:text-[4rem]">
              {country.hero_title}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed sm:text-lg" style={{ color: "hsl(40 25% 87%)" }}>
              {country.hero_kicker}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={l("/plan")} className="btn btn--primary btn--lg">
                {dict.home.heroCtaPrimary} <ArrowRight size={17} />
              </Link>
              <Link href={l("/itineraries")} className="btn btn--lg glass-chip text-[hsl(40_40%_96%)]">
                {dict.home.heroCtaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intro + highlights ── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-3">{dict.home.introEyebrow}</p>
            <Prose text={country.intro} className="text-[17px]" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(country.highlights as { title: string; body: string }[]).map((h) => (
              <div key={h.title} className="stat-card">
                <h3 className="serif text-[1.15rem] font-semibold tracking-[-0.01em]">{h.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Regions ── */}
      <section className="mx-auto max-w-6xl px-5 pb-4">
        <SectionHeading eyebrow={dict.home.regionsEyebrow} title={dict.home.regionsTitle} subtitle={dict.home.regionsSubtitle} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <RegionCard key={r.slug} locale={locale as Locale} region={r} common={dict.common} />
          ))}
        </div>
      </section>

      {/* ── Itineraries ── */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow={dict.home.itinerariesEyebrow} title={dict.home.itinerariesTitle} subtitle={dict.home.itinerariesSubtitle} />
          <Link href={l("/itineraries")} className="btn btn--ghost btn--sm hidden shrink-0 sm:inline-flex">
            {dict.common.explore} <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {itineraries.slice(0, 3).map((it) => (
            <ItineraryCard key={it.slug} locale={locale as Locale} itinerary={it} common={dict.common} />
          ))}
        </div>
      </section>

      {/* ── Attractions ── */}
      <section className="mx-auto max-w-6xl px-5 pb-8">
        <SectionHeading eyebrow={dict.home.attractionsEyebrow} title={dict.home.attractionsTitle} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {attractions.map((a) => (
            <AttractionCard key={a.slug} locale={locale as Locale} attraction={a} />
          ))}
        </div>
      </section>

      <PlanCta locale={locale as Locale} dict={dict} imageKey="riad-courtyard" />
    </>
  );
}
