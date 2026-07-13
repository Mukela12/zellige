import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { listItineraries } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/page/breadcrumbs";
import { SectionHeading } from "@/components/page/prose";
import { ItineraryCard } from "@/components/site/cards";
import { PlanCta } from "@/components/site/plan-cta";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  return buildMetadata({
    title: "Morocco itineraries",
    description: "Proven Morocco routes from three days in Marrakech to a twelve-day grand tour. Start from an itinerary, then shape it around how you travel.",
    path: "/itineraries",
    locale: loc,
    imageKey: "ait-benhaddou",
  });
}

export default async function ItinerariesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const itineraries = await listItineraries();

  return (
    <>
      <Breadcrumbs locale={locale as Locale} items={[{ name: dict.nav.home, path: "/" }, { name: dict.nav.itineraries }]} />
      <section className="mx-auto max-w-6xl px-5 py-10">
        <SectionHeading eyebrow={dict.home.itinerariesEyebrow} title={dict.home.itinerariesTitle} subtitle={dict.home.itinerariesSubtitle} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((it) => (
            <ItineraryCard key={it.slug} locale={locale as Locale} itinerary={it} common={dict.common} />
          ))}
        </div>
      </section>
      <PlanCta locale={locale as Locale} dict={dict} imageKey="sahara" />
    </>
  );
}
