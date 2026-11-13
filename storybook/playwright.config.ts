import { defineConfig, devices } from '@playwright/test';

const port = 6007;

// Runs every Storybook story in a real browser: axe (with colour contrast), keyboard focus rings
// and touch target sizes. Build Storybook first with `npm run storybook:build`.
export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: `http://localhost:${port}` },
  projects: [
    { name: 'phone', use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 800 } } },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: {
    command: 'node serve.mjs',
    url: `http://localhost:${port}/index.json`,
    reuseExistingServer: !process.env.CI,
  },
});
