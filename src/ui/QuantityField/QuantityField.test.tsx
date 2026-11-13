import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { MeasurementField, QuantityField } from './QuantityField';

describe('QuantityField', () => {
  it('has no axe violations', async () => {
    const { container } = render(<QuantityField label="Packs" defaultValue={2} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('steps with the arrow keys and stops at the minimum', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityField label="Packs" defaultValue={2} onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Packs' });
    await user.click(input);
    await user.keyboard('{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith(3);
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(input).toHaveProperty('value', '1');
  });

  it('names the buttons and keeps them out of the tab order', () => {
    render(<QuantityField label="Packs" defaultValue={2} />);
    expect(screen.getByRole('button', { name: 'Increase Packs' }).tabIndex).toBe(-1);
    expect(screen.getByRole('button', { name: 'Decrease Packs' }).tabIndex).toBe(-1);
  });
});

describe('MeasurementField', () => {
  it('reads the unit with the label and has no axe violations', async () => {
    const { container } = render(
      <MeasurementField label="Patio area" unit="m²" unitLabel="square metres" />,
    );
    expect(screen.getByRole('textbox', { name: 'Patio area in square metres' })).toBeTruthy();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('takes decimals typed from the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MeasurementField
        label="Patio area"
        unit="m²"
        unitLabel="square metres"
        onChange={onChange}
      />,
    );
    await user.tab();
    await user.keyboard('12.5');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(12.5);
  });
});
