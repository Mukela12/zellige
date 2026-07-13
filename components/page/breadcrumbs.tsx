import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export function Breadcrumbs({
  locale,
  items,
}: {
  locale: Locale;
  items: { name: string; path?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-5 pt-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.path && !last ? (
                <Link href={`/${locale}${item.path === "/" ? "" : item.path}`} className="hover:text-foreground">
                  {item.name}
                </Link>
              ) : (
                <span className={last ? "text-foreground" : ""}>{item.name}</span>
              )}
              {!last && <ChevronRight size={13} className="text-border" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
