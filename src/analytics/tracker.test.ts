import { describe, expect, it, vi } from 'vitest';
import { noConsent, type ConsentState } from './consent';
import type { AnalyticsEvent } from './events';
import { createTracker } from './tracker';

const pageView: AnalyticsEvent = {
  name: 'page_view',
  params: { page_path: '/products/pavetuf', page_title: 'Pavetuf', page_type: 'product' },
};

function setup(consent: ConsentState) {
  const send = vi.fn();
  const track = createTracker({ getConsent: () => consent, send });
  return { send, track };
}

describe('track', () => {
  it('sends nothing until analytics consent is given', () => {
    const { send, track } = setup(noConsent);
    expect(track(pageView)).toBe('no-consent');
    expect(send).not.toHaveBeenCalled();
  });

  it('marketing consent alone is not enough', () => {
    const { send, track } = setup({ analytics: false, marketing: true });
    expect(track(pageView)).toBe('no-consent');
    expect(send).not.toHaveBeenCalled();
  });

  it('sends a valid event once analytics consent is given', () => {
    const { send, track } = setup({ analytics: true, marketing: false });
    expect(track(pageView)).toBe('sent');
    expect(send).toHaveBeenCalledWith(pageView);
  });

  it('drops events that fail the schema', () => {
    const { send, track } = setup({ analytics: true, marketing: false });
    const bad = { ...pageView, params: { ...pageView.params, page_path: 'no-slash' } };
    expect(track(bad)).toBe('invalid');
    expect(send).not.toHaveBeenCalled();
  });

  it('reads consent on every call, so a change applies straight away', () => {
    let consent: ConsentState = noConsent;
    const send = vi.fn();
    const track = createTracker({ getConsent: () => consent, send });

    expect(track(pageView)).toBe('no-consent');
    consent = { analytics: true, marketing: false };
    expect(track(pageView)).toBe('sent');
  });

  it('leaves server-side events to the server', () => {
    const { send, track } = setup({ analytics: true, marketing: true });
    expect(
      track({
        name: 'finance_approved',
        params: { transaction_id: 'order_1', value: 4000, currency: 'GBP' },
      }),
    ).toBe('server-only');
    expect(send).not.toHaveBeenCalled();
  });
});
