import { expect, test, type Page } from '@playwright/test';
import { PRODUCT_PATH } from './pages.ts';

async function addOnePack(page: Page) {
  await page.goto(PRODUCT_PATH);
  await page.getByRole('spinbutton', { name: 'Packs' }).fill('1');
  await page.getByRole('button', { name: 'Add to basket' }).click();
  await expect(page).toHaveURL(/\/basket\/$/);
}

for (const javaScriptEnabled of [true, false]) {
  test.describe(javaScriptEnabled ? 'with JavaScript' : 'without JavaScript', () => {
    test.use({ javaScriptEnabled });

    test('packs go up and down, and a removed line can be put back', async ({ page }) => {
      await addOnePack(page);
      const items = page.getByRole('list', { name: 'Items in your bag' });
      const quantity = items.getByRole('status').first();

      await items.getByRole('button', { name: /^One more / }).click();
      await expect(quantity).toHaveText('2');
      await items.getByRole('button', { name: /^One fewer / }).click();
      await expect(quantity).toHaveText('1');

      await items
        .getByRole('button', { name: /^Remove / })
        .first()
        .click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your basket is empty');
      await expect(page.getByText(/^Removed /)).toBeVisible();

      await page.getByRole('button', { name: 'Undo' }).click();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your basket');
      await expect(page.getByRole('list', { name: 'Items in your bag' })).toBeVisible();
    });
  });
}
