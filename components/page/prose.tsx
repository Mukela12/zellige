// Renders the lightweight markdown our content uses: paragraphs separated by
// blank lines. Kept deliberately small (no markdown runtime) for CWV.
export function Prose({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className={`prose-editorial ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="serif text-balance text-[2rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[2.4rem]">
        {title}
      </h2>
      {subtitle && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">{subtitle}</p>}
    </div>
  );
}
