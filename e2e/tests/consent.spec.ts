import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

const consentCookie = async (page: Page) =>
  (await page.context().cookies()).find((cookie) => cookie.name === 'talasey_consent');

const dataLayer = (page: Page) =>
  page.evaluate(() => (window as unknown as { dataLayer: unknown[][] }).dataLayer);

test('asks on the first visit, with Accept all and Reject all the same size', async ({ page }) => {
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Cookies on Talasey' });
  await expect(dialog).toBeVisible();

  const accept = await dialog.getByRole('button', { name: 'Accept all' }).boundingBox();
  const reject = await dialog.getByRole('button', { name: 'Reject all' }).boundingBox();
  expect(accept?.width).toBe(reject?.width);
  expect(accept?.height).toBe(reject?.height);

  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(violations).toEqual([]);
});

test('starts with Consent Mode denied and records a rejection', async ({ page }) => {
  await page.goto('/');
  expect((await dataLayer(page))[0]).toEqual([
    'consent',
    'default',
    expect.objectContaining({ analytics_storage: 'denied', ad_storage: 'denied' }),
  ]);

  await page.getByRole('button', { name: 'Reject all' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect((await consentCookie(page))?.value).toMatch(/^1\.0\.0\./);
  expect((await dataLayer(page)).at(-1)).toEqual([
    'consent',
    'update',
    expect.objectContaining({ analytics_storage: 'denied', ad_user_data: 'denied' }),
  ]);

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('lets people change their mind from the footer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Reject all' }).click();

  await page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings' }).click();
  await page.getByRole('button', { name: 'Preferences' }).click();
  await page
    .getByRole('checkbox', { name: /Analytics/ })
    .locator('xpath=ancestor::label[1]')
    .click();
  await page.getByRole('button', { name: 'Save my choices' }).click();

  expect((await consentCookie(page))?.value).toMatch(/^1\.1\.0\./);
  expect((await dataLayer(page)).at(-1)).toEqual([
    'consent',
    'update',
    expect.objectContaining({ analytics_storage: 'granted', ad_storage: 'denied' }),
  ]);
});
