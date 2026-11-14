import { expect, test } from '@playwright/test';
import { hasCatalogue } from '../fixtures/stack.ts';

// Purchase areas 1A and 1B against the imported catalogue and the seed.
test.skip(!hasCatalogue, 'Copy the product master sheet to .data/pim to run these');

const PAVING = '/products/silver-grey-porcelain-paving/';
const SCREEN = '/products/baroque-emblem-decorative-screen/';
// The only published screen with powder-coated prices in the master sheet.
const PRICED_SCREEN = '/products/abstract-branches-decorative-screen/';

test('paving shows the price per pack and per m², and works out packs from an area', async ({
  page,
}) => {
  await page.goto(PAVING);
  await expect(page.getByTestId('product-price')).toHaveText('£89.99 per pack inc. VAT');
  await expect(page.getByTestId('price-per-m2')).toHaveText(
    '£62.49 per m² inc. VAT · each pack covers 1.44 m²',
  );

  const extra = page.getByRole('checkbox', { name: /Pavetuf jointing compound/ });
  await expect(extra).not.toBeChecked();

  await page.getByRole('textbox', { name: 'Or the area to cover (m²)' }).fill('4');
  await extra.check();
  await page.getByRole('button', { name: 'Add to basket' }).click();

  await expect(page).toHaveURL(/\/basket\/$/);
  const items = page.getByRole('list', { name: 'Items in your basket' });
  await expect(
    items.getByRole('listitem').filter({ hasText: 'Silver grey porcelain paving' }),
  ).toContainText('3');
  await expect(items).toContainText('Pavetuf jointing compound');
});

test('a 1B screen asks for a powder coat colour only for the powder-coated finish', async ({
  page,
}) => {
  await page.goto(`${PRICED_SCREEN}?finish=weathered-steel&size=1800-x-300-mm`);
  await expect(page.getByRole('group', { name: /Powder coat colour/ })).toHaveCount(0);

  await page.getByRole('link', { name: 'Powder Coated' }).click();
  await expect(page).toHaveURL(/finish=powder-coated/);
  const colours = page.getByRole('group', { name: /Powder coat colour/ });
  await expect(colours.getByRole('radio')).toHaveCount(8);
  await expect(colours.getByRole('radio', { name: 'Anthracite grey (RAL 7016)' })).toBeChecked();

  await colours.getByText('Jet black (RAL 9005)').click();
  await page.getByRole('button', { name: 'Add to basket' }).click();
  await expect(page).toHaveURL(/\/basket\/$/);
  await expect(page.getByRole('list', { name: 'Items in your basket' })).toContainText(
    'Jet black (RAL 9005)',
  );
});

test('?colour= opens a colour set on that colour', async ({ page }) => {
  await page.goto(`${SCREEN}?finish=powder-coated&size=1800-x-600-mm&colour=moss-green-ral-6005`);
  await expect(page.getByRole('radio', { name: 'Moss green (RAL 6005)' })).toBeChecked();
  await expect(page.getByRole('link', { name: '1800 × 600 mm' })).toHaveAttribute(
    'aria-current',
    'true',
  );
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('shows the basket form’s errors on the product page', async ({ page }) => {
    await page.goto(PAVING);
    await page.getByRole('spinbutton', { name: 'Packs' }).fill('0');
    await page.getByRole('button', { name: 'Add to basket' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Silver grey porcelain paving',
    );
    await expect(page.getByText('Enter at least 1')).toBeVisible();
  });

  test('chooses options with links and adds to the basket', async ({ page }) => {
    await page.goto(SCREEN);
    await page.getByRole('link', { name: 'Galvanised Steel' }).click();
    await page.getByRole('link', { name: '1800 × 900 mm' }).click();
    await expect(page.getByTestId('product-price')).not.toHaveText('Price on request');
    await page.getByRole('button', { name: 'Add to basket' }).click();
    await expect(page).toHaveURL(/\/basket\/$/);
    await expect(page.getByRole('list', { name: 'Items in your basket' })).toContainText(
      'Galvanised Steel',
    );
  });
});
