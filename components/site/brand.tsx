import { cn } from "@/lib/utils";

// Zellige mark — the khatam (8-point star) formed by two overlapped squares,
// the founding motif of Moroccan tilework and the project fingerprint.
export function ZelligeMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <g transform="translate(16 16)">
        <rect x="-10" y="-10" width="20" height="20" rx="2.5" fill="currentColor" opacity="0.92" />
        <rect x="-10" y="-10" width="20" height="20" rx="2.5" fill="currentColor" transform="rotate(45)" />
        <circle r="3.6" fill="hsl(var(--background))" />
      </g>
    </svg>
  );
}

export function ZelligeWordmark({
  className,
  markClassName,
  size = 24,
}: {
  className?: string;
  markClassName?: string;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <ZelligeMark size={size} className={cn("text-primary", markClassName)} />
      <span className="serif text-[1.35rem] font-semibold tracking-[-0.02em]">Zellige</span>
    </span>
  );
}
