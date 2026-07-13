import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { imageSrc, BLUR } from "@/lib/images";
import { formatUsd } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

type Common = {
  from: string; perPerson: string; days: string; explore: string; places: string;
};

export function RegionCard({
  locale, region, common,
}: {
  locale: Locale;
  region: { slug: string; display_name: string; tagline: string; image_key: string; place_count?: number };
  common: Common;
}) {
  return (
    <Link
      href={`/${locale}/regions/${region.slug}`}
      className="card-surface card-surface--interactive group overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageSrc(region.image_key)}
          alt={region.display_name}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="serif text-[1.3rem] font-semibold leading-snug tracking-[-0.01em]">{region.display_name}</h3>
          <ArrowUpRight size={18} className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">{region.tagline}</p>
        {typeof region.place_count === "number" && (
          <p className="eyebrow mt-4">{region.place_count} {common.places}</p>
        )}
      </div>
    </Link>
  );
}

export function ItineraryCard({
  locale, itinerary, common,
}: {
  locale: Locale;
  itinerary: { slug: string; title: string; subtitle: string; duration_days: number; price_from_usd: number; image_key: string };
  common: Common;
}) {
  return (
    <Link
      href={`/${locale}/itineraries/${itinerary.slug}`}
      className="card-surface card-surface--interactive group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageSrc(itinerary.image_key)}
          alt={itinerary.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="pill glass-chip absolute left-3 top-3 text-foreground">
          {itinerary.duration_days} {common.days}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="serif text-[1.3rem] font-semibold leading-snug tracking-[-0.01em]">{itinerary.title}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground text-pretty">{itinerary.subtitle}</p>
        <div className="mt-4 flex items-baseline gap-1.5 border-t border-border/70 pt-4">
          <span className="text-xs text-muted-foreground">{common.from}</span>
          <span className="stat-num text-lg font-semibold text-foreground">{formatUsd(itinerary.price_from_usd)}</span>
          <span className="text-xs text-muted-foreground">{common.perPerson}</span>
        </div>
      </div>
    </Link>
  );
}

export function AttractionCard({
  locale, attraction,
}: {
  locale: Locale;
  attraction: { slug: string; name: string; category: string; short_description?: string; shortDescription?: string; image_key?: string; imageKey?: string };
}) {
  const desc = attraction.short_description ?? attraction.shortDescription;
  const img = attraction.image_key ?? attraction.imageKey;
  return (
    <Link
      href={`/${locale}/attractions/${attraction.slug}`}
      className="card-surface card-surface--interactive group flex gap-4 overflow-hidden p-3"
    >
      <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl sm:w-28">
        <Image
          src={imageSrc(img)}
          alt={attraction.name}
          fill
          sizes="120px"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>
      <div className="min-w-0 flex-1 py-1 pr-2">
        <span className="pill pill--neutral mb-1.5">{attraction.category}</span>
        <h3 className="serif truncate text-[1.15rem] font-semibold tracking-[-0.01em]">{attraction.name}</h3>
        {desc && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>}
      </div>
    </Link>
  );
}
