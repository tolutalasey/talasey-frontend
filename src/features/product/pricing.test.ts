import { describe, expect, it } from 'vitest';
import { testVariant } from '@/test/products';
import { packPricing, packsFor } from './pricing';

describe('packPricing', () => {
  it('works out the price per m² from the pack price and coverage', () => {
    const variant = testVariant({
      priceIncVat: { amount: 59.99, currencyCode: 'GBP' },
      coverageM2: 1.44,
    });
    expect(packPricing(variant)).toEqual({
      perPack: { amount: 59.99, currencyCode: 'GBP' },
      coverageM2: 1.44,
      perM2: { amount: 41.66, currencyCode: 'GBP' },
    });
  });

  it('gives only the pack price when coverage is unknown, and nothing without a price', () => {
    expect(
      packPricing(testVariant({ priceIncVat: { amount: 10, currencyCode: 'GBP' } }))?.perM2,
    ).toBeNull();
    expect(packPricing(testVariant())).toBeNull();
  });
});

describe('packsFor', () => {
  it('rounds up to whole packs', () => {
    expect(packsFor(10, 1.44)).toBe(7);
    expect(packsFor(14.4, 1.44)).toBe(10);
  });

  it('adds the wastage allowance first', () => {
    expect(packsFor(14.4, 1.44, 10)).toBe(11);
  });

  it('needs a positive area and coverage', () => {
    expect(packsFor(0, 1.44)).toBe(0);
    expect(packsFor(5, 0)).toBe(0);
  });
});
