# Design system

Tokens live in `src/tokens`, components in `src/ui`. Both follow PRD section 18; ADR 0021 (in the backend's docs) explains the choices.

## See it

```sh
pnpm tokens
pnpm storybook
```

Open http://localhost:6006. Each component has stories for its states, and the Accessibility panel runs axe on the one you are looking at.

## Check it

```sh
pnpm test                         # keyboard and axe, in jsdom
pnpm storybook:build && pnpm test:stories   # every story in Chromium: axe with contrast, focus rings, touch targets
```

## Rules

- Colours, sizes and spacing only come from tokens.
- Body text 7:1, other text 4.5:1, borders and focus rings 3:1. `line` is decorative only.
- Every focusable thing shows a 3px ring; on dark surfaces it is white.
- Controls are at least 44 × 44px; links outside sentences at least 24px tall.
- Stock, errors and colours are always said in words, never by colour alone.
- No timers: toasts stay until closed.
- Server components by default; client components only for state and keyboard handling.

## Waiting on brand input

- The palette is taken from the live site and mockups. Confirm against the brand guidelines, including `warning` (#8A4B00) and `error` (#B3261E), which we picked.
- Brand fonts: Jost and Mulish until the guidelines say otherwise.
- The logo is text in the header until we have the SVG.
- The grid gap (24px) and the sticky basket bar shadow aren't in the PRD.
- Colour set swatches need the real powder coat names and hex values.
