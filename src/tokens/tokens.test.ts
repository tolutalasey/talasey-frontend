import { describe, expect, it } from 'vitest';
import { color, fluid, fontSize, typeScale, viewport } from './tokens';

const sizeAt = (clamp: string, width: number) => {
  const match = /clamp\(([\d.]+)rem, ([-\d.]+)rem \+ ([\d.]+)vw, ([\d.]+)rem\)/.exec(clamp);
  if (!match) return Number.parseFloat(clamp) * 16;
  const [min, base, slope, max] = match.slice(1).map(Number) as [number, number, number, number];
  return Math.min(Math.max(base * 16 + (slope * width) / 100, min * 16), max * 16);
};

describe('type scale', () => {
  it.each(Object.entries(typeScale))(
    '%s is the PRD mobile size on phones and the desktop size at 1280px',
    (name, size) => {
      const clamp = fontSize[name as keyof typeof fontSize];
      expect(sizeAt(clamp, viewport.mobile)).toBeCloseTo(size.mobile, 1);
      expect(sizeAt(clamp, viewport.desktop)).toBeCloseTo(size.desktop, 1);
    },
  );

  it('uses a fixed size when phone and desktop sizes match', () => {
    expect(fluid({ mobile: 14, desktop: 14 })).toBe('0.875rem');
  });
});

describe('colour tokens', () => {
  it('match the logo and the 2026 brochures', () => {
    expect(color).toMatchObject({
      brand600: '#6C1B78',
      brand800: '#4A0F55',
      brand950: '#2B0337',
      brand50: '#F4ECF5',
      stone: '#EFE4DC',
      ink: '#2A282C',
      inkMuted: '#504A56',
      stone50: '#F6F2EF',
      line: '#E8E1DC',
      success: '#1F6B45',
    });
  });
});
