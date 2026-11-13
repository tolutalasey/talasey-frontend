import { createRequire } from 'node:module';
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import boundaries from 'eslint-plugin-boundaries';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const typescriptResolver = createRequire(import.meta.url).resolve(
  'eslint-import-resolver-typescript',
);

const FEATURE_ENTRY = 'Import from the feature through its index.ts, not its internals.';
const RAW_CLIENTS = 'Features read data through @/api-client or src/lib, never a raw HTTP client.';
const UI_STAYS_PRESENTATIONAL = 'src/ui stays presentational: pass data and callbacks in as props.';

export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'coverage/**',
      'storybook-static/**',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
      'next-env.d.ts',
      '**/schema.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  reactHooks.configs.flat['recommended-latest'],
  {
    languageOptions: { globals: { ...globals.node } },
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'feature', pattern: 'src/features/*', capture: ['feature'] },
        { type: 'lib', pattern: 'src/lib' },
      ],
      'import/resolver': { [typescriptResolver]: { alwaysTryTypes: true } },
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'allow',
          checkAllOrigins: true,
          policies: [
            {
              disallow: { to: { element: { type: 'feature', fileInternalPath: '!index.ts' } } },
              message: FEATURE_ENTRY,
            },
            {
              from: { element: { type: 'feature' } },
              disallow: {
                to: {
                  module: { origin: 'external', source: ['openapi-fetch'] },
                },
              },
              message: RAW_CLIENTS,
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/ui/**/*.{ts,tsx}'],
    rules: {
      '@next/next/no-img-element': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/api-client', '@/api-client/*', '@/analytics', '@/analytics/*'],
              message: UI_STAYS_PRESENTATIONAL,
            },
            { group: ['@/app/*', '@/features/*', '@/lib/*'], message: UI_STAYS_PRESENTATIONAL },
          ],
        },
      ],
    },
  },
  { files: ['storybook/**', 'scripts/**'], rules: { 'no-console': 'off' } },
  prettier,
);
