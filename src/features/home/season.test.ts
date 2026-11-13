import { describe, expect, it } from 'vitest';
import { fallbackHomeContent } from './content';
import { seasonalBlockFor, seasonFor } from './season';

describe('seasonFor', () => {
  it.each([
    ['2027-01-15', 'winter'],
    ['2027-03-01', 'spring'],
    ['2027-06-30', 'summer'],
    ['2026-11-13', 'autumn'],
    ['2026-12-01', 'winter'],
  ])('%s is %s', (date, season) => {
    expect(seasonFor(new Date(date))).toBe(season);
  });
});

describe('seasonalBlockFor', () => {
  it('shows patio care in autumn', () => {
    expect(seasonalBlockFor(fallbackHomeContent, new Date('2026-11-13'))?.heading).toMatch(
      /patio before winter/,
    );
  });

  it('shows nothing when the season has no block', () => {
    const springOnly = {
      ...fallbackHomeContent,
      seasonalBlocks: fallbackHomeContent.seasonalBlocks.filter((b) => b.season === 'spring'),
    };
    expect(seasonalBlockFor(springOnly, new Date('2026-08-01'))).toBeNull();
  });
});
