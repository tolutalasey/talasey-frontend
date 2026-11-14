import { expect, test } from '@playwright/test';

test('home page shows the main heading and intro', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /paving, decking and outdoor living/i,
  );
  await expect(page.getByRole('main')).toContainText('delivered to your door');
});

test('the hero has two actions: samples first, then the main range', async ({ page }) => {
  await page.goto('/');
  const hero = page.getByRole('region', { name: /paving, decking/i });
  const actions = hero.getByRole('link');
  await expect(actions).toHaveText(['Order free samples', 'Shop porcelain paving']);
  await expect(actions.nth(1)).toHaveAttribute('href', '/porcelain-paving/');
});

test('offers project tiles and this season’s block', async ({ page }) => {
  await page.goto('/');
  const planning = page.getByRole('region', { name: 'What are you planning?' });
  await expect(planning.getByRole('link')).toHaveText([
    'A new patio',
    'A composite deck',
    'Shade and shelter',
    'A garden room',
  ]);
  await expect(page.locator('#season-title')).toHaveCount(1);
});

for (const width of [375, 1440]) {
  test(`hero text lines up with the header logo at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const logo = await page.getByRole('link', { name: 'Talasey' }).first().boundingBox();
    // On wide screens the text sits in a panel over the photo; the panel lines up with the logo.
    const panel = await page.getByRole('heading', { level: 1 }).locator('..').boundingBox();
    expect(panel?.x).toBeGreaterThanOrEqual(16);
    expect(panel?.x).toBe(logo?.x);
  });
}
