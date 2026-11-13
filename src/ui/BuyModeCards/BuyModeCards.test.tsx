import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { BuyModeCards } from './BuyModeCards';

const modes = [
  { id: 'buy', title: 'Buy now', description: 'Delivered on a pallet', price: '£89.99' },
  { id: 'sample', title: 'Order a sample', description: 'Free, posted in 2 days', price: '£0' },
  { id: 'quote', title: 'Get it laid', description: 'Quotes from up to 3 installers' },
];

describe('BuyModeCards', () => {
  it('has no axe violations', async () => {
    const { container } = render(<BuyModeCards label="How would you like it?" modes={modes} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('describes each card and moves with the arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <BuyModeCards
        label="How would you like it?"
        modes={modes}
        defaultValue="buy"
        onChange={onChange}
      />,
    );
    const sample = screen.getByRole('radio', { name: /Order a sample/ });
    expect(sample.getAttribute('aria-describedby')).toBeTruthy();
    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith('sample');
  });
});
