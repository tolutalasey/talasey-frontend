import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { MegaMenu } from './MegaMenu';

const sections = [
  {
    id: 'paving',
    label: 'Paving',
    href: '/porcelain-paving/',
    columns: [
      {
        heading: 'Porcelain',
        links: [
          { label: 'Grey porcelain', href: '/porcelain-paving/grey/' },
          { label: '20 mm porcelain', href: '/porcelain-paving/20mm/' },
        ],
      },
    ],
  },
  {
    id: 'decking',
    label: 'Decking',
    href: '/composite-decking/',
    columns: [{ heading: 'Brands', links: [{ label: 'Piranha', href: '/piranha/' }] }],
  },
];

describe('MegaMenu', () => {
  it('has no axe violations, closed or open', async () => {
    const user = userEvent.setup();
    const { container } = render(<MegaMenu sections={sections} />);
    expect(await axeViolations(container)).toEqual([]);
    await user.click(screen.getByRole('button', { name: 'Paving menu' }));
    expect(await axeViolations(container)).toEqual([]);
  });

  it('keeps section pages as plain links', () => {
    render(<MegaMenu sections={sections} />);
    expect(screen.getByRole('link', { name: 'Paving' }).getAttribute('href')).toBe(
      '/porcelain-paving/',
    );
  });

  it('opens a panel from the keyboard and closes it with Escape, back on its button', async () => {
    const user = userEvent.setup();
    render(<MegaMenu sections={sections} />);
    await user.tab();
    await user.tab();
    const toggle = screen.getByRole('button', { name: 'Paving menu' });
    expect(document.activeElement).toBe(toggle);
    await user.keyboard('{Enter}');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Grey porcelain' }));
    await user.keyboard('{Escape}');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });

  it('opens one panel at a time and closes on a click outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <MegaMenu sections={sections} />
        <p>Outside</p>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Paving menu' }));
    await user.click(screen.getByRole('button', { name: 'Decking menu' }));
    expect(screen.getByRole('button', { name: 'Paving menu' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
    await user.click(screen.getByText('Outside'));
    expect(screen.getByRole('button', { name: 'Decking menu' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
  });
});
