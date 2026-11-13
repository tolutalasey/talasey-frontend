import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { SizePicker } from './SizePicker';

const options = [
  { id: '300', label: '1800 × 300 mm' },
  { id: '600', label: '1800 × 600 mm' },
  { id: '900', label: '1800 × 900 mm', note: 'Out of stock', isUnavailable: true },
];

describe('SizePicker', () => {
  it('has no axe violations', async () => {
    const { container } = render(<SizePicker label="Size" options={options} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('skips unavailable sizes with the arrow keys but still shows why', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SizePicker label="Size" options={options} defaultValue="600" onChange={onChange} />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: '1800 × 600 mm' }));
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('300');
    expect(screen.getByRole('radio', { name: /1800 × 900 mm/ })).toHaveProperty('disabled', true);
    expect(screen.getByText('Out of stock')).toBeTruthy();
  });
});
