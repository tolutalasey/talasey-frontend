# Components (`src/ui`)

The component library from PRD section 18, built on React Aria Components and styled with CSS Modules and `src/tokens`. No styling JavaScript reaches the browser. Components that need state or keyboard handling are client components; the rest (breadcrumbs, product card, review card, Q&A, table, stock status, sticky basket bar, header, skip link) render on the server.

| PRD component                 | Export                                                        |
| ----------------------------- | ------------------------------------------------------------- |
| Header                        | `SiteHeader`                                                  |
| Mega menu                     | `MegaMenu` (disclosure navigation with top-level links)       |
| Search with suggestions       | `SearchField`                                                 |
| Product card                  | `ProductCard`, `StockStatus`                                  |
| Filter panel                  | `FilterPanel`                                                 |
| Gallery                       | `Gallery`                                                     |
| Colour and size pickers       | `ColourPicker`, `SizePicker`                                  |
| Quantity and project builder  | `QuantityField`, `MeasurementField`                           |
| Complete-the-job list         | `CompleteTheJob`                                              |
| Delivery checker              | `DeliveryChecker`                                             |
| Buy-mode cards                | `BuyModeCards`                                                |
| Primary and secondary buttons | `Button` (`primary` / `secondary`), `Link`                    |
| Sticky mobile basket bar      | `StickyBasketBar`                                             |
| Review card                   | `ReviewCard`                                                  |
| Q&A                           | `QandA`                                                       |
| Accordion                     | `Accordion`                                                   |
| Breadcrumbs                   | `Breadcrumbs`                                                 |
| Tables                        | `Table`                                                       |
| Forms with inline errors      | `Form`, `TextField`, `RadioGroup`, `Checkbox`, `ErrorSummary` |
| Consent dialog                | `ConsentDialog`                                               |
| Toast                         | `createToastQueue`, `ToastRegion`                             |
| Modal and drawer              | `Modal`, `Drawer`, `DialogTrigger`                            |
| (supporting)                  | `SkipLink`, `VisuallyHidden`                                  |

The app must load `@/tokens/tokens.css` once so the CSS variables exist.

Import each component from its own file, for example `import { Button } from '@/ui/Button/Button'`. There is no index file on purpose: with one, a page using a single component downloaded all of them (about 70 KB of compressed JavaScript on every page). Lint refuses `@/ui`.

Rules every component follows: a visible 3px focus ring, targets of at least 44 × 44px (24px for links outside sentences), meaning never carried by colour alone, and no timers (toasts stay until closed). Components take data and callbacks as props; lint stops `src/ui` importing the API client, analytics or the app.

## Storybook

```sh
npm run storybook                           # http://localhost:6006
```

Every component has stories for its states (empty, chosen, error, disabled, open). The Accessibility panel runs axe on the story you are looking at.

## Tests

```sh
npm run test                                # Vitest + Testing Library: keyboard and axe in jsdom
npm run storybook:build && npm run test:stories   # every story in Chromium
```

`test:stories` opens each story at 375px and 1280px and checks three things: no axe violations (including colour contrast, which jsdom can't measure), a focus ring of at least 3px on every tab stop, and touch targets of at least 44 × 44px. Install Chromium once with `npx playwright install chromium`.
