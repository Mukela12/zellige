import Image from "next/image";
import { imageSrc, BLUR } from "@/lib/images";

export function PageHero({
  imageKey,
  kicker,
  title,
  subtitle,
  meta,
  priority = true,
}: {
  imageKey: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  priority?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative h-[52vh] min-h-[360px] w-full sm:h-[60vh]">
        <Image
          src={imageSrc(imageKey)}
          alt={title}
          fill
          priority={priority}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR}
          className="object-cover"
        />
        {/* photo scrim for legibility (allowed) */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,10,0.15)_0%,rgba(20,16,10,0.05)_38%,rgba(20,16,10,0.72)_100%)]" />
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-6xl px-5 pb-9 sm:pb-12">
          {kicker && (
            <p className="eyebrow mb-3 text-[hsl(40_30%_90%)]/90" style={{ color: "hsl(40 40% 92%)" }}>
              {kicker}
            </p>
          )}
          <h1 className="max-w-3xl text-balance serif text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.02em] text-[hsl(40_40%_96%)] sm:text-[3.4rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[hsl(40_30%_90%)]/90 sm:text-base" style={{ color: "hsl(40 25% 88%)" }}>
              {subtitle}
            </p>
          )}
          {meta && <div className="mt-6 flex flex-wrap items-center gap-2.5">{meta}</div>}
        </div>
      </div>
    </section>
  );
}
