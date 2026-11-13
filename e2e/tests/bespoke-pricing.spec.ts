import { expect, test } from '@playwright/test';
import { API_URL, DEMO_PASSWORD } from '../fixtures/stack.ts';

test('staff try a made-to-measure price, see a formula mistake explained, and save', async ({
  page,
  request,
}) => {
  const { token } = await (
    await request.post(`${API_URL}/auth/sign-in`, {
      data: { email: 'catalogue@talasey.local', password: DEMO_PASSWORD },
    })
  ).json();
  const products = await (
    await request.get(`${API_URL}/admin/products?search=Sienna`, {
      headers: { authorization: `Bearer ${token}` },
    })
  ).json();
  const sienna = products.find((product: { title: string }) => product.title === 'Sienna planter');

  await page.goto('/admin/sign-in/');
  await page.getByRole('textbox', { name: 'Email' }).fill('catalogue@talasey.local');
  await page.getByRole('textbox', { name: 'Password' }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin\/$/);

  await page.goto(`/admin/products/${sienna.id}/`);
  await page.getByRole('link', { name: /price formula and test calculator/ }).click();

  const test = page.getByRole('region', { name: 'Test calculator' });
  await test.getByRole('textbox', { name: 'Width (mm)' }).fill('1600');
  await test.getByRole('textbox', { name: 'Depth (mm)' }).fill('1600');
  await test.getByRole('textbox', { name: 'Height (mm)' }).fill('900');
  await test.getByRole('combobox', { name: 'Finish' }).selectOption('Mild steel');
  await page.getByRole('button', { name: 'Work out a test price' }).click();
  await expect(page.getByRole('status')).toHaveText(/Test price: £1,022\.43 inc VAT/);

  const formula = page.getByRole('textbox', { name: /^Formula/ });
  const original = await formula.inputValue();
  await formula.fill(`${original} * RATE`);
  await page.getByRole('button', { name: 'Work out a test price' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Fix these first' })).toContainText(
    'RATE',
  );
  await expect(page.getByRole('textbox', { name: /^Formula/ })).toHaveValue(`${original} * RATE`);

  await page.getByRole('textbox', { name: /^Formula/ }).fill(original);
  await page.getByRole('button', { name: 'Save pricing' }).click();
  await expect(page.getByRole('status')).toHaveText(/Saved/);
});
