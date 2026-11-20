import type { Product, ProductVariant } from '@/api-client';

export function testVariant(overrides: Partial<ProductVariant> = {}): ProductVariant {
  return {
    id: 'variant',
    title: 'Default',
    sku: null,
    barcode: null,
    options: {},
    priceIncVat: null,
    stock: { managed: false, quantity: null, backorder: false },
    coverageM2: null,
    weightKg: null,
    thumbnail: null,
    ...overrides,
  };
}

export function testProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod_1',
    handle: 'product',
    title: 'Product',
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
    variants: [testVariant()],
    ...overrides,
  };
}
