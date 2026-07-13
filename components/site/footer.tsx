import Link from "next/link";
import { ZelligeWordmark } from "./brand";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const l = (p: string) => `/${locale}${p === "/" ? "" : p}`;
  const f = dict.footer;
  return (
    <footer className="surface-ink mt-24">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <ZelligeWordmark size={22} className="text-[hsl(40_30%_92%)]" markClassName="text-primary" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">{f.blurb}</p>
          </div>

          <div>
            <p className="eyebrow mb-4">{f.explore}</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={l("/destinations/morocco")} className="text-[var(--text-secondary)] hover:text-[hsl(40_30%_92%)]">{dict.nav.destinations}</Link></li>
              <li><Link href={l("/regions")} className="text-[var(--text-secondary)] hover:text-[hsl(40_30%_92%)]">{dict.nav.regions}</Link></li>
              <li><Link href={l("/itineraries")} className="text-[var(--text-secondary)] hover:text-[hsl(40_30%_92%)]">{dict.nav.itineraries}</Link></li>
              <li><Link href={l("/plan")} className="text-[var(--text-secondary)] hover:text-[hsl(40_30%_92%)]">{dict.nav.plan}</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">{f.company}</p>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-[var(--text-secondary)]">{f.about}</span></li>
              <li><span className="text-[var(--text-secondary)]">{f.contact}</span></li>
              <li><span className="text-[var(--text-secondary)]">{f.privacy}</span></li>
              <li><span className="text-[var(--text-secondary)]">{f.terms}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[hsl(34_14%_22%)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {dict.brand.name}. {f.rights}</p>
          <p className="font-mono uppercase tracking-[0.12em]">{f.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
