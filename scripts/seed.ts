import { config } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { createHash } from "node:crypto";
import * as schema from "../db/schema";
import content from "./content";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const isLocal = /localhost|127\.0\.0\.1/.test(url);
const sql = postgres(url, { max: 1, ssl: isLocal ? false : "require", prepare: false });
const db = drizzle(sql, { schema });

const {
  locales,
  countries,
  regions,
  attractions,
  itineraries,
  itineraryDays,
  itineraryRegions,
  leads,
  webhookEvents,
} = schema;

function ref() {
  const s = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = (n: number) => Array.from({ length: n }, () => s[Math.floor(Math.random() * s.length)]).join("");
  return `ITN-${pick(4)}-${pick(2)}`;
}
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);
const dateStr = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString().slice(0, 10);

async function main() {
  console.log("→ truncating…");
  await sql.unsafe(
    `TRUNCATE countries, regions, attractions, itineraries, itinerary_days, itinerary_regions, leads, webhook_events, outbound_deliveries, audit_log, locales RESTART IDENTITY CASCADE`,
  );

  // ── locales (multilingual-ready) ──
  await db.insert(locales).values([
    { code: "en", name: "English", englishName: "English", isDefault: true, enabled: true, sortOrder: 0 },
    { code: "fr", name: "Français", englishName: "French", isDefault: false, enabled: true, sortOrder: 1 },
    { code: "es", name: "Español", englishName: "Spanish", isDefault: false, enabled: false, sortOrder: 2 },
    { code: "ar", name: "العربية", englishName: "Arabic", isDefault: false, enabled: false, sortOrder: 3 },
  ]);
  console.log("✓ locales");

  // ── countries ──
  const countryIdBySlug = new Map<string, string>();
  for (const c of content.countries) {
    const [row] = await db
      .insert(countries)
      .values({
        slug: c.slug,
        name: c.name,
        heroTitle: c.heroTitle,
        heroKicker: c.heroKicker,
        metaTitle: c.metaTitle,
        metaDescription: c.metaDescription,
        intro: c.intro,
        bestTime: c.bestTime,
        currency: c.currency,
        languages: c.languages,
        imageKey: c.imageKey,
        highlights: c.highlights,
        faqs: c.faqs,
      })
      .returning({ id: countries.id });
    countryIdBySlug.set(c.slug, row.id);
  }
  console.log(`✓ ${content.countries.length} countries`);

  // ── regions ──
  const regionIdBySlug = new Map<string, string>();
  for (const r of content.regions) {
    const countryId = countryIdBySlug.get(r.countrySlug);
    if (!countryId) throw new Error(`region ${r.slug} references missing country ${r.countrySlug}`);
    const [row] = await db
      .insert(regions)
      .values({
        slug: r.slug,
        countryId,
        name: r.name,
        displayName: r.displayName,
        tagline: r.tagline,
        metaTitle: r.metaTitle,
        metaDescription: r.metaDescription,
        intro: r.intro,
        lat: r.lat,
        lng: r.lng,
        imageKey: r.imageKey,
        knownFor: r.knownFor,
        faqs: r.faqs,
      })
      .returning({ id: regions.id });
    regionIdBySlug.set(r.slug, row.id);
  }
  console.log(`✓ ${content.regions.length} regions`);

  // ── attractions ──
  for (const a of content.attractions) {
    const regionId = regionIdBySlug.get(a.regionSlug);
    if (!regionId) throw new Error(`attraction ${a.slug} references missing region ${a.regionSlug}`);
    await db.insert(attractions).values({
      slug: a.slug,
      regionId,
      name: a.name,
      category: a.category,
      shortDescription: a.shortDescription,
      body: a.body,
      metaTitle: a.metaTitle,
      metaDescription: a.metaDescription,
      lat: a.lat,
      lng: a.lng,
      imageKey: a.imageKey,
      practical: a.practical,
      faqs: a.faqs,
    });
  }
  console.log(`✓ ${content.attractions.length} attractions`);

  // ── itineraries + days + region links ──
  for (const it of content.itineraries) {
    const [row] = await db
      .insert(itineraries)
      .values({
        slug: it.slug,
        title: it.title,
        subtitle: it.subtitle,
        durationDays: it.durationDays,
        summary: it.summary,
        metaTitle: it.metaTitle,
        metaDescription: it.metaDescription,
        priceFromUsd: it.priceFromUsd,
        imageKey: it.imageKey,
        includes: it.includes,
        faqs: it.faqs,
      })
      .returning({ id: itineraries.id });

    if (it.days.length) {
      await db.insert(itineraryDays).values(
        it.days.map((d) => ({
          itineraryId: row.id,
          day: d.day,
          title: d.title,
          body: d.body,
          attractionSlugs: d.attractionSlugs,
        })),
      );
    }
    const links = it.regionSlugs
      .map((slug, i) => {
        const regionId = regionIdBySlug.get(slug);
        return regionId ? { itineraryId: row.id, regionId, position: i } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    if (links.length) await db.insert(itineraryRegions).values(links);
  }
  console.log(`✓ ${content.itineraries.length} itineraries`);

  // ── sample leads (so the operator console has data) ──
  const sampleLeads = [
    {
      ref: ref(),
      status: "qualified" as const,
      tripType: "itinerary",
      itinerarySlug: "imperial-cities-and-the-sahara",
      regionSlug: "marrakech-safi",
      startDate: dateStr(48),
      endDate: dateStr(55),
      adults: 2,
      children: 0,
      infants: 0,
      budgetBand: "3000-5000",
      pace: "balanced",
      interests: ["history", "food", "desert"],
      fullName: "Claire Fontaine",
      email: "claire.fontaine@example.com",
      phone: "+33 6 12 34 56 78",
      notes: "Anniversary trip, would love a night in the dunes.",
      crmStatusVal: "sent" as const,
      crmSyncedAt: daysAgo(2),
      createdAt: daysAgo(2),
    },
    {
      ref: ref(),
      status: "new" as const,
      tripType: "tailor-made",
      regionSlug: "tanger-tetouan",
      startDate: dateStr(90),
      endDate: null,
      flexibleDates: true,
      adults: 2,
      children: 2,
      infants: 1,
      budgetBand: "1500-3000",
      pace: "relaxed",
      interests: ["photography", "coast", "family"],
      fullName: "Daniel Okoro",
      email: "daniel.okoro@example.com",
      phone: null,
      notes: "Travelling with young kids, need family-friendly riads.",
      crmStatusVal: "sent" as const,
      crmSyncedAt: daysAgo(1),
      createdAt: daysAgo(1),
    },
    {
      ref: ref(),
      status: "contacted" as const,
      tripType: "itinerary",
      itinerarySlug: "marrakech-in-three-days",
      regionSlug: "marrakech-safi",
      startDate: dateStr(21),
      endDate: dateStr(24),
      adults: 4,
      children: 0,
      infants: 0,
      budgetBand: "under-1500",
      pace: "packed",
      interests: ["food", "shopping", "architecture"],
      fullName: "Mia Larsson",
      email: "mia.larsson@example.com",
      phone: "+45 20 11 22 33",
      notes: null,
      crmStatusVal: "sent" as const,
      crmSyncedAt: daysAgo(4),
      createdAt: daysAgo(4),
    },
  ];
  for (const l of sampleLeads) {
    const { createdAt, ...rest } = l;
    const payload = { ...rest, seeded: true };
    await db.insert(leads).values({ ...rest, payload, source: "web", createdAt });
  }
  console.log(`✓ ${sampleLeads.length} sample leads`);

  // ── sample webhook events (processed + a duplicate) ──
  const body1 = JSON.stringify({ event: "lead.status_changed", ref: sampleLeads[0].ref, status: "qualified", at: daysAgo(1).toISOString() });
  const hash1 = createHash("sha256").update(body1).digest("hex");
  await db.insert(webhookEvents).values([
    {
      source: "crm",
      eventId: "evt_seed_001",
      eventType: "lead.status_changed",
      signature: "sha256=seed",
      payloadHash: hash1,
      headers: { "x-crm-event": "lead.status_changed", "content-type": "application/json" },
      body: JSON.parse(body1),
      status: "processed",
      relatedLeadRef: sampleLeads[0].ref,
      receivedAt: daysAgo(1),
      processedAt: daysAgo(1),
    },
  ]);
  console.log("✓ sample webhook events");

  await sql.end();
  console.log("\n✓ seed complete");
}

main().catch(async (err) => {
  console.error(err);
  try { await sql.end(); } catch {}
  process.exit(1);
});
