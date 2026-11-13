import { expect, test, type Locator } from '@playwright/test';
import { hasCatalogue } from '../fixtures/stack.ts';

// PRD section 6 journey targets, against the imported master sheet.
test.skip(!hasCatalogue, 'Copy the product master sheet to .data/pim to run these');

function clickCounter() {
  let total = 0;
  return {
    async click(target: Locator) {
      total += 1;
      await target.click();
    },
    get total() {
      return total;
    },
  };
}

test('find a product from the homepage in three clicks', async ({ page }) => {
  const clicks = clickCounter();
  await page.goto('/');

  await clicks.click(page.getByText('Shop by product'));
  await clicks.click(
    page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fire pits' }),
  );
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fire pits');
  await clicks.click(page.getByRole('link', { name: 'Sphere Fire Pit with Stand' }));

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sphere Fire Pit with Stand');
  expect(clicks.total).toBeLessThanOrEqual(3);
});

test('find a product with one search, from the suggestions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search products' }).click();
  const search = page.getByRole('combobox', { name: 'Search products' });
  await search.fill('sphere fire');
  await page.getByRole('option', { name: /Sphere Fire Pit with Stand/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sphere Fire Pit with Stand');
});

test('search results forgive typos and understand other words for things', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search products' }).click();
  await page.getByRole('combobox', { name: 'Search products' }).fill('decorativ sceen');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/search\/\?q=decorativ(%20|\+)sceen/);
  await expect(page.getByRole('status').filter({ hasText: 'products' })).toHaveText('19 products');

  await page.goto('/search/?q=firepit');
  await expect(
    page.getByRole('list', { name: 'Search results' }).getByRole('link').first(),
  ).toContainText('Fire Pit');
});

test('a search with no results suggests ranges and offers help', async ({ page }) => {
  await page.goto('/search/?q=trampoline');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(
    'No products match “trampoline”',
  );
  await expect(page.getByRole('link', { name: 'Garden screens' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'ask us' })).toHaveAttribute('href', '/contact/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
});

test('filter a range and open a product', async ({ page }) => {
  await page.goto('/garden-screens/');
  const status = page.getByRole('status').filter({ hasText: 'products' });
  await expect(status).toHaveText('19 products');

  await page.getByRole('checkbox', { name: /Powder Coated/ }).check();
  await expect(page).toHaveURL('/garden-screens/powder-coated/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Powder-coated garden screens');
  await expect(status).toHaveText('18 products');

  await page.getByRole('checkbox', { name: /1800 × 900 mm/ }).check();
  await expect(page).toHaveURL('/garden-screens/?finish=powder-coated&size=1800-x-900-mm');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.getByRole('list', { name: 'Filters applied' })).toContainText(
    'Size: 1800 × 900 mm',
  );

  const first = page
    .getByRole('list', { name: 'Decorative garden screens' })
    .getByRole('link')
    .first();
  const name = await first.textContent();
  await first.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(name ?? '');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('searches from the header with the first results in the page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('searchbox', { name: 'Search products' }).fill('palm frond');
    await page.getByRole('searchbox', { name: 'Search products' }).press('Enter');
    await expect(page.getByRole('list', { name: 'Search results' })).toContainText(
      'Palm Frond Decorative Screen',
    );
  });

  test('filters with the Show results button', async ({ page }) => {
    await page.goto('/fire-pits/');
    await page.getByText('Filter and sort').click();
    await page.getByLabel('Sort by').selectOption('price-high');
    await page.getByRole('button', { name: 'Show results' }).click();
    await expect(page).toHaveURL('/fire-pits/?sort=price-high');
    const names = await page
      .getByRole('list', { name: 'Fire pits' })
      .getByRole('heading')
      .allTextContents();
    expect(names[0]).toBe('Fire Pit Steel Liner and Heat Deflector');
    expect(names.at(-1)).toMatch(/Natural Stone Handcut Fire Pit/);
  });
});
