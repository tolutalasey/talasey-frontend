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

export { packsFor } from '@/lib/coverage';
