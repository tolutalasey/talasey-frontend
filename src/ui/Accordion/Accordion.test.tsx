import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { Accordion } from './Accordion';

const items = [
  { id: 'delivery', title: 'Delivery', content: <p>Pallet delivery from £45.</p> },
  { id: 'care', title: 'Care', content: <p>Wash with warm soapy water.</p> },
];

describe('Accordion', () => {
  it('has no axe violations, open or closed', async () => {
    const { container } = render(<Accordion items={items} defaultExpandedKeys={['care']} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('opens and closes a section from the keyboard', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const trigger = screen.getByRole('button', { name: 'Delivery' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    await user.tab();
    await user.keyboard('{Enter}');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Pallet delivery from £45.')).toBeTruthy();
    await user.keyboard(' ');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('puts each trigger inside a heading', () => {
    render(<Accordion items={items} headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Care' })).toBeTruthy();
  });
});
