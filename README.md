# Talasey frontend

The consumer site, plus `/admin` for staff and `/content` for editors: Next.js 16 App Router with Cache Components, React 19 and strict TypeScript. All data comes from the `talasey-backend` project through `src/api-client`, on the server only.

## Structure

```
src/app/(site)/          the shop: pages, with the shop's header, footer and consent dialog
src/app/(staff)/         /admin and /content: their own layouts, noindex, sign-in required
src/app/                 the root layout, sitemaps, robots, llms.txt and API routes
src/features/<feature>/  index.ts (the only public entry), components/, loaders.server.ts
src/lib/                 env (zod), SEO helpers and JSON-LD
src/api-client/          typed API client, generated from the backend's openapi.json
src/ui/                  React Aria components, styled with CSS Modules
src/tokens/              colours, type, spacing and the two fonts
src/analytics/           typed analytics events and consent
e2e/                     Playwright journeys, SEO and accessibility against the real backend
src/proxy.ts             redirects, security headers, noindex outside production and on staff pages
```

Lint enforces the boundaries: features are imported through `index.ts`, and nothing calls the API except through `src/api-client`, and `src/ui` stays presentational.

## Run

The backend (`talasey-backend`, next to this folder) must be running first.

```sh
pnpm install
pnpm setup    # .env.local, with the backend's refresh secret
pnpm dev      # http://localhost:3000
```

Full steps for both projects are in the backend's `docs/runbooks/local-setup.md`.

## Checks

```sh
pnpm lint && pnpm typecheck && pnpm test   # lint, types, unit and component tests
pnpm build && pnpm e2e                     # Playwright against the real backend (`pnpm db` there)
pnpm lighthouse                            # speed, accessibility and SEO on every template
pnpm storybook                             # components at http://localhost:6006
pnpm api:types                             # after the backend's openapi.json changes
```

More in `docs`: [components](docs/ui.md), [tokens](docs/tokens.md), [design system](docs/design-system.md), [analytics](docs/analytics.md), [API client](docs/api-client.md), [end-to-end tests](docs/e2e.md), and the staff guides for [the admin](docs/guides/admin.md), [the content editor](docs/guides/content.md) and [colour sets](docs/guides/colour-sets.md).

Pages whose content isn't published in `/content` yet use built-in placeholder copy, marked noindex.

## Staff: /admin and /content

- `src/features/staff`: sign-in (an httpOnly cookie holds the API session token), the staff shell and form helpers. Every page checks the role's permission; actions are server actions that redirect back with the result in the address, so everything works without JavaScript.
- `src/features/admin`: products (prices, stock, photos, page type, colour set), colour sets, orders (with refunds), delivery zones and their days, SKU checks, the change log with undo, and staff accounts.
- `src/features/content-editor`: the content editor. Forms are drawn from the field descriptions the API sends for each content type; drafts, publishing and preview.

Photos uploaded here are stored by the API and served through the site at `/uploads/…` (a rewrite in `next.config.ts`).

## Basket and checkout

`src/features/checkout`: add to basket on the product page, `/basket`, `/checkout` and `/order/[id]`. The basket id is kept in an httpOnly cookie, and every step is a server action that calls the API. Steps open in order: address, delivery (priced by the API from the postcode and weight), delivery day (held for 15 minutes) and lorry access for pallet orders, then payment. With `STRIPE_PUBLISHABLE_KEY` set the payment step is Stripe's Payment Element; without it, a clearly labelled test payment.

## URLs, redirects and consent

- `src/lib/urls`: the PRD section 13 keyword map and the URL rules; `url-map.test.ts` lints every path.
- `src/lib/redirects`: old addresses and where they go (`local-redirects.ts`), plus any published in `/content`. `proxy.ts` answers them.
- `src/features/consent`: the cookie dialog and Consent Mode v2. Nothing is tracked until a visitor chooses; "Cookie settings" in the footer reopens it.

## Shop pages

- `src/features/catalogue`: range, category and curated filter pages (`/[range]/`, `/[range]/[curated]/`) and search results. Ranges come from range pages in `/content`, with built-in ones for the rest. Every filter state has one URL and only curated pages are indexable (ADR 0027).
- `src/features/search`: the `ProductSearch` port with a local in-memory adapter over the published products and an Algolia adapter (ADR 0026).
- `src/features/product`: the product page, with prices per pack and per m² where coverage is known (ADR 0028).
- `src/features/content`: brand, project, guide, inspiration and help pages (ADR 0029).
- `src/features/contact`: the contact form (ADR 0030).
- `src/features/site-index`, `src/lib/robots.ts`, `src/lib/indexnow`: sitemaps by type, robots rules, IndexNow and `llms.txt` (ADR 0031).

## Caching

Loaders use `'use cache'` with tags from `src/lib/cache-tags.ts`. The API calls `POST /api/revalidate` with an HMAC-signed `{ "tags": [...] }` body after a change. Headers: `x-talasey-timestamp` (ms) and `x-talasey-signature: sha256=<hex>` over `<timestamp>.<body>`, signed with `REVALIDATE_SECRET` (the same value in both projects).

## Deploy

Vercel. `APP_ENV=production` only on the production project; every other environment sends `noindex` and a blocking robots.txt.
