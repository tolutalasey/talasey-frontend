import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_DAYS,
  parseConsent,
  serialiseConsent,
  type ConsentRecord,
} from '@/analytics/consent';

// First-party and readable by the page, since the choice is made and used in the browser.
export function readConsentCookie(cookies = document.cookie): ConsentRecord | null {
  const value = cookies
    .split('; ')
    .find((cookie) => cookie.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);
  return parseConsent(value ? decodeURIComponent(value) : undefined);
}

export function consentCookie(record: ConsentRecord, secure: boolean): string {
  return [
    `${CONSENT_COOKIE}=${encodeURIComponent(serialiseConsent(record))}`,
    `Max-Age=${CONSENT_MAX_AGE_DAYS * 24 * 60 * 60}`,
    'Path=/',
    'SameSite=Lax',
    ...(secure ? ['Secure'] : []),
  ].join('; ');
}

const listeners = new Set<() => void>();

export function subscribeToConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function saveConsent(record: ConsentRecord, secure: boolean) {
  document.cookie = consentCookie(record, secure);
  for (const listener of listeners) listener();
}
