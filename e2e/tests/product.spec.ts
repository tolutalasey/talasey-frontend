import { expect, test, type Page } from '@playwright/test';
import { PRODUCT_PATH } from './pages.ts';

async function jsonLd(page: Page): Promise<Record<string, unknown>[]> {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
  return scripts.map((text) => JSON.parse(text) as Record<string, unknown>);
}

test.describe('product page', () => {
  test('shows the VAT-inclusive price in pounds', async ({ page }) => {
    await page.goto(PRODUCT_PATH);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pavetuf jointing compound');
    await expect(page.getByTestId('product-price')).toHaveText('£39.99 inc. VAT');
    await expect(page.getByRole('table', { name: 'Options and prices' })).toContainText('£42.50');
  });

  test('?colour= opens on that colour and keeps the clean URL as canonical', async ({ page }) => {
    await page.goto(`${PRODUCT_PATH}?colour=buff`);
    await expect(page.getByRole('link', { name: 'Buff' })).toHaveAttribute('aria-current', 'true');
    await expect(page.getByTestId('product-price')).toHaveText('£42.50 inc. VAT');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(new URL(canonical ?? '').pathname).toBe(PRODUCT_PATH);
  });

  test('has valid Product and BreadcrumbList JSON-LD in the server HTML', async ({
    page,
    request,
  }) => {
    const html = await (await request.get(PRODUCT_PATH)).text();
    expect(html).toContain('application/ld+json');

    await page.goto(PRODUCT_PATH);
    const data = await jsonLd(page);
    const product = data.find((item) => item['@type'] === 'Product');
    const breadcrumbs = data.find((item) => item['@type'] === 'BreadcrumbList');

    expect(product).toMatchObject({
      '@context': 'https://schema.org',
      name: 'Pavetuf jointing compound',
      brand: { '@type': 'Brand', name: 'Pavetuf' },
      mpn: 'PVT-GRY-15',
      color: 'Grey',
      offers: {
        '@type': 'Offer',
        price: '39.99',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/MadeToOrder',
        itemCondition: 'https://schema.org/NewCondition',
      },
    });
    expect(new URL(String(product?.url)).pathname).toBe(PRODUCT_PATH);
    expect(breadcrumbs).toMatchObject({
      itemListElement: [
        { position: 1, name: 'Home' },
        { position: 2, name: 'Paving jointing' },
        { position: 3, name: 'Pavetuf jointing compound' },
      ],
    });
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toContainText(
      'Paving jointing',
    );
  });

  test('an unknown product returns a 404 with helpful links', async ({ page }) => {
    const response = await page.goto('/products/does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/can.t find that page/i);
    await expect(page.getByRole('link', { name: 'Go to the homepage' })).toBeVisible();
  });
});
