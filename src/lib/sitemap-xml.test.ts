import { describe, expect, it } from 'vitest';
import { latest, sitemapIndexXml, urlSetXml } from './sitemap-xml';

describe('sitemap XML', () => {
  it('lists URLs with lastmod only where the date is known, escaped', () => {
    expect(
      urlSetXml([
        { url: 'https://talasey.co.uk/fire-pits/', lastModified: '2026-11-13T07:00:00.000Z' },
        { url: 'https://talasey.co.uk/search/?q=a&b' },
      ]),
    ).toBe(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        '<url><loc>https://talasey.co.uk/fire-pits/</loc><lastmod>2026-11-13T07:00:00.000Z</lastmod></url>' +
        '<url><loc>https://talasey.co.uk/search/?q=a&amp;b</loc></url></urlset>',
    );
  });

  it('writes an index of sitemaps', () => {
    expect(sitemapIndexXml([{ url: 'https://talasey.co.uk/sitemaps/products.xml' }])).toContain(
      '<sitemap><loc>https://talasey.co.uk/sitemaps/products.xml</loc></sitemap>',
    );
  });

  it('picks the newest date', () => {
    expect(latest(['2026-01-01', null, '2026-11-13', '2026-03-01'])).toBe('2026-11-13');
    expect(latest([null])).toBeNull();
  });
});
