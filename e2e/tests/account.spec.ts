import { expect, test } from '@playwright/test';
import { API_URL, DEMO_PASSWORD } from '../fixtures/stack.ts';
import { codeFor } from '../fixtures/totp.ts';

const PASSWORD = 'a long enough password';

test('a member of staff turns on two-factor, then signs in with a code', async ({
  page,
  request,
}) => {
  const email = `two-factor-${Date.now().toString(36)}@talasey.local`;
  const owner = await request.post(`${API_URL}/auth/sign-in`, {
    data: { email: 'owner@talasey.local', password: DEMO_PASSWORD },
  });
  const { token } = await owner.json();
  const created = await request.post(`${API_URL}/admin/users`, {
    headers: { authorization: `Bearer ${token}` },
    data: { email, name: 'Tess Two-Factor', role: 'editor', password: PASSWORD },
  });
  expect(created.status()).toBe(201);

  const signInWithPassword = async () => {
    await page.goto('/content/sign-in/');
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();
  };

  await signInWithPassword();
  await page.getByRole('link', { name: /Tess Two-Factor/ }).click();
  await page.getByRole('button', { name: 'Set up two-factor' }).click();

  const key = (await page.locator('ol strong').textContent()) ?? '';
  const code = page.getByRole('textbox', { name: 'Code from your authenticator app' });
  await code.fill('000000');
  await page.getByRole('button', { name: 'Turn on two-factor' }).click();
  await expect(page.getByText('That code is not right')).toBeVisible();

  await code.fill(codeFor(key));
  await page.getByRole('button', { name: 'Turn on two-factor' }).click();
  await expect(page.getByText('Two-factor is on.')).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await signInWithPassword();
  await expect(page).toHaveURL(/step=code/);
  await page
    .getByRole('textbox', { name: 'Code from your authenticator app' })
    .fill(codeFor(key, 30));
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/\/content\/$/);
});

test('changing your own password needs the current one', async ({ page }) => {
  await page.goto('/admin/sign-in/');
  await page.getByRole('textbox', { name: 'Email' }).fill('catalogue@talasey.local');
  await page.getByRole('textbox', { name: 'Password' }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin\/$/);
  await page.goto('/admin/account/');

  await page.getByRole('textbox', { name: 'Current password' }).fill('not my password');
  await page.getByRole('textbox', { name: 'New password', exact: true }).fill(PASSWORD);
  await page.getByRole('textbox', { name: 'New password again' }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Change password' }).click();
  await expect(page.getByText('Your current password is not right')).toBeVisible();
});
