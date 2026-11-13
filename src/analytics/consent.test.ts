import { describe, expect, it } from 'vitest';
import {
  CONSENT_VERSION,
  consentModeDefaults,
  consentModeFor,
  needsAsking,
  parseConsent,
  recordConsent,
  serialiseConsent,
} from './consent';

const now = new Date('2026-11-13T09:00:00Z');

describe('Consent Mode v2', () => {
  it('denies everything that stores or sends data by default', () => {
    expect(consentModeDefaults).toEqual({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
      security_storage: 'granted',
    });
  });

  it('grants analytics and advertising separately', () => {
    expect(consentModeFor({ analytics: true, marketing: false })).toMatchObject({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
    });
    expect(consentModeFor({ analytics: false, marketing: true })).toMatchObject({
      analytics_storage: 'denied',
      ad_storage: 'granted',
      ad_personalization: 'granted',
    });
  });
});

describe('the consent record', () => {
  const record = recordConsent({ analytics: true, marketing: false }, now);

  it('round-trips through the cookie', () => {
    expect(parseConsent(serialiseConsent(record))).toEqual(record);
  });

  it('ignores a missing or tampered cookie', () => {
    expect(parseConsent(undefined)).toBeNull();
    expect(parseConsent('yes please')).toBeNull();
    expect(parseConsent('1.1.1.not-a-date')).toBeNull();
  });

  it('asks on the first visit, after 6 months, and when the tools change', () => {
    expect(needsAsking(null, now)).toBe(true);
    expect(needsAsking(record, new Date('2027-01-13T09:00:00Z'))).toBe(false);
    expect(needsAsking(record, new Date('2027-05-20T09:00:00Z'))).toBe(true);
    expect(needsAsking({ ...record, version: CONSENT_VERSION + 1 }, now)).toBe(true);
  });
});
