import Link from "next/link";
import { ZelligeWordmark } from "@/components/site/brand";

// Wrapped by the root layout (which provides html/body).
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <ZelligeWordmark size={26} />
      <p className="eyebrow mt-10">404</p>
      <h1 className="serif mt-2 text-[2.4rem] font-semibold tracking-[-0.02em]">We could not find that page</h1>
      <p className="mt-3 max-w-md text-muted-foreground">The page may have moved, or the link may be incomplete.</p>
      <Link href="/en" className="btn btn--primary mt-8">Back to home</Link>
    </main>
  );
}
