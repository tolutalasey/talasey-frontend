import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

// Compressed JavaScript each page makes the browser download before it can respond to taps.
// React and Next.js alone are about 120 KB, so these budgets are what our own code may add
// on top (ADR 0041). The legacy-browser polyfill (nomodule) is not downloaded by modern browsers.
const BUDGETS_KB = [
  { path: '/', budget: 150 },
  { path: '/porcelain-paving/', budget: 150 },
  { path: '/guides/', budget: 150 },
  { path: '/help/', budget: 150 },
  { path: '/search/?q=porcelain', budget: 150 },
  { path: '/products/silver-grey-porcelain-paving/', budget: 190 },
  { path: '/contact/', budget: 200 },
  { path: '/basket/', budget: 190 },
];

for (const { path, budget } of BUDGETS_KB) {
  test(`${path} stays within ${budget} KB of JavaScript`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    const scripts = [
      ...html.matchAll(/<script(?![^>]*noModule)[^>]*\ssrc="(\/_next\/static\/[^"]+\.js)"/g),
    ].map((match) => match[1] ?? '');
    expect(scripts.length, 'the page should load the app scripts').toBeGreaterThan(3);
    const sizes = await Promise.all(
      [...new Set(scripts)].map(
        async (src) => gzipSync(await (await request.get(src)).body()).length,
      ),
    );
    const totalKb = sizes.reduce((sum, size) => sum + size, 0) / 1024;
    test.info().annotations.push({ type: 'JavaScript', description: `${totalKb.toFixed(0)} KB` });
    expect(totalKb, `${path} ships ${totalKb.toFixed(0)} KB`).toBeLessThanOrEqual(budget);
  });
}
