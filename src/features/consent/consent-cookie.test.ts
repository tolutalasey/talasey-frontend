import { recordConsent } from '@/analytics';
import { describe, expect, it } from 'vitest';
import { consentCookie, readConsentCookie } from './consent-cookie';
import { consentDefaultsScript } from './consent-mode';

const record = recordConsent(
  { analytics: true, marketing: false },
  new Date('2026-11-13T09:00:00Z'),
);

describe('the consent cookie', () => {
  it('is first-party, lasts 6 months and is only sent over HTTPS outside local runs', () => {
    expect(consentCookie(record, true)).toBe(
      'talasey_consent=1.1.0.2026-11-13T09%3A00%3A00.000Z; Max-Age=15811200; Path=/; SameSite=Lax; Secure',
    );
    expect(consentCookie(record, false)).not.toContain('Secure');
  });

  it('reads back the choice among other cookies', () => {
    const cookies = `talasey_basket=cart_1; ${consentCookie(record, false).split(';')[0]}; other=1`;
    expect(readConsentCookie(cookies)).toEqual(record);
    expect(readConsentCookie('talasey_basket=cart_1')).toBeNull();
  });
});

describe('the Consent Mode defaults script', () => {
  it('denies analytics and ads before any tag can load', () => {
    const dataLayer: unknown[] = [];
    new Function('window', consentDefaultsScript)({ dataLayer });
    expect(dataLayer).toEqual([
      [
        'consent',
        'default',
        expect.objectContaining({
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          wait_for_update: 500,
        }),
      ],
    ]);
  });
});
