import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { ReviewCard } from './ReviewCard';

const review = {
  rating: 4,
  title: 'Looks great after a wet winter',
  body: 'Laid in March, still no moss and the grey has not faded.',
  author: 'Sam from Bolton',
  date: '2026-10-02',
  dateLabel: '2 October 2026',
  verified: true,
} as const;

describe('ReviewCard', () => {
  it('has no axe violations', async () => {
    const { container } = render(<ReviewCard {...review} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('gives the rating in words and hides the stars', () => {
    const { container } = render(<ReviewCard {...review} />);
    expect(screen.getByText('Rated 4 out of 5')).toBeTruthy();
    expect(container.querySelectorAll('[aria-hidden="true"] svg')).toHaveLength(5);
  });

  it('marks up the date for machines', () => {
    render(<ReviewCard {...review} />);
    expect(screen.getByText('2 October 2026').getAttribute('datetime')).toBe('2026-10-02');
  });
});
