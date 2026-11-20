import { describe, expect, it } from 'vitest';
import { isAvailable, isInStock, lowestPrice, type Product, type ProductVariant } from './product';

const product = (prices: (number | null)[]): Product => ({
  id: 'p',
  handle: 'p',
  title: 'P',
  subtitle: null,
  brand: null,
  description: null,
  thumbnail: null,
  madeToMeasure: false,
  measurements: null,
  sellOnline: true,
  offlineAction: 'stockist',
  pageType: null,
  updatedAt: null,
  categories: [],
  options: [],
  colourChoice: null,
  variants: prices.map((amount, i) => ({
    ...variant(),
    id: `v${i}`,
    title: `V${i}`,
    priceIncVat: amount === null ? null : { amount, currencyCode: 'GBP' },
  })),
});

function variant(stock: Partial<ProductVariant['stock']> = {}): ProductVariant {
  return {
    id: 'v',
    title: 'V',
    sku: null,
    barcode: null,
    options: {},
    priceIncVat: null,
    stock: { managed: false, quantity: null, backorder: false, ...stock },
    coverageM2: null,
    weightKg: null,
    thumbnail: null,
  };
}

describe('lowestPrice', () => {
  it('picks the cheapest priced variant', () => {
    expect(lowestPrice(product([41.5, 39.99, null]))).toEqual({
      amount: 39.99,
      currencyCode: 'GBP',
    });
  });

  it('is null when nothing is priced', () => {
    expect(lowestPrice(product([null]))).toBeNull();
    expect(lowestPrice(product([]))).toBeNull();
  });
});

describe('stock', () => {
  it('treats made-to-order variants as available but not in stock', () => {
    expect(isAvailable(variant())).toBe(true);
    expect(isInStock(variant())).toBe(false);
  });

  it('counts stocked variants by quantity', () => {
    expect(isInStock(variant({ managed: true, quantity: 3 }))).toBe(true);
    expect(isAvailable(variant({ managed: true, quantity: 0 }))).toBe(false);
    expect(isAvailable(variant({ managed: true, quantity: 0, backorder: true }))).toBe(true);
  });
});
