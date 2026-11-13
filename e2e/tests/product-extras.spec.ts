import { expect, test } from '@playwright/test';
import { DEMO_PASSWORD, PRODUCT_HANDLE } from '../fixtures/stack.ts';

test('an editor adds a download and a "complete the job" product, and the product page shows them', async ({
  page,
}) => {
  const document = `Fitting guide ${Date.now().toString(36)}`;
  await page.goto('/content/sign-in/');
  await page.getByRole('textbox', { name: 'Email' }).fill('editor@talasey.local');
  await page.getByRole('textbox', { name: 'Password' }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/content\/$/);

  await page.goto('/content/product-extras/');
  await page.getByRole('textbox', { name: 'New entry: its name or title' }).fill(PRODUCT_HANDLE);
  await page.getByRole('button', { name: 'Start a draft' }).click();
  await page.waitForURL(/\/content\/(edit\/|product-extras\/\?error)/);
  // A run against the same database already made it: open that one instead.
  if (await page.getByText('already uses').count())
    await page.getByRole('link', { name: PRODUCT_HANDLE, exact: true }).click();

  const job = page.getByRole('group', { name: 'Complete the job' });
  await job.getByRole('textbox', { name: 'Product' }).first().fill('silver-grey-porcelain-paving');
  await job.getByRole('textbox', { name: 'Why it is needed' }).first().fill('The paving it joints');
  const documents = page.getByRole('group', { name: 'Documents' });
  await documents.getByRole('textbox', { name: 'Title' }).first().fill(document);
  await documents
    .getByRole('textbox', { name: 'Link' })
    .first()
    .fill('/downloads/fitting-guide.pdf');
  await page.getByRole('button', { name: 'Save and publish' }).click();
  await expect(page.getByText('Published. The site shows it now.')).toBeVisible();

  await expect(async () => {
    await page.goto(`/products/${PRODUCT_HANDLE}/`);
    await expect(page.getByRole('link', { name: document })).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15_000 });
  const extra = page
    .getByRole('group', { name: 'Complete the job' })
    .getByRole('checkbox', { name: /Silver grey porcelain paving/ });
  await expect(extra).toBeVisible();
  await expect(extra).not.toBeChecked();
});
