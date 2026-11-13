# End-to-end tests (`e2e`)

Playwright tests against the real stack: the built site and the API on Postgres and Redis. Journeys, the eight "what good looks like" checks, SEO checks on every template, JSON-LD and axe accessibility scans.

```sh
npx playwright install chromium                 # once
npm run db                                               # in the backend, another terminal
npm run build && npm run e2e                                # build the site, then test
BASE_URL=https://preview.example.com npm run e2e         # against a deployed site
```

Before the tests, `fixtures/global-setup.ts` migrates and seeds the API (demo staff and products) and imports the master sheet if it is in `.data/pim`. Playwright then starts the API and `next start` unless they are already running.

`tests/good.spec.ts` holds the eight checks: find a product in three clicks or one search; the price per pack and per m²; postcode, delivery price and a held day; the lorry access questions; paying (the test payment); the order in `/admin` with its day and answers; staff changing a price and a photo; and an editor publishing what a contributor drafted.

Tests that need the full catalogue (`journeys.spec.ts`, `product-purchase.spec.ts` and the click path in check 1) skip without the master sheet and say so.

Where Playwright's browser download is blocked, set `PLAYWRIGHT_CHANNEL=chrome` to use an installed Google Chrome instead.
