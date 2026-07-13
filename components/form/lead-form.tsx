"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Minus, Plus, Check, Loader2, PartyPopper } from "lucide-react";
import { submitLead } from "@/lib/leads";
import { BUDGET_BANDS, PACES, INTERESTS, type LeadInput } from "@/lib/lead-schema";
import { formatUsd } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type FormDict = Dictionary["form"];
type ItineraryOpt = { slug: string; title: string; duration_days: number };
type RegionOpt = { slug: string; display_name: string };

const TOTAL = 4;

export function LeadForm({
  locale,
  form,
  itineraries,
  regions,
  initial,
}: {
  locale: Locale;
  form: FormDict;
  itineraries: ItineraryOpt[];
  regions: RegionOpt[];
  initial: { tripType?: "tailor-made" | "itinerary"; itinerarySlug?: string; regionSlug?: string };
}) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<LeadInput>({
    tripType: initial.tripType ?? (initial.itinerarySlug ? "itinerary" : "tailor-made"),
    itinerarySlug: initial.itinerarySlug ?? null,
    regionSlug: initial.regionSlug ?? null,
    startDate: null,
    endDate: null,
    flexibleDates: false,
    adults: 2,
    children: 0,
    infants: 0,
    budgetBand: "1500-3000",
    pace: "balanced",
    interests: [],
    fullName: "",
    email: "",
    phone: null,
    notes: null,
    locale,
  });

  const set = <K extends keyof LeadInput>(k: K, v: LeadInput[K]) => setData((d) => ({ ...d, [k]: v }));

  function validate(current: number): boolean {
    const e: Record<string, string> = {};
    if (current === 1 && data.tripType === "itinerary" && !data.itinerarySlug) e.itinerarySlug = form.errors.itinerary;
    if (current === 2 && data.adults < 1) e.adults = form.errors.adults;
    if (current === 3 && data.interests.length < 1) e.interests = form.errors.interests;
    if (current === 4) {
      if (data.fullName.trim().length < 2) e.fullName = form.errors.required;
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) e.email = form.errors.email;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validate(step)) setStep((s) => Math.min(TOTAL, s + 1));
  }
  function back() {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  async function onSubmit() {
    if (!validate(4)) return;
    setSubmitting(true);
    try {
      const res = await submitLead(data);
      if (res.ok) setRef(res.ref);
      else toast.error(res.error || form.errors.generic);
    } catch {
      toast.error(form.errors.generic);
    } finally {
      setSubmitting(false);
    }
  }

  if (ref) return <SuccessView locale={locale} form={form} data={data} refCode={ref} onReset={() => { setRef(null); setStep(1); }} />;

  const stepKeys = ["trip", "dates", "style", "contact"] as const;

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      {/* progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <p className="eyebrow">{form.stepOf.replace("{current}", String(step)).replace("{total}", String(TOTAL))}</p>
          <p className="text-sm font-medium text-muted-foreground">{form.steps[stepKeys[step - 1]]}</p>
        </div>
        <div className="mt-3 flex gap-1.5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i < step ? "bg-primary" : "bg-border")} />
          ))}
        </div>
      </div>

      <div className="fade-up" key={step}>
        {step === 1 && (
          <Step title={form.trip.question}>
            <div className="grid gap-3 sm:grid-cols-2">
              <OptionCard
                selected={data.tripType === "tailor-made"}
                title={form.trip.tailorLabel}
                hint={form.trip.tailorHint}
                onClick={() => { set("tripType", "tailor-made"); set("itinerarySlug", null); }}
              />
              <OptionCard
                selected={data.tripType === "itinerary"}
                title={form.trip.itineraryLabel}
                hint={form.trip.itineraryHint}
                onClick={() => set("tripType", "itinerary")}
              />
            </div>

            {data.tripType === "itinerary" && (
              <Field label={form.trip.itinerarySelect} error={errors.itinerarySlug}>
                <select className="field" value={data.itinerarySlug ?? ""} onChange={(e) => set("itinerarySlug", e.target.value || null)}>
                  <option value="">—</option>
                  {itineraries.map((it) => (
                    <option key={it.slug} value={it.slug}>{it.title} · {it.duration_days}d</option>
                  ))}
                </select>
              </Field>
            )}

            <Field label={form.trip.regionLabel}>
              <select className="field" value={data.regionSlug ?? ""} onChange={(e) => set("regionSlug", e.target.value || null)}>
                <option value="">{form.trip.anyRegion}</option>
                {regions.map((r) => (
                  <option key={r.slug} value={r.slug}>{r.display_name}</option>
                ))}
              </select>
            </Field>
          </Step>
        )}

        {step === 2 && (
          <Step title={form.dates.when}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={form.dates.startDate}>
                <input type="date" className="field field--mono" value={data.startDate ?? ""} onChange={(e) => set("startDate", e.target.value || null)} />
              </Field>
              <Field label={form.dates.endDate}>
                <input type="date" className="field field--mono" value={data.endDate ?? ""} min={data.startDate ?? undefined} onChange={(e) => set("endDate", e.target.value || null)} />
              </Field>
            </div>
            <label className="mt-1 flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" checked={data.flexibleDates} onChange={(e) => set("flexibleDates", e.target.checked)} className="h-4 w-4 accent-[hsl(var(--primary))]" />
              {form.dates.flexible}
            </label>

            <div className="mt-6">
              <p className="label">{form.dates.travellers}</p>
              <div className="divide-y divide-border rounded-2xl border border-border bg-card">
                <Counter label={form.dates.adults} hint={form.dates.adultsHint} value={data.adults} min={1} onChange={(v) => set("adults", v)} />
                <Counter label={form.dates.children} hint={form.dates.childrenHint} value={data.children} min={0} onChange={(v) => set("children", v)} />
                <Counter label={form.dates.infants} hint={form.dates.infantsHint} value={data.infants} min={0} onChange={(v) => set("infants", v)} />
              </div>
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title={form.style.budget}>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {BUDGET_BANDS.map((b) => (
                <OptionCard key={b} compact selected={data.budgetBand === b} title={form.style.budgetBands[b]} onClick={() => set("budgetBand", b)} />
              ))}
            </div>

            <div className="mt-6">
              <p className="label">{form.style.pace}</p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {PACES.map((p) => (
                  <OptionCard key={p} compact selected={data.pace === p} title={form.style.paces[p]} onClick={() => set("pace", p)} />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="label">{form.style.interests}</p>
              <p className="mb-2 text-xs text-muted-foreground">{form.style.interestsHint}</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((key) => {
                  const on = data.interests.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => set("interests", on ? data.interests.filter((i) => i !== key) : [...data.interests, key])}
                      className={cn(
                        "rounded-full border px-3.5 py-2 text-sm transition-colors",
                        on ? "border-primary/40 bg-primary/12 text-primary" : "border-border bg-card text-foreground hover:border-primary/30",
                      )}
                    >
                      {on && <Check size={13} className="mr-1 inline" />}
                      {form.style.interestOptions[key]}
                    </button>
                  );
                })}
              </div>
              {errors.interests && <p className="mt-2 text-sm text-destructive">{errors.interests}</p>}
            </div>
          </Step>
        )}

        {step === 4 && (
          <Step title={form.steps.contact}>
            <Field label={form.contact.name} error={errors.fullName}>
              <input className="field" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={form.contact.email} error={errors.email}>
                <input className="field" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
              </Field>
              <Field label={form.contact.phone}>
                <input className="field" value={data.phone ?? ""} onChange={(e) => set("phone", e.target.value || null)} autoComplete="tel" />
              </Field>
            </div>
            <Field label={form.contact.notes}>
              <textarea className="field min-h-[104px] resize-y" value={data.notes ?? ""} onChange={(e) => set("notes", e.target.value || null)} placeholder={form.contact.notesPlaceholder} />
            </Field>
          </Step>
        )}
      </div>

      {/* nav */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button type="button" onClick={back} disabled={step === 1} className="btn btn--ghost">
          <ArrowLeft size={16} /> {form.nav.back}
        </button>
        {step < TOTAL ? (
          <button type="button" onClick={next} className="btn btn--primary">
            {form.nav.continue} <ArrowRight size={16} />
          </button>
        ) : (
          <button type="button" onClick={onSubmit} disabled={submitting} className="btn btn--primary">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> {form.nav.submitting}</> : <>{form.nav.submit} <ArrowRight size={16} /></>}
          </button>
        )}
      </div>
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h2 className="serif text-[1.7rem] font-semibold tracking-[-0.02em]">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}

function OptionCard({ selected, title, hint, onClick, compact }: { selected: boolean; title: string; hint?: string; onClick: () => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 rounded-xl border text-left transition-all",
        compact ? "p-3.5" : "p-4",
        selected ? "border-primary/50 bg-primary/8 shadow-[var(--shadow-sm)]" : "border-border bg-card hover:border-primary/30",
      )}
    >
      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", selected ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
        {selected && <Check size={12} />}
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-foreground">{title}</span>
        {hint && <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{hint}</span>}
      </span>
    </button>
  );
}

function Counter({ label, hint, value, min, onChange }: { label: string; hint: string; value: number; min: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="btn btn--secondary btn--icon h-9 w-9 rounded-full" aria-label={`decrease ${label}`}>
          <Minus size={15} />
        </button>
        <span className="stat-num w-6 text-center text-lg font-semibold tabular-nums">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="btn btn--secondary btn--icon h-9 w-9 rounded-full" aria-label={`increase ${label}`}>
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

function SuccessView({ locale, form, data, refCode, onReset }: { locale: Locale; form: FormDict; data: LeadInput; refCode: string; onReset: () => void }) {
  const travellers = [
    `${data.adults} ${form.dates.adults.toLowerCase()}`,
    data.children ? `${data.children} ${form.dates.children.toLowerCase()}` : null,
    data.infants ? `${data.infants} ${form.dates.infants.toLowerCase()}` : null,
  ].filter(Boolean).join(", ");

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/12 text-success">
          <PartyPopper size={26} />
        </span>
        <h1 className="serif mt-5 text-[2.2rem] font-semibold tracking-[-0.02em]">{form.success.title}</h1>
        <p className="mt-3 max-w-md text-muted-foreground">{form.success.body}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2">
          <span className="text-xs text-muted-foreground">{form.success.refLabel}</span>
          <span className="font-mono text-sm font-semibold tracking-[0.06em] text-primary">{refCode}</span>
        </div>
      </div>

      {/* summary */}
      <div className="panel mt-9 p-6">
        <dl className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
          <SummaryRow label={form.summary.trip} value={data.tripType === "itinerary" ? (data.itinerarySlug ?? "—") : form.trip.tailorLabel} />
          <SummaryRow label={form.summary.travellers} value={travellers} />
          <SummaryRow label={form.summary.dates} value={data.flexibleDates ? form.summary.flexibleDates : data.startDate ? `${data.startDate}${data.endDate ? " → " + data.endDate : ""}` : "—"} />
          <SummaryRow label={form.summary.budget} value={form.style.budgetBands[data.budgetBand]} />
          <SummaryRow label={form.summary.pace} value={form.style.paces[data.pace]} />
          <SummaryRow label={form.summary.interests} value={data.interests.map((i) => form.style.interestOptions[i]).join(", ") || "—"} />
        </dl>
      </div>

      {/* next steps */}
      <div className="mt-8">
        <p className="eyebrow mb-4">{form.success.next}</p>
        <ol className="space-y-3">
          {[form.success.step1, form.success.step2, form.success.step3].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/12 font-mono text-[11px] font-semibold text-primary">{i + 1}</span>
              <span className="text-sm text-foreground">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-9 flex flex-wrap gap-3">
        <button onClick={onReset} className="btn btn--secondary">{form.success.again}</button>
        <Link href={`/${locale}`} className="btn btn--ghost">{form.title}</Link>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 pb-3 last:border-0">
      <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value}</dd>
    </div>
  );
}
