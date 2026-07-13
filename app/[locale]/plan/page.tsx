import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { listItineraries, listRegions } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/form/lead-form";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const dict = getDictionary(loc);
  return buildMetadata({
    title: dict.form.title,
    description: dict.form.subtitle,
    path: "/plan",
    locale: loc,
    imageKey: "riad-courtyard",
  });
}

export default async function PlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ itinerary?: string; region?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { itinerary, region } = await searchParams;
  const dict = getDictionary(locale);

  const [itineraries, regions] = [await listItineraries(), await listRegions()];

  const initial = {
    tripType: (itinerary ? "itinerary" : "tailor-made") as "itinerary" | "tailor-made",
    itinerarySlug: itinerary,
    regionSlug: region,
  };

  return (
    <>
      <section className="border-b border-border/70 bg-[hsl(var(--muted)/0.4)]">
        <div className="mx-auto max-w-2xl px-5 py-10 text-center">
          <h1 className="serif text-[2.4rem] font-semibold tracking-[-0.02em]">{dict.form.title}</h1>
          <p className="mt-2 text-muted-foreground">{dict.form.subtitle}</p>
        </div>
      </section>
      <LeadForm
        locale={locale as Locale}
        form={dict.form}
        itineraries={itineraries.map((i) => ({ slug: i.slug, title: i.title, duration_days: i.duration_days }))}
        regions={regions.map((r) => ({ slug: r.slug, display_name: r.display_name }))}
        initial={initial}
      />
    </>
  );
}
