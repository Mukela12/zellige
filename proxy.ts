import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

// Next.js 16 middleware (renamed to `proxy`). Ensures every public route is
// locale-prefixed: bare paths redirect to the default locale. hreflang +
// canonical are emitted per page, so the redirect keeps one canonical URL
// per locale.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip api, assets, studio, and any file with an extension.
  matcher: ["/((?!api|studio|_next/static|_next/image|images|animations|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
