import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';
import { contrastRules, minimumRatio } from './contrast-rules';
import { color } from './tokens';

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
  });

  it('is symmetric', () => {
    expect(contrastRatio(color.ink, color.stone50)).toBe(contrastRatio(color.stone50, color.ink));
  });

  it('rejects anything but 6-digit hex', () => {
    expect(() => contrastRatio('purple', '#FFFFFF')).toThrow();
  });
});

describe('Talasey palette', () => {
  it.each(contrastRules.map((rule) => [rule.use, rule.level, rule]))(
    '%s meets the %s minimum',
    (_, level, rule) => {
      expect(contrastRatio(rule.foreground, rule.background)).toBeGreaterThanOrEqual(
        minimumRatio[level],
      );
    },
  );

  it('matches the ratios PRD section 18 quotes for the brand colours', () => {
    expect(contrastRatio(color.brand600, color.white)).toBeCloseTo(10.9, 0);
    expect(contrastRatio(color.brand800, color.white)).toBeCloseTo(14, 0);
    expect(contrastRatio(color.ink, color.white)).toBeCloseTo(17, 0);
    expect(contrastRatio(color.success, color.white)).toBeCloseTo(6.5, 0);
  });

  it('keeps the decorative line colour out of text and controls', () => {
    expect(contrastRatio(color.line, color.white)).toBeLessThan(3);
    expect(contrastRules.some((rule) => rule.foreground === color.line)).toBe(false);
  });
});
