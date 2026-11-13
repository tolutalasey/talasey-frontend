import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { indexablePages } from './pages.ts';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const { name, path } of [...indexablePages, { name: 'not found', path: '/no-such-page/' }]) {
  test(`${name} has no axe violations`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(violations).toEqual([]);
  });
}

test('the skip link is the first tab stop and moves focus to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main#main')).toBeFocused();
});
