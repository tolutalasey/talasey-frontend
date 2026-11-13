import type { Price, ProductVariant } from '@/api-client';

export interface PackPricing {
  perPack: Price;
  coverageM2: number | null;
  perM2: Price | null;
}

// Paving is sold in packs; when a pack's coverage is known the page shows the price per m² too.
export function packPricing(variant: ProductVariant): PackPricing | null {
  const price = variant.priceIncVat;
  if (!price) return null;
  const coverage = variant.coverageM2;
  return {
    perPack: price,
    coverageM2: coverage,
    perM2: coverage
      ? {
          amount: Math.round((price.amount / coverage) * 100) / 100,
          currencyCode: price.currencyCode,
        }
      : null,
  };
}

// Whole packs to cover an area, with the product's allowance for cuts and breakages.
export function packsFor(areaM2: number, coverageM2: number, wastagePercent = 0): number {
  if (areaM2 <= 0 || coverageM2 <= 0) return 0;
  const needed = (areaM2 * (100 + wastagePercent)) / 100;
  return Math.ceil(Math.round((needed / coverageM2) * 1e6) / 1e6);
}
