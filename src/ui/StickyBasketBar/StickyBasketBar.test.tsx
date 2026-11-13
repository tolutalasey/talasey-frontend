import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { StickyBasketBar } from './StickyBasketBar';

const bar = {
  summary: '3 items',
  total: '£269.97',
  actionLabel: 'View basket',
  href: '/basket',
};

describe('StickyBasketBar', () => {
  it('has no axe violations', async () => {
    const { container } = render(<StickyBasketBar {...bar} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('is a named region with one link to the basket', async () => {
    const user = userEvent.setup();
    render(<StickyBasketBar {...bar} />);
    expect(screen.getByRole('region', { name: 'Basket' })).toBeTruthy();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'View basket' }));
  });
});
