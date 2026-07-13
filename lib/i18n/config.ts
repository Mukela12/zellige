// Routable locales. Content launches in English; French routing + UI chrome
// are wired so the platform is multilingual-ready from day one. es/ar exist in
// the `locales` table (disabled) and become routable by adding them here once
// translated content lands.
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; english: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", english: "English", dir: "ltr" },
  fr: { label: "Français", english: "French", dir: "ltr" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
