import { describe, expect, it } from 'vitest';
import { formatDay, formatPrice } from './format';

describe('formatPrice', () => {
  it('formats pounds the UK way', () => {
    expect(formatPrice({ amount: 39.99, currencyCode: 'GBP' })).toBe('£39.99');
    expect(formatPrice({ amount: 1250, currencyCode: 'GBP' })).toBe('£1,250.00');
  });
});

describe('formatDay', () => {
  it('names the day without a time zone shift', () => {
    expect(formatDay('2026-11-17')).toBe('Tuesday 17 November');
  });
});
