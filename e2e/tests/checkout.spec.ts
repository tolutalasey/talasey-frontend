import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoAxeViolations(page: Page) {
  // React Aria's live announcer keeps "pending" messages for a few seconds after each form step.
  // They point at buttons the next step has already replaced, which axe reports as unnamed images.
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .exclude('[data-live-announcer]')
    .analyze();
  expect(violations).toEqual([]);
}

// React Aria keeps the radio input visually hidden inside its label, so press the label as a
// shopper would.
async function fillAddress(page: Page, postcode: string) {
  await page.getByRole('textbox', { name: 'Email' }).fill('amy@example.com');
  await page.getByRole('textbox', { name: 'First name' }).fill('Amy');
  await page.getByRole('textbox', { name: 'Last name' }).fill('Shopper');
  await page.getByRole('textbox', { name: 'Address' }).fill('1 Piccadilly');
  await page.getByRole('textbox', { name: 'Town or city' }).fill('Manchester');
  await page.getByRole('textbox', { name: 'Postcode' }).fill(postcode);
  await page.getByRole('textbox', { name: 'Phone' }).fill('0161 000 0000');
  await page.getByRole('button', { name: 'Show delivery prices' }).click();
}

async function choose(radio: Locator) {
  await radio.locator('xpath=ancestor::label[1]').click();
  await expect(radio).toBeChecked();
}

test('a pallet order from basket to confirmation', async ({ page }) => {
  await page.goto('/products/silver-grey-porcelain-paving/');
  await page.getByRole('spinbutton', { name: 'Packs' }).fill('2');
  await page.getByRole('button', { name: 'Add to basket' }).click();

  await expect(page).toHaveURL(/\/basket\/$/);
  await expect(page.getByRole('list', { name: 'Items in your basket' })).toContainText(
    'Silver grey porcelain paving',
  );
  await page.getByRole('link', { name: 'Go to checkout' }).click();

  await fillAddress(page, 'M1 1AE');

  const delivery = page.getByRole('radiogroup', { name: 'Delivery' });
  await choose(delivery.getByRole('radio', { name: /Pallet delivery/ }));
  await page.getByRole('button', { name: 'Use this delivery' }).click();

  await choose(
    page
      .getByRole('radiogroup', { name: 'Delivery day' })
      .getByRole('radio', { disabled: false })
      .first(),
  );
  await page.getByRole('button', { name: 'Hold this day' }).click();

  await choose(
    page
      .getByRole('radiogroup', { name: 'What is the largest vehicle that can reach you?' })
      .getByRole('radio', { name: /Rigid lorry/ }),
  );
  await choose(
    page.getByRole('radiogroup', { name: /hard standing/ }).getByRole('radio', { name: 'Yes' }),
  );
  await choose(
    page.getByRole('radiogroup', { name: /kerbside drop/ }).getByRole('radio', { name: 'No' }),
  );
  await page.getByRole('button', { name: 'Save delivery access' }).click();

  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: /Place order/ }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Thank you, your order is placed',
  );
  const booked = page.getByRole('region', { name: 'Delivery' });
  await expect(booked.getByRole('term').filter({ hasText: /^Day$/ })).toBeVisible();
  await expect(booked.getByRole('definition').filter({ hasText: 'Rigid lorry' })).toBeVisible();
  await expect(page.getByRole('term').filter({ hasText: 'Total inc. VAT' })).toBeVisible();
  await expectNoAxeViolations(page);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('shows the server’s errors and still places the order', async ({ page }) => {
    await page.goto('/products/silver-grey-porcelain-paving/');
    await page.getByRole('spinbutton', { name: 'Packs' }).fill('1');
    await page.getByRole('button', { name: 'Add to basket' }).click();
    await expect(page).toHaveURL(/\/basket\/$/);
    await page.getByRole('link', { name: 'Go to checkout' }).click();

    await fillAddress(page, 'NOT A POSTCODE');
    const error = page.getByText('Enter a UK postcode, like M1 1AE');
    await expect(error).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Postcode' })).toHaveValue('NOT A POSTCODE');
    await expect(page.getByRole('textbox', { name: 'First name' })).toHaveValue('Amy');

    await page.goto('/checkout/');
    await expect(error).toHaveCount(0);

    await fillAddress(page, 'M1 1AE');
    await expect(error).toHaveCount(0);

    await choose(
      page
        .getByRole('radiogroup', { name: 'Delivery' })
        .getByRole('radio', { name: /Pallet delivery/ }),
    );
    await page.getByRole('button', { name: 'Use this delivery' }).click();
    await choose(
      page
        .getByRole('radiogroup', { name: 'Delivery day' })
        .getByRole('radio', { disabled: false })
        .first(),
    );
    await page.getByRole('button', { name: 'Hold this day' }).click();
    await choose(page.getByRole('radio', { name: /Small van only/ }));
    await choose(
      page.getByRole('radiogroup', { name: /hard standing/ }).getByRole('radio', { name: 'No' }),
    );
    await choose(
      page.getByRole('radiogroup', { name: /kerbside drop/ }).getByRole('radio', { name: 'Yes' }),
    );
    await page.getByRole('button', { name: 'Save delivery access' }).click();
    await page.getByRole('button', { name: /Place order/ }).click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Thank you, your order is placed',
    );

    await page.goto('/checkout/');
    await expect(page.getByText('Your basket is empty.')).toBeVisible();
  });
});
