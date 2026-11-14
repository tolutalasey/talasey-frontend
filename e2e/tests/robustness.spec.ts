import { expect, test } from '@playwright/test';
import { PRODUCT_PATH } from './pages.ts';

test('a basket cookie from an older site is ignored and a new basket starts', async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: 'talasey_basket', value: 'cart_01JOLDMEDUSA', url: 'http://localhost:3000' },
  ]);
  await page.goto(PRODUCT_PATH);
  await page.getByRole('button', { name: 'Add to basket' }).click();
  await expect(page).toHaveURL(/\/basket\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('Escape closes the open header menu and returns focus to its button', async ({ page }) => {
  await page.goto('/');
  const menuButton = page.getByRole('navigation', { name: 'Main' }).getByText('Shop by product');
  await menuButton.click();
  const menu = page.getByRole('navigation', { name: 'Main' }).getByRole('link', {
    name: 'Planters',
  });
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(menuButton).toBeFocused();
});

test('only one header menu is open at a time, and a click elsewhere closes it', async ({
  page,
}) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  await nav.getByText('Shop by product').click();
  await nav.getByText('Shop by project').click();
  await expect(nav.getByRole('link', { name: 'Planters' })).toBeHidden();
  await page.getByRole('contentinfo').click({ position: { x: 5, y: 5 } });
  await expect(nav.locator('details[open]')).toHaveCount(0);
});

test('moving the mouse over the search box does not take focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Search products' }).hover();
  await expect(page.getByRole('combobox', { name: 'Search products' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Search products' })).not.toBeFocused();
});

test('the contact form names what to fix and moves focus to the first field', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Enter your name')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Your name' })).toBeFocused();
});
