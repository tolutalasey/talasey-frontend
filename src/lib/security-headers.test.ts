import { describe, expect, it } from 'vitest';
import { securityHeaders } from './security-headers';

describe('securityHeaders', () => {
  it('sets the baseline headers from PRD section 17', () => {
    const headers = securityHeaders('production');
    expect(headers['Strict-Transport-Security']).toContain('preload');
    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(headers['Content-Security-Policy']).not.toContain('unsafe-eval');
  });

  it('only lets production be indexed', () => {
    expect(securityHeaders('production')).not.toHaveProperty('X-Robots-Tag');
    for (const appEnv of ['development', 'preview', 'staging'] as const) {
      expect(securityHeaders(appEnv)['X-Robots-Tag']).toBe('noindex, nofollow');
    }
  });

  it('allows eval only for the dev server', () => {
    expect(securityHeaders('development', { isDev: true })['Content-Security-Policy']).toContain(
      'unsafe-eval',
    );
  });

  it('lets Stripe load its card fields only when card payments are on', () => {
    const off = securityHeaders('production')['Content-Security-Policy'];
    const on = securityHeaders('production', { cardPayments: true })['Content-Security-Policy'];
    expect(off).not.toContain('stripe.com');
    expect(off).not.toContain('frame-src');
    expect(on).toContain("script-src 'self' 'unsafe-inline' https://js.stripe.com");
    expect(on).toContain("connect-src 'self' https://api.stripe.com");
    expect(on).toContain('frame-src https://js.stripe.com https://*.js.stripe.com https://hooks');
  });
});
