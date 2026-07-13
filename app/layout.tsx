import type { Metadata } from "next";
import { Toaster } from "sonner";
import { display, sans, mono } from "@/lib/fonts";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Morocco travel, arranged with care`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Small-group and tailor-made journeys across Morocco. Explore regions, itineraries and places, then plan your trip in four short steps.",
  applicationName: SITE_NAME,
  authors: [{ name: "Mukela Katungu" }],
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

// English content at launch; lang is set to en accordingly. Locale routing,
// dictionaries and hreflang provide the multilingual-ready surface.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "hsl(42 46% 98%)",
              border: "1px solid hsl(38 22% 84%)",
              color: "hsl(26 24% 12%)",
            },
          }}
        />
      </body>
    </html>
  );
}
