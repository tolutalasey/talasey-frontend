import { describe, expect, it } from 'vitest';
import { fromLondonTime, londonLabel, toLondonTime } from './london-time';

describe('London time', () => {
  it('reads winter times as GMT and summer times as BST', () => {
    expect(fromLondonTime('2026-11-16T09:00')?.toISOString()).toBe('2026-11-16T09:00:00.000Z');
    expect(fromLondonTime('2026-07-01T09:00')?.toISOString()).toBe('2026-07-01T08:00:00.000Z');
  });

  it('handles the mornings the clocks change', () => {
    expect(fromLondonTime('2026-03-29T03:00')?.toISOString()).toBe('2026-03-29T02:00:00.000Z');
    expect(fromLondonTime('2026-10-25T00:30')?.toISOString()).toBe('2026-10-24T23:30:00.000Z');
  });

  it('turns a moment back into what the field shows', () => {
    expect(toLondonTime(new Date('2026-07-01T08:00:00Z'))).toBe('2026-07-01T09:00');
  });

  it('refuses anything that is not a date and time', () => {
    expect(fromLondonTime('next Monday')).toBeNull();
  });

  it('labels a time the way staff read it', () => {
    const label = londonLabel('2026-11-16T09:00:00.000Z');
    expect(label).toContain('Monday');
    expect(label).toContain('16 November 2026');
    expect(label).toContain('09:00');
  });
});
