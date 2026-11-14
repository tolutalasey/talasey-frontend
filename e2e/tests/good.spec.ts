import { expect, test, type Locator, type Page } from '@playwright/test';
import {
  DEMO_PASSWORD,
  EDITABLE_HANDLE,
  hasCatalogue,
  PRODUCT_HANDLE,
  STOCKED_HANDLE,
} from '../fixtures/stack.ts';

// The eight "what good looks like" checks, each a journey through the real stack.

const run = Date.now().toString(36);

async function choose(radio: Locator) {
  await radio.locator('xpath=ancestor::label[1]').click();
  await expect(radio).toBeChecked();
}

async function signIn(page: Page, area: 'admin' | 'content', role: string) {
  await page.goto(`/${area}/sign-in/`);
  await page.getByRole('textbox', { name: 'Email' }).fill(`${role}@talasey.local`);
  await page.getByRole('textbox', { name: 'Password' }).fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(new RegExp(`/${area}/$`));
}

async function palletBasketAtDeliveryDay(page: Page) {
  await page.goto(`/products/${PRODUCT_HANDLE}/`);
  await page.getByRole('spinbutton', { name: 'Quantity' }).fill('40');
  await page.getByRole('button', { name: 'Add to basket' }).click();
  await expect(page).toHaveURL(/\/basket\/$/);
  await page.getByRole('link', { name: 'Go to checkout' }).click();

  await page.getByRole('textbox', { name: 'Email' }).fill('amy@example.com');
  await page.getByRole('textbox', { name: 'First name' }).fill('Amy');
  await page.getByRole('textbox', { name: 'Last name' }).fill(`Shopper ${run}`);
  await page.getByRole('textbox', { name: 'Address' }).fill('1 Piccadilly');
  await page.getByRole('textbox', { name: 'Town or city' }).fill('Manchester');
  await page.getByRole('textbox', { name: 'Postcode' }).fill('M1 1AE');
  await page.getByRole('textbox', { name: 'Phone' }).fill('0161 000 0000');
  await page.getByRole('button', { name: 'Show delivery prices' }).click();
}

test('1. finds a product in three clicks or one search', async ({ page }) => {
  await page.goto('/');
  // Focusing the plain search box swaps in the suggestions box; type once it has.
  await page.getByRole('searchbox', { name: 'Search products' }).click();
  await page.getByRole('combobox', { name: 'Search products' }).fill('pavetuf jointing');
  await page.keyboard.press('Enter');
  await page
    .getByRole('list', { name: 'Search results' })
    .getByRole('link', { name: /Pavetuf jointing compound/ })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pavetuf jointing compound');

  test.skip(!hasCatalogue, 'The click path needs the imported master sheet');
  let clicks = 0;
  const click = async (target: Locator) => {
    clicks += 1;
    await target.click();
  };
  await page.goto('/');
  await click(page.getByText('Shop by product'));
  await click(
    page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Fire pits' }),
  );
  await click(page.getByRole('link', { name: 'Sphere Fire Pit with Stand' }));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sphere Fire Pit with Stand');
  expect(clicks).toBeLessThanOrEqual(3);
});

test('2. shows the right price per pack and per square metre', async ({ page }) => {
  await page.goto(`/products/${STOCKED_HANDLE}/`);
  const price = page.getByRole('region', { name: 'Price' }).or(page.locator('main'));
  await expect(price.getByText('£89.99').first()).toBeVisible();
  await expect(price.getByText(/£62\.49\s*(per|\/)\s*m²/).first()).toBeVisible();
});

test('3 to 6. postcode to delivery day, lorry access, test payment, and the order in /admin', async ({
  page,
}) => {
  let orderNumber = '';

  await test.step('3. a postcode gives a delivery price, then a day is held', async () => {
    await palletBasketAtDeliveryDay(page);
    const delivery = page.getByRole('radiogroup', { name: 'Delivery' });
    await expect(delivery.getByRole('radio', { name: /Pallet delivery.*£65\.00/ })).toBeVisible();
    await choose(delivery.getByRole('radio', { name: /Pallet delivery/ }));
    await page.getByRole('button', { name: 'Use this delivery' }).click();

    const day = page
      .getByRole('radiogroup', { name: 'Delivery day' })
      .getByRole('radio', { disabled: false })
      .first();
    await choose(day);
    await page.getByRole('button', { name: 'Hold this day' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Held for you' })).toBeVisible();
  });

  await test.step('4. the lorry access questions must be answered', async () => {
    await page.getByRole('button', { name: 'Save delivery access' }).click();
    await expect(page.getByRole('button', { name: /Place order/ })).toHaveCount(0);
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
  });

  await test.step('5. pays with the labelled test payment', async () => {
    await expect(page.getByText('Test payment.')).toBeVisible();
    await page.getByRole('button', { name: /Place order/ }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Thank you, your order is placed',
    );
    orderNumber =
      (await page.getByText('Your order number is').locator('strong').textContent()) ?? '';
    expect(orderNumber).not.toBe('');
  });

  await test.step('6. the order is in /admin with its day and access answers', async () => {
    await signIn(page, 'admin', 'catalogue');
    await page
      .getByRole('navigation', { name: 'Talasey admin' })
      .getByRole('link', { name: 'Orders' })
      .click();
    await page.getByRole('link', { name: `#${orderNumber}`, exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Order #${orderNumber}`);
    await expect(page.getByRole('region', { name: 'Delivery' })).toContainText(/booked|held/);
    await expect(page.getByText('A rigid lorry can reach, not an articulated one')).toBeVisible();
    await expect(page.getByText('Not happy with kerbside delivery')).toBeVisible();
  });
});

test('7. staff change a price and a photo in /admin and the shop shows them', async ({ page }) => {
  const newPrice = (5 + (Date.now() % 900) / 100).toFixed(2);
  await signIn(page, 'admin', 'catalogue');
  await page.getByRole('link', { name: 'Products' }).first().click();
  await page.getByRole('textbox', { name: 'Find a product' }).fill('tile spacers');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('link', { name: 'Porcelain tile spacers' }).click();

  await page.getByRole('textbox', { name: 'Price for Bag of 250 in pounds' }).fill(newPrice);
  for (const remove of await page.getByRole('checkbox', { name: 'Remove' }).all()) {
    await choose(remove);
  }
  await page.getByLabel(/Add a photo/).setInputFiles({
    name: 'jointing.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVR4nGNk+M9Q38DAwMDEwMDAAAAYgAHk0rM8MwAAAABJRU5ErkJggg==',
      'base64',
    ),
  });
  await page
    .getByRole('textbox', { name: 'New photo description' })
    .fill(`A bag of spacers ${run}`);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Saved');

  // The site refreshes the page in the background after the change, so allow a reload or two.
  await expect(async () => {
    await page.goto(`/products/${EDITABLE_HANDLE}/`);
    await expect(page.getByText(`£${newPrice}`).first()).toBeVisible({ timeout: 1_000 });
    await expect(page.getByRole('img', { name: `A bag of spacers ${run}` })).toBeVisible({
      timeout: 1_000,
    });
  }).toPass({ timeout: 15_000 });
});

test('8. an editor publishes a page a contributor drafted, and a contributor cannot publish', async ({
  page,
}) => {
  const slug = `laying-a-patio-${run}`;
  await signIn(page, 'content', 'contributor');
  await page
    .getByRole('navigation', { name: 'Talasey content' })
    .getByRole('link', { name: 'Guides' })
    .click();
  await page.getByRole('textbox', { name: /New entry/ }).fill('How to lay a porcelain patio');
  await page.getByRole('button', { name: 'Start a draft' }).click();

  await page.getByRole('textbox', { name: 'Web address' }).fill(slug);
  await page.getByRole('combobox', { name: 'Topic' }).selectOption('Laying');
  await page
    .getByRole('textbox', { name: 'Short answer' })
    .fill(
      'Lay porcelain on a full mortar bed and point the joints with a slurry or brush-in compound.',
    );
  await page
    .getByRole('textbox', { name: 'Steps' })
    .fill('Dig out the base\nLay the slabs\nPoint the joints');
  await page
    .getByRole('group', { name: 'Author' })
    .getByRole('textbox', { name: 'Name' })
    .fill('Sam Patel');
  await page.getByRole('textbox', { name: 'First published' }).fill('2026-11-01');
  const seo = page.getByRole('group', { name: 'Search engine text' });
  await seo
    .getByRole('textbox', { name: /Title/ })
    .fill('How to lay a porcelain patio, step by step');
  await seo
    .getByRole('textbox', { name: /Description/ })
    .fill(
      'Our technical team explains how to lay porcelain paving on a full mortar bed and point the joints so it lasts.',
    );
  await page.getByRole('button', { name: 'Save draft' }).click();
  await expect(page.getByRole('status')).toContainText('Draft saved');
  await expect(page.getByRole('button', { name: 'Save and publish' })).toHaveCount(0);
  const editUrl = page.url().split('?')[0] ?? '';

  await page.goto(`/guides/${slug}/`);
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(
    'How to lay a porcelain patio',
  );

  await page.context().clearCookies({ name: 'talasey_staff' });
  await signIn(page, 'content', 'editor');
  await page.goto(editUrl);
  await page.getByRole('button', { name: 'Save and publish' }).click();
  await expect(page.getByRole('status')).toContainText('Published');

  await expect(async () => {
    await page.goto(`/guides/${slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'How to lay a porcelain patio',
    );
  }).toPass({ timeout: 15_000 });
});
