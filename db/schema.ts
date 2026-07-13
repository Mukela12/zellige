import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  doublePrecision,
  date,
  index,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────────────
export const pageType = pgEnum("page_type", ["country", "region", "attraction", "itinerary"]);
export const leadStatus = pgEnum("lead_status", ["new", "contacted", "qualified", "converted", "archived"]);
export const crmStatus = pgEnum("crm_status", ["pending", "sent", "failed", "skipped"]);
export const webhookStatus = pgEnum("webhook_status", ["received", "processed", "duplicate", "invalid"]);

type Pair = { title: string; body: string };
type FAQ = { q: string; a: string };
type KV = { label: string; value: string };

// ── Locales (multilingual-ready: en default + others staged) ───────
export const locales = pgTable("locales", {
  code: text("code").primaryKey(), // "en", "fr", ...
  name: text("name").notNull(),
  englishName: text("english_name").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  enabled: boolean("enabled").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Content: countries ─────────────────────────────────────────────
export const countries = pgTable("countries", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  heroTitle: text("hero_title").notNull(),
  heroKicker: text("hero_kicker").notNull(),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  intro: text("intro").notNull(),
  bestTime: text("best_time").notNull(),
  currency: text("currency").notNull(),
  languages: text("languages").notNull(),
  imageKey: text("image_key").notNull(),
  highlights: jsonb("highlights").$type<Pair[]>().notNull(),
  faqs: jsonb("faqs").$type<FAQ[]>().notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Content: regions / zones ───────────────────────────────────────
export const regions = pgTable(
  "regions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    countryId: uuid("country_id").notNull().references(() => countries.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    displayName: text("display_name").notNull(),
    tagline: text("tagline").notNull(),
    metaTitle: text("meta_title").notNull(),
    metaDescription: text("meta_description").notNull(),
    intro: text("intro").notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    imageKey: text("image_key").notNull(),
    knownFor: jsonb("known_for").$type<string[]>().notNull(),
    faqs: jsonb("faqs").$type<FAQ[]>().notNull(),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("regions_country_idx").on(t.countryId)],
);

// ── Content: attractions ───────────────────────────────────────────
export const attractions = pgTable(
  "attractions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    regionId: uuid("region_id").notNull().references(() => regions.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    shortDescription: text("short_description").notNull(),
    body: text("body").notNull(),
    metaTitle: text("meta_title").notNull(),
    metaDescription: text("meta_description").notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    imageKey: text("image_key").notNull(),
    practical: jsonb("practical").$type<KV[]>().notNull(),
    faqs: jsonb("faqs").$type<FAQ[]>().notNull(),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("attractions_region_idx").on(t.regionId)],
);

// ── Content: itineraries + days + region links ─────────────────────
export const itineraries = pgTable("itineraries", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  durationDays: integer("duration_days").notNull(),
  summary: text("summary").notNull(),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  priceFromUsd: integer("price_from_usd").notNull(),
  imageKey: text("image_key").notNull(),
  includes: jsonb("includes").$type<string[]>().notNull(),
  faqs: jsonb("faqs").$type<FAQ[]>().notNull(),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const itineraryDays = pgTable(
  "itinerary_days",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    itineraryId: uuid("itinerary_id").notNull().references(() => itineraries.id, { onDelete: "cascade" }),
    day: integer("day").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    attractionSlugs: jsonb("attraction_slugs").$type<string[]>().notNull(),
  },
  (t) => [index("itinerary_days_itinerary_idx").on(t.itineraryId)],
);

export const itineraryRegions = pgTable(
  "itinerary_regions",
  {
    itineraryId: uuid("itinerary_id").notNull().references(() => itineraries.id, { onDelete: "cascade" }),
    regionId: uuid("region_id").notNull().references(() => regions.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("itinerary_regions_it_idx").on(t.itineraryId)],
);

// ── Leads (the 4-step form target) ─────────────────────────────────
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ref: text("ref").notNull().unique(), // human ref, e.g. ITN-7F3K-24
    status: leadStatus("status").notNull().default("new"),
    locale: text("locale").notNull().default("en"),

    // Step 1 — trip
    tripType: text("trip_type").notNull(), // "tailor-made" | "itinerary"
    itinerarySlug: text("itinerary_slug"),
    regionSlug: text("region_slug"),

    // Step 2 — dates + party
    startDate: date("start_date"),
    endDate: date("end_date"),
    flexibleDates: boolean("flexible_dates").notNull().default(false),
    adults: integer("adults").notNull().default(2),
    children: integer("children").notNull().default(0),
    infants: integer("infants").notNull().default(0),

    // Step 3 — preferences
    budgetBand: text("budget_band").notNull(),
    pace: text("pace").notNull(),
    interests: jsonb("interests").$type<string[]>().notNull(),

    // Step 4 — contact
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    notes: text("notes"),

    source: text("source").notNull().default("web"),
    crmStatusVal: crmStatus("crm_status").notNull().default("pending"),
    crmSyncedAt: timestamp("crm_synced_at", { withTimezone: true }),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("leads_status_idx").on(t.status), index("leads_created_idx").on(t.createdAt)],
);

// ── Inbound CRM webhook events (HMAC + idempotency) ────────────────
export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    source: text("source").notNull().default("crm"),
    eventId: text("event_id"), // provider event id, if present
    eventType: text("event_type"),
    signature: text("signature"),
    payloadHash: text("payload_hash").notNull().unique(), // sha256(raw body) — idempotency key
    headers: jsonb("headers").$type<Record<string, string>>().notNull(),
    body: jsonb("body").$type<Record<string, unknown>>(),
    status: webhookStatus("status").notNull().default("received"),
    error: text("error"),
    relatedLeadRef: text("related_lead_ref"),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (t) => [index("webhook_events_received_idx").on(t.receivedAt)],
);

// ── Outbound CRM deliveries (lead -> CRM) ──────────────────────────
export const outboundDeliveries = pgTable(
  "outbound_deliveries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    leadRef: text("lead_ref").notNull(),
    endpoint: text("endpoint").notNull(),
    attempt: integer("attempt").notNull().default(1),
    status: text("status").notNull(), // "sent" | "failed" | "skipped"
    responseCode: integer("response_code"),
    responseBody: text("response_body"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("outbound_lead_idx").on(t.leadRef)],
);

// ── Audit log (trigger-populated on lead status changes) ───────────
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(),
    actor: text("actor").notNull().default("system"),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_entity_idx").on(t.entityType, t.entityId)],
);

export const schema = {
  locales,
  countries,
  regions,
  attractions,
  itineraries,
  itineraryDays,
  itineraryRegions,
  leads,
  webhookEvents,
  outboundDeliveries,
  auditLog,
};
