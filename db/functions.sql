-- ════════════════════════════════════════════════════════════════════
-- Zellige — database views, triggers, audit logging
-- Applied by scripts/migrate.ts after drizzle migrations.
-- In the real Itanera project these are owned by the DB architect; here
-- they are authored to match that contract (vw_seo_landing_pages + the
-- status/audit trigger structure the brief describes).
-- ════════════════════════════════════════════════════════════════════

-- ── vw_seo_landing_pages ─────────────────────────────────────────────
-- One row per publishable SEO page. `payload` carries the ENTIRE
-- type-specific page tree (parent + child collections) as jsonb, so a
-- page route is a single indexed lookup: no N+1, no per-child round-trip.
CREATE OR REPLACE VIEW vw_seo_landing_pages AS

-- Country templates
SELECT
  'country'::text AS page_type,
  c.slug,
  'en'::text      AS locale,
  '/destinations/' || c.slug AS path,
  c.meta_title,
  c.meta_description,
  c.hero_title    AS h1,
  c.hero_kicker,
  c.image_key,
  c.updated_at,
  jsonb_build_object(
    'name', c.name,
    'heroTitle', c.hero_title,
    'heroKicker', c.hero_kicker,
    'intro', c.intro,
    'bestTime', c.best_time,
    'currency', c.currency,
    'languages', c.languages,
    'highlights', c.highlights,
    'faqs', c.faqs,
    'regions', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'slug', r.slug, 'name', r.name, 'displayName', r.display_name,
        'tagline', r.tagline, 'imageKey', r.image_key
      ) ORDER BY r.name)
      FROM regions r WHERE r.country_id = c.id AND r.published
    ), '[]'::jsonb)
  ) AS payload
FROM countries c
WHERE c.published

UNION ALL

-- Region / zone templates
SELECT
  'region', r.slug, 'en',
  '/regions/' || r.slug,
  r.meta_title, r.meta_description,
  r.display_name, r.tagline, r.image_key, r.updated_at,
  jsonb_build_object(
    'name', r.name,
    'displayName', r.display_name,
    'tagline', r.tagline,
    'intro', r.intro,
    'lat', r.lat, 'lng', r.lng,
    'knownFor', r.known_for,
    'faqs', r.faqs,
    'country', (
      SELECT jsonb_build_object('slug', c.slug, 'name', c.name)
      FROM countries c WHERE c.id = r.country_id
    ),
    'attractions', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'slug', a.slug, 'name', a.name, 'category', a.category,
        'shortDescription', a.short_description, 'imageKey', a.image_key
      ) ORDER BY a.name)
      FROM attractions a WHERE a.region_id = r.id AND a.published
    ), '[]'::jsonb),
    'itineraries', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'slug', it.slug, 'title', it.title, 'durationDays', it.duration_days,
        'priceFromUsd', it.price_from_usd, 'imageKey', it.image_key
      ))
      FROM (
        SELECT DISTINCT it.id, it.slug, it.title, it.duration_days, it.price_from_usd, it.image_key
        FROM itineraries it
        JOIN itinerary_regions ir ON ir.itinerary_id = it.id
        WHERE ir.region_id = r.id AND it.published
      ) it
    ), '[]'::jsonb)
  )
FROM regions r
WHERE r.published

UNION ALL

-- Attraction / content templates
SELECT
  'attraction', a.slug, 'en',
  '/attractions/' || a.slug,
  a.meta_title, a.meta_description,
  a.name, a.short_description, a.image_key, a.updated_at,
  jsonb_build_object(
    'name', a.name,
    'category', a.category,
    'shortDescription', a.short_description,
    'body', a.body,
    'lat', a.lat, 'lng', a.lng,
    'practical', a.practical,
    'faqs', a.faqs,
    'region', (
      SELECT jsonb_build_object('slug', r.slug, 'name', r.name, 'displayName', r.display_name)
      FROM regions r WHERE r.id = a.region_id
    ),
    'nearby', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'slug', a2.slug, 'name', a2.name, 'category', a2.category, 'imageKey', a2.image_key
      ) ORDER BY a2.name)
      FROM attractions a2
      WHERE a2.region_id = a.region_id AND a2.id <> a.id AND a2.published
    ), '[]'::jsonb)
  )
FROM attractions a
WHERE a.published

UNION ALL

-- Itinerary templates
SELECT
  'itinerary', it.slug, 'en',
  '/itineraries/' || it.slug,
  it.meta_title, it.meta_description,
  it.title, it.subtitle, it.image_key, it.updated_at,
  jsonb_build_object(
    'title', it.title,
    'subtitle', it.subtitle,
    'summary', it.summary,
    'durationDays', it.duration_days,
    'priceFromUsd', it.price_from_usd,
    'includes', it.includes,
    'faqs', it.faqs,
    'regions', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'slug', r.slug, 'name', r.name, 'displayName', r.display_name, 'imageKey', r.image_key
      ) ORDER BY ir.position)
      FROM itinerary_regions ir JOIN regions r ON r.id = ir.region_id
      WHERE ir.itinerary_id = it.id
    ), '[]'::jsonb),
    'days', COALESCE((
      SELECT jsonb_agg(day_obj ORDER BY d_day)
      FROM (
        SELECT
          d.day AS d_day,
          jsonb_build_object(
            'day', d.day, 'title', d.title, 'body', d.body,
            'attractions', COALESCE((
              SELECT jsonb_agg(jsonb_build_object(
                'slug', a.slug, 'name', a.name, 'category', a.category, 'imageKey', a.image_key
              ) ORDER BY a.name)
              FROM attractions a
              WHERE a.slug IN (SELECT jsonb_array_elements_text(d.attraction_slugs))
            ), '[]'::jsonb)
          ) AS day_obj
        FROM itinerary_days d
        WHERE d.itinerary_id = it.id
      ) days_sub
    ), '[]'::jsonb)
  )
FROM itineraries it
WHERE it.published;

-- ── updated_at maintenance ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['countries','regions','attractions','itineraries','leads']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON %1$s;', t);
    EXECUTE format(
      'CREATE TRIGGER trg_%1$s_updated_at BEFORE UPDATE ON %1$s
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t);
  END LOOP;
END $$;

-- ── Lead status + audit logging ─────────────────────────────────────
CREATE OR REPLACE FUNCTION log_lead_audit() RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_log(entity_type, entity_id, action, actor, meta)
    VALUES ('lead', NEW.ref, 'lead.created', 'system',
      jsonb_build_object('status', NEW.status, 'crm_status', NEW.crm_status));
  ELSIF (TG_OP = 'UPDATE') THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO audit_log(entity_type, entity_id, action, actor, meta)
      VALUES ('lead', NEW.ref, 'lead.status_changed', 'system',
        jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
    IF NEW.crm_status IS DISTINCT FROM OLD.crm_status THEN
      INSERT INTO audit_log(entity_type, entity_id, action, actor, meta)
      VALUES ('lead', NEW.ref, 'lead.crm_status_changed', 'system',
        jsonb_build_object('from', OLD.crm_status, 'to', NEW.crm_status));
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_leads_audit_ins ON leads;
CREATE TRIGGER trg_leads_audit_ins AFTER INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION log_lead_audit();

DROP TRIGGER IF EXISTS trg_leads_audit_upd ON leads;
CREATE TRIGGER trg_leads_audit_upd AFTER UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION log_lead_audit();

-- ── Extra indexes to keep the view fast under production-like content ─
CREATE INDEX IF NOT EXISTS itinerary_regions_region_idx ON itinerary_regions(region_id);
CREATE INDEX IF NOT EXISTS attractions_slug_idx ON attractions(slug);
