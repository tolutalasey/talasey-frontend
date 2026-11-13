import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SelectField } from './SelectField';

describe('SelectField', () => {
  it('labels the choice and starts on the given value', () => {
    render(
      <SelectField
        label="Stock"
        name="stockMode"
        defaultValue="stocked"
        emptyLabel="Not set"
        options={[{ value: 'stocked', label: 'Stocked only' }, 'made_to_order']}
      />,
    );
    const select = screen.getByRole('combobox', { name: 'Stock' }) as HTMLSelectElement;
    expect(select.value).toBe('stocked');
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Not set',
      'Stocked only',
      'made_to_order',
    ]);
  });
});
