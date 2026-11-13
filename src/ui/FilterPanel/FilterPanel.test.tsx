import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { FilterPanel, type FilterPanelProps } from './FilterPanel';

const groups = [
  {
    id: 'colour',
    label: 'Colour',
    options: [
      { value: 'grey', label: 'Grey', count: 14 },
      { value: 'white', label: 'White', count: 6 },
    ],
  },
  { id: 'thickness', label: 'Thickness', options: [{ value: '20', label: '20 mm', count: 18 }] },
];

function setup(props: Partial<FilterPanelProps> = {}) {
  const onChange = vi.fn();
  const onClear = vi.fn();
  const view = render(
    <FilterPanel
      groups={groups}
      value={{}}
      resultCount={24}
      onChange={onChange}
      onClear={onClear}
      {...props}
    />,
  );
  return { ...view, onChange, onClear };
}

describe('FilterPanel', () => {
  it('has no axe violations', async () => {
    const { container } = setup({ value: { colour: ['grey'] } });
    expect(await axeViolations(container)).toEqual([]);
  });

  it('applies a filter from the keyboard', async () => {
    const user = userEvent.setup();
    const { onChange } = setup();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Colour' }));
    await user.tab();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith({ colour: ['grey'] });
  });

  it('announces how many products match', () => {
    setup({ resultCount: 1 });
    expect(screen.getByRole('status').textContent).toBe('1 product');
  });

  it('collapses a group from its heading', async () => {
    const user = userEvent.setup();
    setup();
    const trigger = screen.getByRole('button', { name: 'Thickness' });
    await user.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('clears only when something is chosen', async () => {
    const user = userEvent.setup();
    const { onClear, rerender } = setup();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toHaveProperty('disabled', true);
    rerender(
      <FilterPanel
        groups={groups}
        value={{ colour: ['grey'] }}
        resultCount={14}
        onChange={vi.fn()}
        onClear={onClear}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(onClear).toHaveBeenCalledOnce();
  });
});
