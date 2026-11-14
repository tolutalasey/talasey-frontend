import { expect, test, type Page } from '@playwright/test';
import { DEMO_PASSWORD } from '../fixtures/stack.ts';

const code = `TEST${Date.now().toString(36).toUpperCase()}`;

async function signIn(page: Page) {
  await page.goto('/admin/sign-in/');
  await page.getByRole('textbox', { name: 'Email' }).fill('catalogue@talasey.local');
  await page.getByRole('textbox', { name: 'Password' }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin\/$/);
}

async function fillBasket(page: Page) {
  await page.goto('/products/silver-grey-porcelain-paving/');
  await page.getByRole('spinbutton', { name: 'Packs' }).fill('2');
  await page.getByRole('button', { name: 'Add to basket' }).click();
  await expect(page).toHaveURL(/\/basket\/$/);
}

async function applyCode(page: Page, typed: string) {
  await page.getByRole('textbox', { name: 'Discount code' }).fill(typed);
  await page.getByRole('button', { name: 'Apply' }).click();
}

test.describe.configure({ mode: 'serial' });

test('staff add a discount code', async ({ page }) => {
  await signIn(page);
  await page.getByRole('link', { name: 'Promotions' }).click();
  const add = page.locator('form', { has: page.getByRole('heading', { name: 'Add a promotion' }) });
  await add.getByRole('textbox', { name: 'Name' }).fill(`Test ${code}`);
  await add.getByRole('textbox', { name: 'Code' }).fill(code.toLowerCase());
  await add.getByRole('textbox', { name: 'How much off' }).fill('10');
  await add.getByRole('button', { name: 'Add promotion' }).click();

  await expect(page.getByText(`Test ${code} added.`)).toBeVisible();
  const row = page.getByRole('row', { name: new RegExp(`Test ${code}`) });
  await expect(row).toContainText(code);
  await expect(row).toContainText('10% off products');
  await expect(row).toContainText('Running');
});

test('a shopper uses the code on the basket', async ({ page }) => {
  await fillBasket(page);

  await applyCode(page, 'NOT-A-CODE');
  await expect(page.getByRole('alert').filter({ hasText: 'code' })).toHaveText(
    "We don't recognise that code. Check it and try again.",
  );

  await applyCode(page, code.toLowerCase());
  await expect(page.getByRole('status').filter({ hasText: 'Code' })).toContainText(code);
  await expect(page.getByRole('term').filter({ hasText: `Discount: Test ${code}` })).toBeVisible();

  await page.getByRole('button', { name: 'Remove code' }).click();
  await expect(page.getByRole('textbox', { name: 'Discount code' })).toBeVisible();
  await expect(page.getByRole('term').filter({ hasText: 'Discount' })).toHaveCount(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('a wrong code says so and keeps what was typed', async ({ page }) => {
    await page.goto('/products/silver-grey-porcelain-paving/');
    await page.getByRole('spinbutton', { name: 'Packs' }).fill('1');
    await page.getByRole('button', { name: 'Add to basket' }).click();
    await expect(page).toHaveURL(/\/basket\/$/);

    await applyCode(page, 'WRONG-CODE');
    await expect(page.getByText("We don't recognise that code.")).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Discount code' })).toHaveValue('WRONG-CODE');

    await applyCode(page, code);
    await expect(
      page.getByRole('term').filter({ hasText: `Discount: Test ${code}` }),
    ).toBeVisible();
  });
});

test('staff remove the code', async ({ page }) => {
  await signIn(page);
  await page.goto('/admin/promotions/');
  await page.getByText(`Change Test ${code}`).click();
  await page.getByRole('button', { name: `Remove Test ${code}` }).click();
  await expect(page.getByText('Promotion removed.')).toBeVisible();
  await expect(page.getByRole('row', { name: new RegExp(`Test ${code}`) })).toHaveCount(0);
});
