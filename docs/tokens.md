# Design tokens (`src/tokens`)

Design tokens from PRD section 18: colour, type scale, spacing, radius, borders, focus ring, touch targets, the one shadow and the layout grid. Plus the two self-hosted fonts.

- `import { color } from '@/tokens'` for TypeScript.
- `import '@/tokens/tokens.css'` for CSS custom properties (`--color-brand600`, `--space-4`, `--target-min`, ...). It's generated from `tokens.ts` by `pnpm tokens`, which `dev`, `build` and `test` run first.
- `fonts/`: Jost (500–600) and Mulish (400–700) as variable WOFF2 files, cut down to Latin and the punctuation we use (£, ×, –, ’, “ ”). 33 KB for both. The storefront loads them with `next/font/local`; `fonts/fonts.css` is for Storybook and anything else without `next/font`.

```sh
pnpm tokens
pnpm test     # type scale and the WCAG contrast rules
```

## Type scale

`typeScale` holds the PRD sizes in pixels (H1 56/36, H2 38/28, H3 26/22, body 17/16, small 14). `fontSize` turns each into a `clamp()` that is exactly the mobile size at 375px and the desktop size at 1280px.

## Contrast rules

`contrastRules` lists every text and UI pairing we use with the minimum it must meet: body text 7:1, other text 4.5:1, UI parts such as borders and focus rings 3:1. The tests fail if a change to a colour breaks any of them. `line` is decorative only and never used for text or controls.

## Still to confirm

The colours come from the live site and the redesign mockups, not the brand guidelines. `warning` and `error` were picked by us to pass 4.5:1. The grid gap (24px), the sticky bar shadow and the white focus ring on dark surfaces aren't in the PRD either.

## Rebuilding the fonts

The source files are the Latin variable fonts from `@fontsource-variable/jost` and `@fontsource-variable/mulish` (5.3.0, SIL Open Font License, copies in `fonts/`). They were narrowed with fontTools: the weight axis cut to 500–600 and 400–700, and the character set to U+0020–007E, U+00A0–00FF and ‘ ’ “ ” – — • … € ™ − →.
