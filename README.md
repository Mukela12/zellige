# Zellige — Morocco travel pSEO platform (demo)

A production demo of a **programmatic-SEO travel platform**: data-driven landing pages, reusable templates, a four-step lead form, and clean CRM webhook handling. Built to mirror the architecture of a Phase-1 pSEO travel MVP.

**Live:** https://zellige-bay.vercel.app
**Operator console:** https://zellige-bay.vercel.app/studio (read-only; demo password prefilled)

- **Frontend:** Next.js 16 (App Router, React 19) on **Vercel**
- **Database:** PostgreSQL on **Railway**
- **ORM / driver:** Drizzle + postgres-js
- **UI:** Tailwind v4, framer-motion, Rive (operator login)

---

## How this maps to the five milestones

**M1 — Webhook integrity.** `app/api/webhooks/crm/route.ts` reads the **raw body**, verifies an `x-crm-signature: sha256=…` HMAC over those exact bytes with `timingSafeEqual` (`lib/webhook.ts`), stores `payload_hash = sha256(raw)` with a **UNIQUE** constraint, and uses `onConflictDoNothing` so a duplicate retry is acknowledged `200 {status:"duplicate"}` **without reprocessing**. Invalid/absent signatures are logged and rejected `401`. Valid `lead.status_changed` events apply the status, which fires the DB audit trigger.

**M2 — SEO routing, i18n, page rendering.** Five templates (landing, country, region, attraction, itinerary) under `app/[locale]/…`. Each dynamic page reads its **entire payload from `vw_seo_landing_pages` in one query** (`lib/data.ts` → `getSeoPage`), so there is **no N+1**: child collections (a region's attractions + itineraries, an itinerary's days → attractions) are aggregated as `jsonb` inside the view (`db/functions.sql`). `generateMetadata` and the page share the read via React `cache()`. Locale-aware canonical + `hreflang` + `x-default` (`lib/seo.ts`), dynamic `sitemap.xml` with per-URL language alternates, JSON-LD (`TouristAttraction`, `TouristTrip`, `BreadcrumbList`, `FAQPage`). English fallback is resolved in SQL (`locale IN ($locale,'en') ORDER BY (locale=$locale) DESC`). Pages are static/ISR (`revalidate`) for Core Web Vitals; images are self-hosted and served through `next/image`.

**M3 — Component mapping / i18n dictionaries.** Reusable, responsive components in `components/*` driven by design tokens in `app/globals.css`. **All UI text is externalized** into `dictionaries/{en,fr}.json` via `getDictionary(locale)`.

**M4 — Multi-step lead form.** `components/form/lead-form.tsx`: four steps, adult/child/infant counters, per-step validation, conditional logic (itinerary vs tailor-made), context-aware prefill (`/plan?itinerary=…`), Back disabled on step 1, localized labels/errors, loading/success/error states and a post-submit summary + reference. Submission (`lib/leads.ts`, a server action) validates with zod, writes the lead, then performs the **outbound CRM submission** (`lib/crm.ts`, HMAC-signed, logged to `outbound_deliveries`; simulated when `CRM_OUTBOUND_URL` is unset).

**M5 — QA, verification, launch.** Deployed to Vercel + Railway via CLI. Webhook signature/idempotency, trigger/audit logging, canonical/hreflang, dictionary fallback, and form submission are all verified end-to-end (see the operator console).

---

## Database

Schema in `db/schema.ts` (Drizzle). Views + triggers in `db/functions.sql`:

- `vw_seo_landing_pages` — one row per publishable page; `payload` is the full page tree as `jsonb`.
- `set_updated_at()` triggers on all content tables + `leads`.
- `log_lead_audit()` writes `audit_log` rows on lead create + status/CRM-status change.

`leads`, `webhook_events` (UNIQUE `payload_hash`), `outbound_deliveries`, `audit_log`, plus `locales` (en enabled + default, fr enabled, es/ar staged).

---

## Run locally

```bash
pnpm install
cp .env.local.example .env.local   # set DATABASE_URL etc.
pnpm db:generate && pnpm db:migrate # migrations + views + triggers
pnpm db:seed                        # Morocco content + sample leads
pnpm dev
```

### Environment

| var | purpose |
|---|---|
| `DATABASE_URL` / `DATABASE_URL_DIRECT` | Railway Postgres (public proxy URL) |
| `CRM_WEBHOOK_SECRET` | HMAC-SHA256 shared secret (inbound + outbound) |
| `CRM_OUTBOUND_URL` | outbound CRM endpoint (blank → simulated + logged) |
| `OPERATOR_PASSWORD` | operator console password |
| `NEXT_PUBLIC_SITE_URL` | absolute base for canonical/hreflang/OG/sitemap |

### Test the webhook

```bash
BODY='{"id":"evt_1","event":"lead.status_changed","ref":"ITN-XXXX-XX","status":"qualified"}'
SIG="sha256=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$CRM_WEBHOOK_SECRET" -r | cut -d' ' -f1)"
curl -X POST "$SITE/api/webhooks/crm" -H "x-crm-signature: $SIG" -d "$BODY"
# first: {"status":"processed"} · replay same body: {"status":"duplicate"} · bad sig: 401
```

---

*Content and imagery are Creative-Commons / illustrative. This is a portfolio demo, not a real travel agency.*
