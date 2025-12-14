
import { NextRequest, NextResponse } from 'next/server';

// This middleware is now disabled as the app is single-language.
// It will simply pass through all requests without modification.

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // This matcher is no longer active but kept for reference.
    // '/((?!_next|api|assets|favicon.ico|sw.js|admin|.*\\..*).*)'
  ],
};
