import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { SearchField, type SearchFieldProps } from './SearchField';

const suggestions = [
  { id: 'porcelain', label: 'Porcelain paving', hint: '86 products' },
  { id: 'how-to-lay', label: 'How to lay porcelain', hint: 'Guide' },
];

function setup(props: Partial<SearchFieldProps> = {}) {
  const handlers = { onInputChange: vi.fn(), onSelect: vi.fn(), onSubmit: vi.fn() };
  const view = render(<SearchField suggestions={suggestions} {...handlers} {...props} />);
  return { ...view, ...handlers };
}

describe('SearchField', () => {
  it('has no axe violations', async () => {
    const { container } = setup();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('is a search landmark with a named combobox', () => {
    setup();
    expect(screen.getByRole('search')).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Search products and guides' })).toBeTruthy();
  });

  it('opens suggestions as you type and picks one with the arrow keys', async () => {
    const user = userEvent.setup();
    const { onSelect, onInputChange } = setup();
    await user.tab();
    await user.keyboard('porc');
    expect(onInputChange).toHaveBeenLastCalledWith('porc');
    expect(screen.getByRole('listbox')).toBeTruthy();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith(suggestions[1]);
  });

  it('searches for what was typed on Enter', async () => {
    const user = userEvent.setup();
    const { onSubmit } = setup({ suggestions: [] });
    await user.tab();
    await user.keyboard('fire pit{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('fire pit');
  });

  it('is a plain GET form to the search page without JavaScript', () => {
    const { container } = render(
      <SearchField
        suggestions={[]}
        onInputChange={() => undefined}
        onSelect={() => undefined}
        onSubmit={() => undefined}
        action="/search/"
      />,
    );
    const form = container.querySelector('form');
    expect(form?.getAttribute('action')).toBe('/search/');
    expect(form?.getAttribute('method')).toBe('get');
    expect(container.querySelector('input')?.getAttribute('name')).toBe('q');
  });
});
