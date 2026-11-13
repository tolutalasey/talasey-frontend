import { describe, expect, it } from 'vitest';
import { allowedTypos, editDistance, normalise, slugify, words } from './text';

describe('normalise', () => {
  it('lowercases, drops punctuation and spells out the size cross', () => {
    expect(normalise('1800 × 600 mm — Powder Coated')).toBe('1800 x 600 mm powder coated');
  });

  it('joins fire pit into one word however it is typed', () => {
    expect(normalise('Fire pits')).toBe('firepit');
    expect(normalise('fire-pit liner')).toBe('firepit liner');
  });
});

describe('words', () => {
  it('drops plural endings', () => {
    expect(words('Screens and batteries')).toEqual(['screen', 'and', 'battery']);
  });
});

describe('typo tolerance', () => {
  it('allows none under 4 letters, one up to 7 and two from 8', () => {
    expect([allowedTypos('cap'), allowedTypos('screen'), allowedTypos('jointing')]).toEqual([
      0, 1, 2,
    ]);
  });

  it('never allows typos in numbers', () => {
    expect(allowedTypos('1800')).toBe(0);
  });

  it('counts a swapped pair of letters as one typo', () => {
    expect(editDistance('sceren', 'screen', 1)).toBe(1);
    expect(editDistance('porcleain', 'porcelain', 2)).toBe(1);
    expect(editDistance('paving', 'parking', 1)).toBe(2);
  });
});

describe('slugify', () => {
  it('makes URL-safe filter values', () => {
    expect(slugify('1800 × 300 mm')).toBe('1800-x-300-mm');
    expect(slugify('Powder Coated')).toBe('powder-coated');
  });
});
