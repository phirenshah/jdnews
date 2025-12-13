import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'gu'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');

  if (acceptLanguage) {
    const browserLanguages = acceptLanguage.split(',').map((lang) => lang.split(';')[0].toLowerCase().trim());
    for (const lang of browserLanguages) {
      if (locales.includes(lang)) {
        return lang;
      }
      const genericLang = lang.split('-')[0];
      if (locales.includes(genericLang)) {
        return genericLang;
      }
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|assets|favicon.ico|sw.js|admin).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};
