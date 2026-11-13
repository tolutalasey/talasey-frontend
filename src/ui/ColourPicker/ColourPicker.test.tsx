import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { ColourPicker } from './ColourPicker';

const colours = [
  { id: 'anthracite', name: 'Anthracite grey', hex: '#383E42' },
  { id: 'jet-black', name: 'Jet black', hex: '#0A0A0A' },
  { id: 'signal-white', name: 'Signal white', hex: '#F4F4F4' },
];

describe('ColourPicker', () => {
  it('has no axe violations', async () => {
    const { container } = render(<ColourPicker label="Colour" colours={colours} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('names every colour in words', () => {
    render(<ColourPicker label="Colour" colours={colours} />);
    expect(screen.getAllByRole('radio').map((radio) => radio.getAttribute('value'))).toEqual([
      'anthracite',
      'jet-black',
      'signal-white',
    ]);
    expect(screen.getByRole('radio', { name: 'Jet black' })).toBeTruthy();
  });

  it('is one tab stop and moves with the arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColourPicker label="Colour" colours={colours} onChange={onChange} />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('jet-black');
    await user.tab();
    expect(document.activeElement).toBe(document.body);
  });
});
