import { color } from './tokens';

export type ContrastLevel = 'body text' | 'other text' | 'ui part';

export interface ContrastRule {
  use: string;
  foreground: string;
  background: string;
  level: ContrastLevel;
}

// PRD sections 12 and 18: body text 7:1, everything else 4.5:1, and 3:1 for UI parts such as
// borders and focus rings. `line` is decorative only and has no rule.
export const minimumRatio: Record<ContrastLevel, number> = {
  'body text': 7,
  'other text': 4.5,
  'ui part': 3,
};

const lightSurfaces = { white: color.white, stone50: color.stone50, brand50: color.brand50 };
const darkSurfaces = {
  brand600: color.brand600,
  brand800: color.brand800,
  brand950: color.brand950,
};

const on = (
  surfaces: Record<string, string>,
  foreground: string,
  use: string,
  level: ContrastLevel,
): ContrastRule[] =>
  Object.entries(surfaces).map(([name, background]) => ({
    use: `${use} on ${name}`,
    foreground,
    background,
    level,
  }));

export const contrastRules: ContrastRule[] = [
  ...on(lightSurfaces, color.ink, 'Headings and body text', 'body text'),
  ...on(lightSurfaces, color.inkMuted, 'Secondary text', 'body text'),
  ...on(lightSurfaces, color.brand600, 'Links', 'other text'),
  ...on(lightSurfaces, color.brand800, 'Hovered links', 'other text'),
  ...on(lightSurfaces, color.success, 'In stock', 'other text'),
  ...on(lightSurfaces, color.warning, 'Low stock', 'other text'),
  ...on(lightSurfaces, color.error, 'Form errors', 'other text'),
  ...on(darkSurfaces, color.white, 'Button, top bar and footer text', 'other text'),
  ...on({ brand950: color.brand950 }, color.brand50, 'Footer secondary text', 'other text'),
  ...on(lightSurfaces, color.inkMuted, 'Input borders', 'ui part'),
  ...on(lightSurfaces, color.brand600, 'Focus ring and selected borders', 'ui part'),
  ...on({ white: color.white }, color.error, 'Invalid input borders', 'ui part'),
  ...on(darkSurfaces, color.white, 'Focus ring on dark surfaces', 'ui part'),
];
