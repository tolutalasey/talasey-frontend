import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { withoutFeedback } from '@/lib/feedback-cookie';
import { paymentMode } from '@/lib/payment';
import { publishedContent } from '@/lib/content';
import { cachedRedirectLookup, redirectSource, type RedirectSource } from '@/lib/redirects';
import { securityHeaders } from '@/lib/security-headers';

// The admin and the content editor are for staff only and never appear in search results.
export const isStaffPath = (pathname: string) => /^\/(admin|content)(\/|$)/.test(pathname);

export function createProxy(source: RedirectSource, headers: Record<string, string>) {
  const findRedirect = cachedRedirectLookup(source);

  return async function handle(request: NextRequest): Promise<NextResponse> {
    const redirect = await findRedirect(request.nextUrl.pathname);
    const response = redirect
      ? NextResponse.redirect(
          new URL(redirect.to + request.nextUrl.search, request.url),
          redirect.permanent ? 301 : 302,
        )
      : withoutFeedback(request);
    for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
    if (isStaffPath(request.nextUrl.pathname)) {
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }
    return response;
  };
}

const handle = createProxy(
  redirectSource(() => publishedContent('redirect')),
  securityHeaders(env.APP_ENV, {
    isDev: process.env.NODE_ENV === 'development',
    cardPayments: paymentMode(env).kind === 'card',
  }),
);

export function proxy(request: NextRequest) {
  return handle(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
