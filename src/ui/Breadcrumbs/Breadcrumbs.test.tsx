import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { Breadcrumbs } from './Breadcrumbs';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Porcelain paving', href: '/porcelain-paving/' },
  { label: 'Dusk grey porcelain paving' },
];

describe('Breadcrumbs', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Breadcrumbs items={items} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('marks the last crumb as the current page and links the rest', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy();
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
      '/',
      '/porcelain-paving/',
    ]);
    expect(screen.getByText('Dusk grey porcelain paving').getAttribute('aria-current')).toBe(
      'page',
    );
  });

  it('tabs through the links in order', async () => {
    const user = userEvent.setup();
    render(<Breadcrumbs items={items} />);
    await user.tab();
    expect(document.activeElement?.textContent).toBe('Home');
    await user.tab();
    expect(document.activeElement?.textContent).toBe('Porcelain paving');
  });
});
