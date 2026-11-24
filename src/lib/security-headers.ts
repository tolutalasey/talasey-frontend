import type { Env } from './env';

export interface HeaderOptions {
  isDev?: boolean;
  cardPayments?: boolean;
}

const STRIPE_SCRIPTS = 'https://js.stripe.com https://*.js.stripe.com';
// Videos play from YouTube's privacy-enhanced player.
const VIDEO_PLAYER = 'https://www.youtube-nocookie.com';

function contentSecurityPolicy({ isDev = false, cardPayments = false }: HeaderOptions): string {
  const stripe = (sources: string) => (cardPayments ? ` ${sources}` : '');
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${stripe(STRIPE_SCRIPTS)}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://talasey.co.uk",
    "font-src 'self'",
    `connect-src 'self'${stripe('https://api.stripe.com')}`,
    `frame-src 'self' ${VIDEO_PLAYER}${stripe(`${STRIPE_SCRIPTS} https://hooks.stripe.com`)}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // Only the site's own pages may frame it: the content editor shows its live preview this way.
    "frame-ancestors 'self'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

export function securityHeaders(
  appEnv: Env['APP_ENV'],
  options: HeaderOptions = {},
): Record<string, string> {
  return {
    'Content-Security-Policy': contentSecurityPolicy(options),
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(self), geolocation=(), payment=(self)',
    ...(appEnv !== 'production' && { 'X-Robots-Tag': 'noindex, nofollow' }),
  };
}
