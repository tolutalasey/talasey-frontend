import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { DEMO_PASSWORD, hasCatalogue, MASTER_SHEET } from '../fixtures/stack.ts';

test.beforeEach(async ({ page }) => {
  await page.goto('/admin/sign-in/');
  await page.getByRole('textbox', { name: 'Email' }).fill('catalogue@talasey.local');
  await page.getByRole('textbox', { name: 'Password' }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/admin\/$/);
  await page.getByRole('link', { name: 'Import and export' }).click();
});

test('staff download the catalogue as a spreadsheet', async ({ page }) => {
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download as Excel (.xlsx)' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^talasey-catalogue-\d{4}-\d{2}-\d{2}\.xlsx$/);
  const bytes = await readFile((await file.path()) ?? '');
  expect(bytes.subarray(0, 2).toString()).toBe('PK');
});

test('a file that is not the master sheet is explained, not imported', async ({ page }) => {
  await page.getByLabel('Product master sheet (.xlsx)').setInputFiles({
    name: 'products.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    buffer: Buffer.from('not really a workbook'),
  });
  await page.getByRole('button', { name: 'Check what would change' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'xlsx' })).toContainText(
    'This is not an .xlsx workbook',
  );
});

test('staff check the master sheet before importing it', async ({ page }) => {
  test.skip(!hasCatalogue, 'Needs the master sheet in the backend .data/pim');
  await page.getByLabel('Product master sheet (.xlsx)').setInputFiles(MASTER_SHEET);
  await page.getByRole('button', { name: 'Check what would change' }).click();
  const report = page.getByRole('region', { name: 'What would change (nothing saved yet)' });
  await expect(report).toContainText('590 rows, 171 products');
  await expect(report).toContainText('Would create');
});
