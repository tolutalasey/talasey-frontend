# Design tokens (`src/tokens`)

Design tokens taken from the Talasey logo and the 2026 brochures: colour, type scale, spacing, radius, borders, focus ring, touch targets, shadows, motion and the layout grid. Plus the two self-hosted fonts.

- `import { color } from '@/tokens'` for TypeScript.
- `import '@/tokens/tokens.css'` for CSS custom properties (`--color-brand600`, `--space-4`, `--target-min`, ...). It's generated from `tokens.ts` by `npm run tokens`, which `dev`, `build` and `test` run first.
- `fonts/`: Gilda Display (headings) and Hanken Grotesk (text, weight axis, 35 KB) as Latin WOFF2 files. Gilda Display stands in for The Seasons, the serif in the brochures, which is an Adobe font; Hanken Grotesk is the open version of HK Grotesk, which the brochures and talasey.co.uk use. The storefront loads them with `next/font/local`; `fonts/fonts.css` is for Storybook and anything else without `next/font`.

```sh
npm run tokens
npm run test     # type scale and the WCAG contrast rules
```

## Type scale

`typeScale` holds the sizes in pixels (H1 56/36, H2 40/28, H3 26/22, body 17/16, small 14). `fontSize` turns each into a `clamp()` that is exactly the mobile size at 375px and the desktop size at 1280px.

## Contrast rules

`contrastRules` lists every text and UI pairing we use with the minimum it must meet: body text 7:1, other text 4.5:1, UI parts such as borders and focus rings 3:1. The tests fail if a change to a colour breaks any of them. `line` is decorative only and never used for text or controls.

## Where the colours come from

- `brand600` #6C1B78: the plum of the logo. `brand800` #4A0F55 is its hover. `brand950` #2B0337: the aubergine panels in the brochures.
- `stone` #EFE4DC: the warm headings on aubergine in the brochures, also the stickers and caption text. `stoneMuted` #C4B2BF: body text on aubergine. `silver` #D1D2D4: the light square in the logo.
- `warning` and `error` were picked by us to pass 4.5:1. Confirm all of these against the brand guidelines when they arrive.

## Rebuilding the fonts

The files are Gilda Display from `@fontsource/gilda-display` (the free stand-in for the brand's The Seasons) and the Latin variable font from `@fontsource-variable/hanken-grotesk` (version 5, SIL Open Font License, copies in `fonts/`). To use The Seasons instead, add its licensed file and point `--font-display` at it in `src/app/layout.tsx`.
