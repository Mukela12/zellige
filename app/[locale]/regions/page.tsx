import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { listRegions } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/page/breadcrumbs";
import { SectionHeading } from "@/components/page/prose";
import { RegionCard } from "@/components/site/cards";
import { PlanCta } from "@/components/site/plan-cta";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  return buildMetadata({
    title: "Regions of Morocco",
    description: "The five regions of Morocco, from Marrakech and the High Atlas to the Sahara and the blue north. Find where to go and how long to stay.",
    path: "/regions",
    locale: loc,
    imageKey: "atlas-mountains",
  });
}

export default async function RegionsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const regions = await listRegions();

  return (
    <>
      <Breadcrumbs locale={locale as Locale} items={[{ name: dict.nav.home, path: "/" }, { name: dict.nav.regions }]} />
      <section className="mx-auto max-w-6xl px-5 py-10">
        <SectionHeading eyebrow={dict.home.regionsEyebrow} title={dict.home.regionsTitle} subtitle={dict.home.regionsSubtitle} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((r) => (
            <RegionCard key={r.slug} locale={locale as Locale} region={r} common={dict.common} />
          ))}
        </div>
      </section>
      <PlanCta locale={locale as Locale} dict={dict} imageKey="chefchaouen" />
    </>
  );
}
