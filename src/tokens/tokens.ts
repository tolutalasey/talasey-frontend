export const color = {
  brand50: '#F3ECF7',
  brand600: '#5E2378',
  brand800: '#3F1752',
  brand950: '#2A1036',
  ink: '#1E1A22',
  inkMuted: '#4A4250',
  stone50: '#F6F2F0',
  line: '#E7E1EA',
  white: '#FFFFFF',
  success: '#1F6B45',
  warning: '#8A4B00',
  error: '#B3261E',
} as const;

export const font = {
  display: "'Jost', system-ui, sans-serif",
  body: "'Mulish', system-ui, sans-serif",
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// PRD section 18 type scale in pixels: phones get the mobile size, 1280px screens and wider the
// desktop size, and sizes in between scale smoothly.
export const typeScale = {
  h1: { mobile: 36, desktop: 56 },
  h2: { mobile: 28, desktop: 38 },
  h3: { mobile: 22, desktop: 26 },
  body: { mobile: 16, desktop: 17 },
  small: { mobile: 14, desktop: 14 },
} as const;

export const viewport = { mobile: 375, desktop: 1280 } as const;

const rem = (px: number) => `${+(px / 16).toFixed(4)}rem`;

export function fluid({ mobile, desktop }: { mobile: number; desktop: number }): string {
  if (mobile === desktop) return rem(mobile);
  const slope = (desktop - mobile) / (viewport.desktop - viewport.mobile);
  const intercept = mobile - slope * viewport.mobile;
  return `clamp(${rem(mobile)}, ${rem(intercept)} + ${+(slope * 100).toFixed(4)}vw, ${rem(desktop)})`;
}

export const fontSize = {
  h1: fluid(typeScale.h1),
  h2: fluid(typeScale.h2),
  h3: fluid(typeScale.h3),
  body: fluid(typeScale.body),
  small: fluid(typeScale.small),
} as const;

export const space = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
} as const;

export const radius = {
  control: '8px',
  card: '12px',
} as const;

export const border = {
  input: '1.5px',
} as const;

export const focus = {
  ringWidth: '3px',
  ringColor: color.brand600,
  ringColorOnDark: color.white,
  ringOffset: '2px',
} as const;

// WCAG 2.2 target size: 44px for touch, 24px between small inline controls.
export const target = {
  min: '44px',
  spacing: '24px',
} as const;

// No drop shadows except the sticky mobile basket bar.
export const shadow = {
  stickyBar: '0 -4px 16px rgb(30 26 34 / 0.12)',
} as const;

export const layout = {
  maxWidth: '1280px',
  gutterDesktop: '80px',
  gutterMobile: '16px',
  columnsDesktop: '12',
  columnsMobile: '4',
  columnGap: '24px',
  measure: '70ch',
} as const;

export const tokens = {
  color,
  font,
  fontWeight,
  fontSize,
  space,
  radius,
  border,
  focus,
  target,
  shadow,
  layout,
} as const;

export type Tokens = typeof tokens;
