import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { imageSrc, BLUR } from "@/lib/images";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export function PlanCta({ locale, dict, imageKey = "riad-courtyard" }: { locale: Locale; dict: Dictionary; imageKey?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="relative isolate overflow-hidden rounded-3xl">
        <Image src={imageSrc(imageKey)} alt="" fill sizes="(max-width: 1152px) 100vw, 1152px" placeholder="blur" blurDataURL={BLUR} className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(20,16,10,0.86)_0%,rgba(20,16,10,0.62)_55%,rgba(20,16,10,0.30)_100%)]" />
        <div className="relative max-w-xl px-7 py-14 sm:px-12 sm:py-20">
          <h2 className="serif text-balance text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-[hsl(40_40%_96%)] sm:text-[2.6rem]">
            {dict.home.ctaTitle}
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed" style={{ color: "hsl(40 25% 88%)" }}>
            {dict.home.ctaBody}
          </p>
          <Link href={`/${locale}/plan`} className="btn btn--primary btn--lg mt-7">
            {dict.home.ctaButton} <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
