"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Check } from "lucide-react";
import { ZelligeWordmark } from "./brand";
import { locales, localeMeta, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type Nav = { destinations: string; regions: string; itineraries: string; attractions: string; plan: string; home: string };

export function Header({ locale, nav }: { locale: Locale; nav: Nav }) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const l = (p: string) => `/${locale}${p === "/" ? "" : p}`;

  // strip the current locale prefix to build the same page in another locale
  const rest = pathname.replace(new RegExp(`^/(${locales.join("|")})`), "") || "";

  const links = [
    { href: l("/destinations/morocco"), label: nav.destinations },
    { href: l("/regions"), label: nav.regions },
    { href: l("/itineraries"), label: nav.itineraries },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href={l("/")} aria-label="Zellige home" className="shrink-0">
          <ZelligeWordmark size={22} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language switcher — swaps only the locale segment of the current path */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangOpen((v) => !v)}
              onBlur={() => setTimeout(() => setLangOpen(false), 150)}
              className="btn btn--ghost btn--sm font-mono uppercase tracking-[0.08em]"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
            >
              {locale}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-[var(--shadow-md)]">
                {locales.map((lc) => (
                  <Link
                    key={lc}
                    href={`/${lc}${rest}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-[var(--bg-hover)]"
                  >
                    <span>{localeMeta[lc].label}</span>
                    {lc === locale && <Check size={14} className="text-primary" />}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={l("/plan")} className="btn btn--primary btn--sm hidden sm:inline-flex">
            {nav.plan}
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="btn btn--ghost btn--icon md:hidden"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-[var(--bg-hover)]"
              >
                {link.label}
              </Link>
            ))}
            <Link href={l("/plan")} onClick={() => setOpen(false)} className="btn btn--primary mt-2">
              {nav.plan}
            </Link>
            <div className="mt-2 flex gap-2 px-1">
              {locales.map((lc) => (
                <Link
                  key={lc}
                  href={`/${lc}${rest}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em]",
                    lc === locale ? "border-primary/40 text-primary" : "border-border text-muted-foreground",
                  )}
                >
                  {localeMeta[lc].label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
