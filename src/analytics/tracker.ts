import { hasConsent, type ConsentState } from './consent';
import { analyticsEvent, serverOnlyEvents, type AnalyticsEvent } from './events';

export type TrackResult = 'sent' | 'no-consent' | 'invalid' | 'server-only';

export interface TrackerOptions {
  getConsent: () => ConsentState;
  send: (event: AnalyticsEvent) => void;
}

export function createTracker({ getConsent, send }: TrackerOptions) {
  return function track(event: AnalyticsEvent): TrackResult {
    if (serverOnlyEvents.has(event.name)) return 'server-only';
    if (!hasConsent(getConsent(), 'analytics')) return 'no-consent';

    const parsed = analyticsEvent.safeParse(event);
    if (!parsed.success) return 'invalid';

    send(parsed.data);
    return 'sent';
  };
}
