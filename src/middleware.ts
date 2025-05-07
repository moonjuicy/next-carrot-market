import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import getSession from "./lib/session";

const publicOnlyUrls = ["/", "/login", "/sms", "/create-account", "/github/start", "/github/complete"];
const supportedLocales = ["en", "ko"];

function detectLocale(request: NextRequest) {
  const acceptLang = request.headers.get("accept-language");
  if (!acceptLang) return "en";

  const preferred = acceptLang.split(",")[0].split("-")[0];
  return supportedLocales.includes(preferred) ? preferred : "en";
}

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocalePrefix = /^\/(en|ko)(\/|$)/.test(pathname);

  if (!hasLocalePrefix) {
    const detected = detectLocale(request);
    return NextResponse.redirect(new URL(`/${detected}${pathname}`, request.url));
  }

  const session = await getSession();
  const strippedPath = pathname.replace(/^\/(en|ko)/, "") || "/";
  const isPublicOnly = publicOnlyUrls.includes(strippedPath);

  if (!session.id && !isPublicOnly) {
    return NextResponse.redirect(new URL(`/${pathname.split("/")[1]}/`, request.url));
  }

  if (session.id && isPublicOnly) {
    return NextResponse.redirect(new URL(`/${pathname.split("/")[1]}/products`, request.url));
  }
  
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - static files
    // - _next internal routes
    // - all files in the public folder
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};