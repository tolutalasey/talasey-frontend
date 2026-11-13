export type ConsentCategory = 'analytics' | 'marketing';

export type ConsentState = Readonly<Record<ConsentCategory, boolean>>;

export const noConsent: ConsentState = { analytics: false, marketing: false };
export const fullConsent: ConsentState = { analytics: true, marketing: true };

export function hasConsent(state: ConsentState, category: ConsentCategory): boolean {
  return state[category];
}

// Bump when the list of tools that set cookies changes, so everyone is asked again.
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 183;
export const CONSENT_COOKIE = 'talasey_consent';

export interface ConsentRecord {
  version: number;
  choices: ConsentState;
  decidedAt: string;
}

const DAY = 24 * 60 * 60 * 1000;

export function recordConsent(choices: ConsentState, now = new Date()): ConsentRecord {
  return { version: CONSENT_VERSION, choices, decidedAt: now.toISOString() };
}

export function needsAsking(record: ConsentRecord | null, now = new Date()): boolean {
  if (!record || record.version !== CONSENT_VERSION) return true;
  return now.getTime() - new Date(record.decidedAt).getTime() > CONSENT_MAX_AGE_DAYS * DAY;
}

export function serialiseConsent(record: ConsentRecord): string {
  const { analytics, marketing } = record.choices;
  return [record.version, Number(analytics), Number(marketing), record.decidedAt].join('.');
}

export function parseConsent(value: string | undefined): ConsentRecord | null {
  const match = /^(\d+)\.([01])\.([01])\.(.+)$/.exec(value ?? '');
  if (!match) return null;
  const [, version, analytics, marketing, decidedAt] = match;
  if (Number.isNaN(Date.parse(decidedAt ?? ''))) return null;
  return {
    version: Number(version),
    choices: { analytics: analytics === '1', marketing: marketing === '1' },
    decidedAt: decidedAt as string,
  };
}

// Google Consent Mode v2 in basic mode: everything that stores or sends data is denied until
// the visitor chooses, and no Google tag loads before then.
export type ConsentModeValue = 'granted' | 'denied';

export interface ConsentModeState {
  ad_storage: ConsentModeValue;
  ad_user_data: ConsentModeValue;
  ad_personalization: ConsentModeValue;
  analytics_storage: ConsentModeValue;
  functionality_storage: ConsentModeValue;
  personalization_storage: ConsentModeValue;
  security_storage: ConsentModeValue;
}

const granted = (yes: boolean): ConsentModeValue => (yes ? 'granted' : 'denied');

export function consentModeFor(state: ConsentState): ConsentModeState {
  return {
    ad_storage: granted(state.marketing),
    ad_user_data: granted(state.marketing),
    ad_personalization: granted(state.marketing),
    analytics_storage: granted(state.analytics),
    functionality_storage: 'granted',
    personalization_storage: granted(state.marketing),
    security_storage: 'granted',
  };
}

export const consentModeDefaults = consentModeFor(noConsent);
