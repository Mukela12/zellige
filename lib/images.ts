// Self-hosted, curated Creative-Commons imagery keyed by the content's
// image_key. Same-origin -> fast LCP, no external image dependency.
export function imageSrc(key: string | null | undefined): string {
  const k = (key || "morocco").replace(/[^a-z0-9-]/gi, "");
  return `/images/${k}.jpg`;
}

// Warm-neutral 1x1 used as the blur placeholder while photos decode.
export const BLUR =
  "data:image/gif;base64,R0lGODlhAQABAPAAAOng1P///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
