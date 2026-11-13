import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

interface StoryIndex {
  entries: Record<string, { id: string; title: string; name: string; type: string }>;
}

const index = JSON.parse(
  readFileSync(new URL('../storybook-static/index.json', import.meta.url), 'utf8'),
) as StoryIndex;
const stories = Object.values(index.entries).filter((entry) => entry.type === 'story');

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const TAB_STOPS = 12;

async function openStory(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.locator('#storybook-root').waitFor({ state: 'attached' });
  await page.waitForFunction(() => {
    const root = document.querySelector('#storybook-root');
    return Boolean(root && (root.childElementCount > 0 || document.querySelector('[role=dialog]')));
  });
  await page.evaluate(() => document.fonts.ready);
}

// Storybook's accessibility panel runs axe on each story too; wait for it rather than clash.
async function axeViolations(page: Page) {
  for (let attempt = 0; ; attempt++) {
    try {
      const { violations } = await new AxeBuilder({ page })
        .include('body')
        .withTags(WCAG_TAGS)
        .analyze();
      return violations.map((violation) => `${violation.id}: ${violation.help}`);
    } catch (error) {
      if (attempt > 10 || !String(error).includes('Axe is already running')) throw error;
      await page.waitForTimeout(250);
    }
  }
}

// A focused control must show a ring of at least 3px: on itself, on the element that draws its
// box (a checkbox's square, a card around its link) or on the group that wraps it.
function focusRingWidth(): number {
  const focused = document.activeElement;
  if (!focused || focused === document.body) return Number.POSITIVE_INFINITY;
  const candidates = [
    focused,
    ...focused.querySelectorAll('*'),
    ...Array.from({ length: 3 }, (_, depth) => {
      let node: Element | null = focused;
      for (let step = 0; step <= depth; step++) node = node?.parentElement ?? null;
      return node;
    }).filter((node): node is Element => node !== null),
  ];
  return Math.max(
    0,
    ...candidates.map((element) => {
      const style = getComputedStyle(element);
      return style.outlineStyle === 'none' ? 0 : Number.parseFloat(style.outlineWidth);
    }),
  );
}

// Controls need a 44 × 44px target (PRD section 12); links that aren't part of a sentence need
// at least 24px (WCAG 2.2 target size).
function smallTargets(): string[] {
  const visible = (rect: DOMRect) => rect.width > 1 && rect.height > 1;
  // Screen-reader-only controls, such as React Aria's hidden dismiss buttons, aren't touch targets.
  const clipped = (element: Element) => {
    for (let node: Element | null = element; node; node = node.parentElement) {
      if (getComputedStyle(node).clipPath.startsWith('inset(50%')) return true;
    }
    return false;
  };
  const describe = (element: Element, rect: DOMRect) =>
    `${element.tagName.toLowerCase()} "${(element.textContent ?? element.getAttribute('aria-label') ?? '').trim().slice(0, 40)}" ${Math.round(rect.width)}×${Math.round(rect.height)}`;
  const problems: string[] = [];

  for (const control of document.querySelectorAll(
    'button, [role=button], input:not([type=hidden]), select, textarea',
  )) {
    const target = control.closest('label') ?? control;
    if (clipped(target)) continue;
    const rect = target.getBoundingClientRect();
    if (!visible(rect) && !visible(control.getBoundingClientRect())) continue;
    const box = visible(rect) ? rect : control.getBoundingClientRect();
    if (box.height < 43.5 || box.width < 43.5) problems.push(describe(target, box));
  }

  for (const link of document.querySelectorAll('a[href]')) {
    if (getComputedStyle(link).display === 'inline') continue;
    const rect = link.getBoundingClientRect();
    if (visible(rect) && rect.height < 23.5) problems.push(describe(link, rect));
  }
  return problems;
}

for (const story of stories) {
  test.describe(`${story.title} / ${story.name}`, () => {
    test('has no axe violations', async ({ page }) => {
      await openStory(page, story.id);
      expect(await axeViolations(page)).toEqual([]);
    });

    test('shows a 3px focus ring on every tab stop', async ({ page }) => {
      await openStory(page, story.id);
      for (let stop = 0; stop < TAB_STOPS; stop++) {
        await page.keyboard.press('Tab');
        const width = await page.evaluate(focusRingWidth);
        if (width === Number.POSITIVE_INFINITY) break;
        const name = await page.evaluate(
          () =>
            document.activeElement?.getAttribute('aria-label') ??
            document.activeElement?.textContent?.trim().slice(0, 40),
        );
        expect(width, `focus ring on "${name}"`).toBeGreaterThanOrEqual(3);
      }
    });

    test('has big enough touch targets', async ({ page }) => {
      await openStory(page, story.id);
      expect(await page.evaluate(smallTargets)).toEqual([]);
    });
  });
}
