import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { CompleteTheJob } from './CompleteTheJob';

const items = [
  {
    id: 'pavetuf',
    name: 'Pavetuf jointing compound',
    reason: 'About 3 tubs for 18 m²',
    price: '£119.97',
  },
  { id: 'primer', name: 'Slurry primer', reason: '1 bag covers 20 m²', price: '£24.99' },
];

describe('CompleteTheJob', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <CompleteTheJob label="Complete the job" items={items} onAdd={vi.fn()} />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('adds the ticked items, chosen from the keyboard', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<CompleteTheJob label="Complete the job" items={items} onAdd={onAdd} />);
    const add = screen.getByRole('button', { name: 'Add to basket' });
    expect(add).toHaveProperty('disabled', true);
    await user.tab();
    await user.keyboard(' ');
    await user.tab();
    await user.keyboard(' ');
    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Add 2 items to basket' }),
    );
    await user.keyboard('{Enter}');
    expect(onAdd).toHaveBeenCalledWith(['pavetuf', 'primer']);
  });
});
