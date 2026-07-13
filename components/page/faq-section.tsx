"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export function FaqSection({ title, faqs }: { title: string; faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!faqs?.length) return null;
  return (
    <section className="mx-auto max-w-3xl px-5 py-14">
      <h2 className="serif text-[1.9rem] font-semibold tracking-[-0.02em]">{title}</h2>
      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-foreground">{f.q}</span>
                <span className="shrink-0 text-primary">{isOpen ? <Minus size={17} /> : <Plus size={17} />}</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 -mt-1 text-[15px] leading-relaxed text-muted-foreground">{f.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
