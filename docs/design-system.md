# Design system

Tokens live in `src/tokens`, components in `src/ui`. Both follow PRD section 18; ADR 0021 (in the backend's docs) explains the choices.

## See it

```sh
npm run tokens
npm run storybook
```

Open http://localhost:6006. Each component has stories for its states, and the Accessibility panel runs axe on the one you are looking at.

## Check it

```sh
npm run test                         # keyboard and axe, in jsdom
npm run storybook:build && npm run test:stories   # every story in Chromium: axe with contrast, focus rings, touch targets
```

## Rules

- Colours, sizes and spacing only come from tokens.
- Body text 7:1, other text 4.5:1, borders and focus rings 3:1. `line` is decorative only.
- Every focusable thing shows a 3px ring; on dark surfaces it is white.
- Controls are at least 44 × 44px; links outside sentences at least 24px tall.
- Stock, errors and colours are always said in words, never by colour alone.
- No timers: toasts stay until closed.
- Server components by default; client components only for state and keyboard handling.

## The look

The design follows the 2026 brochures (Pergolas, Finishing Touches, Porcelain & Stone):

- Real project photos, square-cornered, with a plum caption tag naming the product (`.caption`).
- Aubergine panels beside photos (`ui/SplitPanel`), the trust strip (`ui/TrustStrip`), the promo line and the footer.
- Serif headings (Gilda Display) and Hanken Grotesk text, Extra Light for body copy and Light for small text, as in the Extended Range Brand Styling 2026 guide; eyebrows in tracked capitals (`.eyebrow`) like the logo's strapline.
- One round stamp per page (`.sticker`), for an offer or a standout fact.
- Link buttons: `.button`, `.button-secondary`, and `.button-on-dark` / `.button-outline-on-dark` on aubergine.
- The home page's moving wall of brochure photos (`features/home/components/Showcase`) is CSS only. It pauses on hover, on focus and with its Pause switch, and stands still for anyone who asks their device for less motion.
- Sections ease in on scroll (`data-reveal`) only where the browser supports scroll-linked animation and the visitor allows motion; otherwise they are simply there.

Brochure photos are in `public/images/brand/`, listed in `features/home/brand.ts`. Some were contributed by landscaping firms (credited on talasey.co.uk/brochures/); keep their credit and check with Amy before using them anywhere else. The design itself is the "Talasey" design system and "Talasey shop screens" canvas in Claude.

## Waiting on brand input

- Confirm the palette against the brand guidelines, including `warning` (#8A4B00) and `error` (#B3261E), which we picked.
- Headings use Gilda Display in place of The Seasons until Talasey's Adobe Fonts licence covers the site.
- The logo is a PNG from talasey.co.uk until we have the SVG.
- Product photos: the master sheet has none yet, so products show a placeholder.
- The grid gap (24px) and the sticky basket bar shadow aren't in the PRD.
- Colour set swatches need the real powder coat names and hex values.
