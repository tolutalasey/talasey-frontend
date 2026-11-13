import { expect, test } from '@playwright/test';

// An empty range still has its own title and canonical.
test('a filter URL is noindex and points its canonical at the clean range page', async ({
  page,
}) => {
  await page.goto('/fire-pits/?sort=price-low');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(new URL(canonical ?? '').pathname).toBe('/fire-pits/');
});

test('repeated form fields redirect to the one URL for that filter state', async ({ request }) => {
  const response = await request.get('/garden-screens/?sort=price-low&sort=relevance', {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(308);
});

test('an unknown range is a 404', async ({ page }) => {
  const response = await page.goto('/not-a-range/');
  expect(response?.status()).toBe(404);
});
