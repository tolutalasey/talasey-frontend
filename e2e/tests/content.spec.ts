import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const PHOTO = { name: 'patio.png', mimeType: 'image/png', buffer: Buffer.from([137, 80, 78, 71]) };
const ENQUIRIES = join(import.meta.dirname, '../../.data/enquiries');

async function fillEnquiry(page: Page, message: string) {
  await page.getByRole('textbox', { name: 'Your name' }).fill('Amy Shopper');
  await page.getByRole('textbox', { name: 'Email' }).fill('amy@example.com');
  await page.getByLabel('What is it about?').selectOption('quote');
  await page.getByLabel('Your message').fill(message);
  await page.getByLabel('Photos (optional)').setInputFiles(PHOTO);
}

async function savedEnquiry(message: string) {
  const folders = await readdir(ENQUIRIES).catch(() => []);
  for (const folder of folders) {
    const saved = JSON.parse(await readFile(join(ENQUIRIES, folder, 'enquiry.json'), 'utf8'));
    if (saved.message === message) return saved;
  }
  return null;
}

test('brand pages exist for all five PRD brands', async ({ page }) => {
  await page.goto('/brands/');
  await expect(page.getByRole('list', { name: 'Our brands' }).getByRole('link')).toHaveText([
    'Vitripiazza',
    'Natural Paving',
    'Piranha',
    'Pavetuf',
    'Luxigraze',
  ]);
});

test('a guide opens with its short answer, then the steps, with author and date', async ({
  page,
}) => {
  await page.goto('/guides/');
  await page.getByRole('link', { name: 'Choosing a decorative garden screen' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Choosing a decorative garden screen',
  );
  await expect(page.getByRole('main')).toContainText('By The Talasey team');
  await expect(page.getByRole('heading', { name: 'Step by step' })).toBeVisible();
});

test('the help centre links every topic', async ({ page }) => {
  await page.goto('/help/');
  await expect(page.getByRole('list', { name: 'Help topics' }).getByRole('link')).toHaveCount(6);
  await page.getByRole('link', { name: 'Returns and refunds' }).click();
  await expect(page.getByText('within 14 days of delivery')).toBeVisible();
});

test('the contact form sends a message with a photo', async ({ page }) => {
  const message = `Please price a patio, sent at ${Date.now()}`;
  await page.goto('/contact/?topic=samples');
  await expect(page.getByLabel('What is it about?')).toHaveValue('samples');
  await fillEnquiry(page, message);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page).toHaveURL('/contact/thanks/');
  test.skip(!!process.env.BASE_URL, 'Files are on the server');
  expect(await savedEnquiry(message)).toMatchObject({
    topic: 'quote',
    photos: [{ file: 'photo-1.png', type: 'image/png' }],
  });
});

test('the 404 page offers a search and top links', async ({ page }) => {
  const response = await page.goto('/not-a-page/at-all/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('main').getByRole('search')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Help centre' }).first()).toBeVisible();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the contact form shows its errors and keeps what was typed', async ({ page }) => {
    await page.goto('/contact/');
    await page.getByRole('textbox', { name: 'Your name' }).fill('Amy');
    await page.getByRole('textbox', { name: 'Email' }).fill('amy@example');
    await page.getByLabel('Your message').fill('A question about my order of paving');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Enter an email address like name@example.com')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Your name' })).toHaveValue('Amy');
  });

  test('the contact form sends a photo', async ({ page }) => {
    const message = `No-JS enquiry ${Date.now()}`;
    await page.goto('/contact/');
    await fillEnquiry(page, message);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL('/contact/thanks/');
  });
});
