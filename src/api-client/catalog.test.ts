import { describe, expect, it } from 'vitest';
import { createBasketClient } from './basket';
import { createCatalog } from './catalog';
import { mockFetch, requestedUrl } from './test/fetch';

const storeProduct = {
  id: '6f1c1d2e-3b4a-4c5d-8e9f-0a1b2c3d4e5f',
  handle: 'silver-grey-porcelain-paving',
  title: 'Silver grey porcelain paving',
  subtitle: null,
  brand: null,
  description: null,
  thumbnail: '/uploads/a.jpg',
  images: [{ url: '/uploads/a.jpg', alt: 'Slabs' }],
  pageType: '1A',
  madeToMeasure: false,
  leadTime: { minDays: 10, maxDays: 15 },
  updatedAt: '2026-11-13T09:00:00.000Z',
  categories: [],
  options: [{ title: 'Size', values: ['600 × 600 mm'] }],
  colourChoice: null,
  variants: [
    {
      id: '7f1c1d2e-3b4a-4c5d-8e9f-0a1b2c3d4e5f',
      title: '600 × 600 mm',
      sku: 'POR-SLV-600',
      barcode: null,
      options: { Size: '600 × 600 mm' },
      pricePence: 8999,
      stock: { managed: true, quantity: 12, backorder: true },
      coverageM2: 1.44,
      weightKg: 70,
    },
  ],
};

describe('createCatalog', () => {
  it('turns pence into prices in pounds', async () => {
    const fetch = mockFetch(200, storeProduct);
    const product = await createCatalog({ baseUrl: 'http://api.test', fetch }).getProductByHandle(
      'silver-grey-porcelain-paving',
    );
    expect(product?.variants[0]?.priceIncVat).toEqual({ amount: 89.99, currencyCode: 'GBP' });
    expect(product?.images).toEqual([{ url: '/uploads/a.jpg', alt: 'Slabs' }]);
    expect(requestedUrl(fetch).pathname).toBe('/store/products/silver-grey-porcelain-paving');
  });

  it('returns null for an unknown product', async () => {
    const fetch = mockFetch(404, { message: 'No such product' });
    await expect(
      createCatalog({ baseUrl: 'http://api.test', fetch }).getProductByHandle('nope'),
    ).resolves.toBeNull();
  });

  it('sends the picked options when asking for colours', async () => {
    const fetch = mockFetch(200, null);
    await createCatalog({ baseUrl: 'http://api.test', fetch }).getColours('p1', {
      Finish: 'Powder Coated',
    });
    expect(requestedUrl(fetch).searchParams.get('selected[Finish]')).toBe('Powder Coated');
  });
});

describe('createBasketClient', () => {
  it('gives the API message back instead of throwing for a refused change', async () => {
    const fetch = mockFetch(422, { message: 'Choose a colour.' });
    const result = await createBasketClient({ baseUrl: 'http://api.test', fetch }).addItem(
      'b1',
      'v1',
      1,
    );
    expect(result).toEqual({ ok: false, message: 'Choose a colour.' });
  });
});
