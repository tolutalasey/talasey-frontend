import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const resolve = {
  alias: {
    '@': new URL('./src', import.meta.url).pathname,
    'server-only': new URL('./src/test/server-only.ts', import.meta.url).pathname,
  },
};

export default defineConfig({
  test: {
    projects: [
      {
        resolve,
        test: {
          name: 'site',
          environment: 'node',
          include: ['src/**/*.test.ts'],
          exclude: ['src/ui/**'],
        },
      },
      {
        resolve,
        plugins: [react()],
        test: {
          name: 'ui',
          environment: 'jsdom',
          include: ['src/ui/**/*.test.{ts,tsx}'],
          setupFiles: ['src/ui/test/setup.ts'],
          css: { modules: { classNameStrategy: 'non-scoped' } },
        },
      },
    ],
  },
});
