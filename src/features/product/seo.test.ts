import { describe, expect, it } from 'vitest';
import { testProduct, testVariant } from '@/test/products';
import { productDescription, productStructuredData } from './seo';

const grey = testVariant({
  id: 'v1',
  title: 'Grey',
  sku: 'PVT-GRY-15',
  options: { Colour: 'Grey' },
  priceIncVat: { amount: 41.5, currencyCode: 'GBP' },
});
const buff = testVariant({
  id: 'v2',
  title: 'Buff',
  sku: 'PVT-BUF-15',
  barcode: '5060000000017',
  options: { Colour: 'Buff' },
  priceIncVat: { amount: 39.99, currencyCode: 'GBP' },
  stock: { managed: true, quantity: 4, backorder: false },
});

const product = testProduct({
  handle: 'pavetuf-jointing-compound',
  title: 'Pavetuf jointing compound',
  brand: 'Pavetuf',
  description: 'Brush-in jointing compound for porcelain and natural stone patios.',
  variants: [grey, buff],
});

describe('productStructuredData', () => {
  it('describes the option the page opens on, with one Offer', () => {
    const [data] = productStructuredData(product, grey);
    expect(data).toMatchObject({
      '@type': 'Product',
      name: 'Pavetuf jointing compound',
      brand: { name: 'Pavetuf' },
      sku: 'PVT-GRY-15',
      mpn: 'PVT-GRY-15',
      color: 'Grey',
      offers: {
        price: '41.50',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/MadeToOrder',
      },
    });
  });

  it('uses the barcode as the GTIN instead of an MPN', () => {
    const [data] = productStructuredData(product, buff);
    expect(data).toMatchObject({
      gtin: '5060000000017',
      offers: { availability: 'https://schema.org/InStock' },
    });
    expect(data).not.toHaveProperty('mpn');
  });

  it('has no Offer for an option without a price', () => {
    const [data] = productStructuredData(product, testVariant({ sku: 'X' }));
    expect(data).not.toHaveProperty('offers');
  });
});

describe('productDescription', () => {
  it('keeps descriptions within 160 characters', () => {
    const long = { ...product, description: 'x'.repeat(400) };
    expect(productDescription(long)).toHaveLength(160);
  });
});
