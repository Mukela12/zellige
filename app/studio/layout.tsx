import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operator console",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh">{children}</div>;
}
