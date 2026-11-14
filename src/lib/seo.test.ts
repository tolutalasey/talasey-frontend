import { describe, expect, it } from 'vitest';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  organizationJsonLd,
  pageMetadata,
  productJsonLd,
  serializeJsonLd,
  websiteJsonLd,
} from './seo';

describe('pageMetadata', () => {
  it('sets an absolute title, description, canonical and en_GB Open Graph', () => {
    const metadata = pageMetadata({ title: 'T', description: 'D', path: '/products/x' });
    expect(metadata.title).toEqual({ absolute: 'T' });
    expect(metadata.description).toBe('D');
    expect(metadata.alternates?.canonical).toBe('/products/x');
    expect(metadata.openGraph).toMatchObject({ locale: 'en_GB', url: '/products/x' });
  });

  it('shares the site photo unless the page has its own', () => {
    const plain = pageMetadata({ title: 'T', description: 'D', path: '/' });
    const own = pageMetadata({ title: 'T', description: 'D', path: '/', image: '/uploads/a.jpg' });
    expect(plain.openGraph?.images).toEqual([
      { url: '/images/brand/share.jpg', width: 1200, height: 630 },
    ]);
    expect(own.openGraph?.images).toEqual([{ url: '/uploads/a.jpg' }]);
  });
});

describe('breadcrumbJsonLd', () => {
  it('numbers items from 1 with absolute URLs', () => {
    const data = breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Pavetuf', path: '/products/pavetuf' },
    ]);
    expect(data.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'http://localhost:3000/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Pavetuf',
        item: 'http://localhost:3000/products/pavetuf',
      },
    ]);
  });
});

describe('productJsonLd', () => {
  const base = {
    name: 'Pavetuf jointing compound',
    description: 'Brush-in jointing.',
    path: '/products/pavetuf',
    brand: 'Pavetuf',
  };

  it('includes one Offer with a two-decimal GBP price', () => {
    const data = productJsonLd({
      ...base,
      sku: 'PVT-GRY-15',
      price: { amount: 39.9, currencyCode: 'GBP' },
    });
    expect(data).toMatchObject({
      '@type': 'Product',
      sku: 'PVT-GRY-15',
      brand: { '@type': 'Brand', name: 'Pavetuf' },
      offers: { '@type': 'Offer', price: '39.90', priceCurrency: 'GBP' },
    });
  });

  it('leaves out the Offer when there is no price', () => {
    expect(productJsonLd({ ...base, price: null })).not.toHaveProperty('offers');
  });
});

describe('serializeJsonLd', () => {
  it('cannot close the script tag', () => {
    expect(serializeJsonLd({ name: '</script><script>alert(1)</script>' })).not.toContain('<');
  });
});

describe('product offers', () => {
  const product = {
    name: 'Silver grey porcelain paving',
    description: 'Porcelain.',
    path: '/products/silver-grey-porcelain-paving/',
    brand: 'Talasey',
    price: { amount: 89.99, currencyCode: 'GBP' },
  };

  it('gives GTIN or MPN, colour, size and availability where the data has them', () => {
    expect(
      productJsonLd({
        ...product,
        mpn: 'POR-SLV-600',
        size: '600 × 600 mm',
        availability: 'InStock',
      }),
    ).toMatchObject({
      mpn: 'POR-SLV-600',
      size: '600 × 600 mm',
      offers: { availability: 'https://schema.org/InStock' },
    });
  });

  it('overrides the returns policy for made-to-measure items only', () => {
    expect(productJsonLd(product).offers).not.toHaveProperty('hasMerchantReturnPolicy');
    expect(productJsonLd({ ...product, returnable: false }).offers).toMatchObject({
      hasMerchantReturnPolicy: {
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      },
    });
  });
});

describe('site-wide data', () => {
  it('describes the business with its returns policy', () => {
    expect(organizationJsonLd()).toMatchObject({
      '@type': 'Organization',
      legalName: 'Talasey Ltd',
      hasMerchantReturnPolicy: { merchantReturnDays: 14, applicableCountry: 'GB' },
    });
  });

  it('gives the site a search action', () => {
    expect(websiteJsonLd().potentialAction.target.urlTemplate).toBe(
      'http://localhost:3000/search/?q={search_term_string}',
    );
  });
});

describe('collectionPageJsonLd', () => {
  it('lists the products shown, in order', () => {
    const data = collectionPageJsonLd({ name: 'Fire pits', path: '/fire-pits/' }, [
      { name: 'Sphere fire pit', path: '/products/sphere/' },
    ]);
    expect(data.mainEntity).toEqual({
      '@type': 'ItemList',
      numberOfItems: 1,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Sphere fire pit',
          url: 'http://localhost:3000/products/sphere/',
        },
      ],
    });
  });
});

describe('articleJsonLd', () => {
  it('names the author and dates the guide', () => {
    expect(
      articleJsonLd({
        headline: 'How to joint a patio',
        description: 'Steps.',
        path: '/guides/how-to-joint-a-patio/',
        author: { name: 'Sam Patel', isPerson: true },
        datePublished: '2026-11-13',
      }),
    ).toMatchObject({
      author: { '@type': 'Person', name: 'Sam Patel' },
      datePublished: '2026-11-13',
      dateModified: '2026-11-13',
    });
  });
});
