import { defineConfig, devices } from '@playwright/test';
import { API_URL, BACKEND_DIR } from './fixtures/stack.ts';

const externalBaseUrl = process.env.BASE_URL;
const localBaseUrl = 'http://localhost:3000';
const baseURL = externalBaseUrl ?? localBaseUrl;

// Tests start as a visitor who has already rejected optional cookies, so the consent dialog
// doesn't cover the page. tests/consent.spec.ts starts without it.
const consentGiven = {
  cookies: [
    {
      name: 'talasey_consent',
      value: encodeURIComponent(`1.0.0.${new Date().toISOString()}`),
      domain: new URL(baseURL).hostname,
      path: '/',
      expires: -1,
      httpOnly: false,
      secure: false,
      sameSite: 'Lax' as const,
    },
  ],
  origins: [],
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  globalSetup: './fixtures/global-setup.ts',
  use: {
    baseURL,
    storageState: consentGiven,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.PLAYWRIGHT_CHANNEL && { channel: process.env.PLAYWRIGHT_CHANNEL }),
      },
    },
  ],
  // The real stack: the backend on Postgres and Redis (`npm run db` there), and the built site.
  webServer: externalBaseUrl
    ? undefined
    : [
        {
          command: 'npm run start',
          cwd: BACKEND_DIR,
          url: `${API_URL}/health`,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: 'npm run start',
          cwd: '..',
          url: localBaseUrl,
          reuseExistingServer: !process.env.CI,
          env: { API_URL },
        },
      ],
});
