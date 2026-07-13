CREATE TYPE "public"."crm_status" AS ENUM('pending', 'sent', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'qualified', 'converted', 'archived');--> statement-breakpoint
CREATE TYPE "public"."page_type" AS ENUM('country', 'region', 'attraction', 'itinerary');--> statement-breakpoint
CREATE TYPE "public"."webhook_status" AS ENUM('received', 'processed', 'duplicate', 'invalid');--> statement-breakpoint
CREATE TABLE "attractions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"region_id" uuid NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"short_description" text NOT NULL,
	"body" text NOT NULL,
	"meta_title" text NOT NULL,
	"meta_description" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"image_key" text NOT NULL,
	"practical" jsonb NOT NULL,
	"faqs" jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attractions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" text NOT NULL,
	"actor" text DEFAULT 'system' NOT NULL,
	"meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"hero_title" text NOT NULL,
	"hero_kicker" text NOT NULL,
	"meta_title" text NOT NULL,
	"meta_description" text NOT NULL,
	"intro" text NOT NULL,
	"best_time" text NOT NULL,
	"currency" text NOT NULL,
	"languages" text NOT NULL,
	"image_key" text NOT NULL,
	"highlights" jsonb NOT NULL,
	"faqs" jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "countries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "itineraries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"duration_days" integer NOT NULL,
	"summary" text NOT NULL,
	"meta_title" text NOT NULL,
	"meta_description" text NOT NULL,
	"price_from_usd" integer NOT NULL,
	"image_key" text NOT NULL,
	"includes" jsonb NOT NULL,
	"faqs" jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "itineraries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "itinerary_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"itinerary_id" uuid NOT NULL,
	"day" integer NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"attraction_slugs" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itinerary_regions" (
	"itinerary_id" uuid NOT NULL,
	"region_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ref" text NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"locale" text DEFAULT 'en' NOT NULL,
	"trip_type" text NOT NULL,
	"itinerary_slug" text,
	"region_slug" text,
	"start_date" date,
	"end_date" date,
	"flexible_dates" boolean DEFAULT false NOT NULL,
	"adults" integer DEFAULT 2 NOT NULL,
	"children" integer DEFAULT 0 NOT NULL,
	"infants" integer DEFAULT 0 NOT NULL,
	"budget_band" text NOT NULL,
	"pace" text NOT NULL,
	"interests" jsonb NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"notes" text,
	"source" text DEFAULT 'web' NOT NULL,
	"crm_status" "crm_status" DEFAULT 'pending' NOT NULL,
	"crm_synced_at" timestamp with time zone,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "leads_ref_unique" UNIQUE("ref")
);
--> statement-breakpoint
CREATE TABLE "locales" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"english_name" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outbound_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid,
	"lead_ref" text NOT NULL,
	"endpoint" text NOT NULL,
	"attempt" integer DEFAULT 1 NOT NULL,
	"status" text NOT NULL,
	"response_code" integer,
	"response_body" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"country_id" uuid NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"tagline" text NOT NULL,
	"meta_title" text NOT NULL,
	"meta_description" text NOT NULL,
	"intro" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"image_key" text NOT NULL,
	"known_for" jsonb NOT NULL,
	"faqs" jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "regions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text DEFAULT 'crm' NOT NULL,
	"event_id" text,
	"event_type" text,
	"signature" text,
	"payload_hash" text NOT NULL,
	"headers" jsonb NOT NULL,
	"body" jsonb,
	"status" "webhook_status" DEFAULT 'received' NOT NULL,
	"error" text,
	"related_lead_ref" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone,
	CONSTRAINT "webhook_events_payload_hash_unique" UNIQUE("payload_hash")
);
--> statement-breakpoint
ALTER TABLE "attractions" ADD CONSTRAINT "attractions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_days" ADD CONSTRAINT "itinerary_days_itinerary_id_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_regions" ADD CONSTRAINT "itinerary_regions_itinerary_id_itineraries_id_fk" FOREIGN KEY ("itinerary_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itinerary_regions" ADD CONSTRAINT "itinerary_regions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outbound_deliveries" ADD CONSTRAINT "outbound_deliveries_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attractions_region_idx" ON "attractions" USING btree ("region_id");--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "itinerary_days_itinerary_idx" ON "itinerary_days" USING btree ("itinerary_id");--> statement-breakpoint
CREATE INDEX "itinerary_regions_it_idx" ON "itinerary_regions" USING btree ("itinerary_id");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_created_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "outbound_lead_idx" ON "outbound_deliveries" USING btree ("lead_ref");--> statement-breakpoint
CREATE INDEX "regions_country_idx" ON "regions" USING btree ("country_id");--> statement-breakpoint
CREATE INDEX "webhook_events_received_idx" ON "webhook_events" USING btree ("received_at");