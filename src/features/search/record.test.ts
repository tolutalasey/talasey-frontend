import { describe, expect, it } from 'vitest';
import { testProduct, testVariant as variant } from '@/test/products';
import { toSearchRecord } from './record';

const product = testProduct({
  handle: 'dellaora-lighting-extension-cable',
  title: 'Dellaora Lighting - Extension cable',
  categories: [{ handle: 'outdoor-living-outdoor-lighting', name: 'Outdoor Lighting' }],
  options: [{ title: 'Length', values: ['1 m', '2 m'] }],
  variants: [
    variant({ sku: 'DEX1', priceIncVat: { amount: 9.5, currencyCode: 'GBP' } }),
    variant({ sku: 'DEX2', stock: { managed: true, quantity: 4, backorder: false } }),
  ],
});

describe('toSearchRecord', () => {
  it('keeps what listings and facets need', () => {
    expect(toSearchRecord(product)).toMatchObject({
      brand: 'Dellaora Lighting',
      categories: ['outdoor-living-outdoor-lighting'],
      categoryNames: ['Outdoor Lighting'],
      options: { Length: ['1 m', '2 m'] },
      skus: ['DEX1', 'DEX2'],
      priceFrom: 9.5,
      hasOptions: true,
      availability: ['in-stock', 'made-to-order'],
    });
  });
});
