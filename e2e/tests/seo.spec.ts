import { expect, test } from '@playwright/test';
import { indexablePages } from './pages.ts';
import { expectValidStructuredData, structuredData } from './structured-data.ts';

for (const { name, path } of indexablePages) {
  test.describe(`SEO: ${name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path);
    });

    test('has exactly one H1', async ({ page }) => {
      await expect(page.locator('h1')).toHaveCount(1);
    });

    test('title is 30–60 characters', async ({ page }) => {
      const title = await page.title();
      expect(title.length).toBeGreaterThanOrEqual(30);
      expect(title.length).toBeLessThanOrEqual(60);
    });

    test('meta description is 70–160 characters', async ({ page }) => {
      const description =
        (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
      expect(description.length).toBeGreaterThanOrEqual(70);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    test('has one absolute canonical pointing at itself', async ({ page }) => {
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      const href = (await canonical.getAttribute('href')) ?? '';
      expect(new URL(href).pathname).toBe(path);
    });

    test('declares en-GB', async ({ page }) => {
      await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
    });

    test('has valid structured data for the business, the site and its breadcrumbs', async ({
      page,
    }) => {
      const data = await structuredData(page);
      expectValidStructuredData(data);
      const types = data.map((item) => item['@type']);
      expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite']));
      if (path !== '/') {
        expect(types.filter((type) => type === 'BreadcrumbList')).toHaveLength(1);
        await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
      }
    });
  });
}

test('sitemaps are split by type and never list filter or search URLs', async ({ request }) => {
  const index = await (await request.get('/sitemap.xml')).text();
  expect(index).toContain('/sitemaps/pages.xml');
  for (const [, file] of index.matchAll(/<loc>[^<]*(\/sitemaps\/[a-z]+\.xml)<\/loc>/g)) {
    const xml = await (await request.get(file ?? '')).text();
    expect(xml).toContain('<urlset');
    expect(xml).not.toMatch(/<loc>[^<]*\?/);
    expect(xml).not.toContain('/search/');
  }
});

test('publishes llms.txt', async ({ request }) => {
  const response = await request.get('/llms.txt');
  expect(response.headers()['content-type']).toContain('text/markdown');
  expect(await response.text()).toMatch(/^# Talasey/);
});

test('non-production environments are not indexable', async ({ request }) => {
  test.skip(process.env.APP_ENV === 'production', 'Production must be indexable');

  const response = await request.get('/');
  expect(response.headers()['x-robots-tag']).toBe('noindex, nofollow');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toMatch(/Disallow: \/\s*$/m);
});

test('sends the security headers', async ({ request }) => {
  const headers = (await request.get('/')).headers();
  expect(headers['strict-transport-security']).toContain('max-age=');
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(headers['x-powered-by']).toBeUndefined();
});
