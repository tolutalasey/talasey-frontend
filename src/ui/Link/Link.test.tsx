import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { Link } from './Link';

describe('Link', () => {
  it('renders an anchor with no axe violations', async () => {
    const { container } = render(<Link href="/porcelain-paving/">Porcelain paving</Link>);
    expect(screen.getByRole('link', { name: 'Porcelain paving' }).getAttribute('href')).toBe(
      '/porcelain-paving/',
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('is reached by Tab and shows a focus ring', async () => {
    const user = userEvent.setup();
    render(<Link href="/guides/">Guides</Link>);
    await user.tab();
    const link = screen.getByRole('link');
    expect(link).toBe(document.activeElement);
    expect(link.hasAttribute('data-focus-visible')).toBe(true);
  });
});
