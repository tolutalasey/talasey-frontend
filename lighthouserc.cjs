// Every public page template, on Lighthouse's default mobile settings, against the built site and
// the real API (`pnpm db` and the API running). Reports stay on disk in .lighthouseci.
const indexable = [
  '/',
  '/products/silver-grey-porcelain-paving/',
  '/porcelain-paving/',
  '/garden-screens/powder-coated/',
  '/brands/',
  '/projects/',
  '/guides/',
  '/help/',
  '/help/returns/',
  '/contact/',
];

// Pages that are noindex on purpose: search results, the basket, and pages still on placeholder
// copy (ADR 0029). Lighthouse marks "blocked from indexing" as an SEO failure, so it is left out.
const noindex = [
  '/search/?q=porcelain',
  '/basket/',
  '/brands/pavetuf/',
  '/projects/new-patio/',
  '/guides/choosing-a-garden-screen/',
  '/inspiration/',
];

const site = (path) => `http://localhost:3000${path}`;
const pattern = (paths) =>
  `^http://localhost:3000(${paths.map((path) => path.replace(/[?.]/g, '\\$&')).join('|')})$`;

const shared = {
  'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median-run' }],
  'categories:accessibility': ['error', { minScore: 1 }],
  'categories:best-practices': ['warn', { minScore: 0.95 }],
};

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start',
      startServerReadyPattern: 'Ready',
      url: [...indexable, ...noindex].map(site),
      numberOfRuns: 3,
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: pattern(indexable),
          assertions: { ...shared, 'categories:seo': ['error', { minScore: 1 }] },
        },
        {
          matchingUrlPattern: pattern(noindex),
          assertions: {
            ...shared,
            'is-crawlable': 'off',
            'meta-description': 'off',
            'categories:seo': ['error', { minScore: 0.5 }],
          },
        },
      ],
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
