import { expect, test } from '@playwright/test';
import { DEMO_PASSWORD, PRODUCT_HANDLE } from '../fixtures/stack.ts';

test('a visitor orders free samples, and staff mark them as sent', async ({ page }) => {
  const run = Date.now().toString(36);
  await page.goto(`/products/${PRODUCT_HANDLE}/`);
  await page.getByRole('button', { name: 'Order a free sample: Grey' }).click();
  await expect(page).toHaveURL(/\/samples\/$/);
  await expect(page.getByRole('heading', { name: 'Your samples (1 of 5)' })).toBeVisible();

  await page.getByRole('button', { name: /Add sample: Silver grey porcelain paving/ }).click();
  await expect(page.getByRole('heading', { name: 'Your samples (2 of 5)' })).toBeVisible();

  const request = page.getByRole('region', { name: 'Where should we send them?' });
  await request.getByRole('textbox', { name: 'Email' }).fill(`samples-${run}@example.com`);
  await request.getByRole('textbox', { name: 'First name' }).fill('Sam');
  await request.getByRole('textbox', { name: 'Last name' }).fill(`Ples ${run}`);
  await request.getByRole('textbox', { name: 'Address' }).fill('1 Piccadilly');
  await request.getByRole('textbox', { name: 'Town or city' }).fill('Manchester');
  await request.getByRole('textbox', { name: 'Postcode' }).fill('M1 1AE');
  await expect(request.getByRole('checkbox', { name: /Email me ideas/ })).not.toBeChecked();
  await request.getByRole('button', { name: 'Send my free samples' }).click();

  await expect(page).toHaveURL(/\/samples\/thanks\/\?request=S\d+/);
  const reference = new URL(page.url()).searchParams.get('request');
  await page.goto('/samples/');
  await expect(page.getByRole('heading', { name: 'Your samples (0 of 5)' })).toBeVisible();

  await page.goto('/admin/sign-in/');
  await page.getByRole('textbox', { name: 'Email' }).fill('catalogue@talasey.local');
  await page.getByRole('textbox', { name: 'Password' }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin\/$/);
  await page.getByRole('link', { name: 'Samples' }).click();
  const row = page.getByRole('row', { name: new RegExp(`${reference}\\b`) });
  await expect(row).toContainText('Pavetuf jointing compound: Grey');
  await row.getByRole('button', { name: 'Mark as sent' }).click();
  await expect(page.getByText('Marked as sent.')).toBeVisible();
  await expect(page.getByRole('row', { name: new RegExp(`${reference}\\b`) })).toHaveCount(0);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the request form explains what to fix and keeps what was typed', async ({ page }) => {
    await page.goto(`/products/${PRODUCT_HANDLE}/`);
    await page.getByRole('button', { name: 'Order a free sample: Buff' }).click();
    const request = page.getByRole('region', { name: 'Where should we send them?' });
    await request.getByRole('textbox', { name: 'Email' }).fill('not an email');
    await request.getByRole('textbox', { name: 'Postcode' }).fill('75001');
    await request.getByRole('button', { name: 'Send my free samples' }).click();
    await expect(page.getByText('Enter an email address like name@example.com')).toBeVisible();
    await expect(page.getByText('Enter a UK postcode, like M1 1AE')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Postcode' })).toHaveValue('75001');
  });
});
