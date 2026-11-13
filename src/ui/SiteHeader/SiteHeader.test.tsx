import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { SiteHeader } from './SiteHeader';

describe('SiteHeader', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <SiteHeader logo="Talasey" basketHref="/basket" basketCount={2} />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('is the banner landmark and says how many items are in the basket', () => {
    render(<SiteHeader logo="Talasey" basketHref="/basket" basketCount={2} />);
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Basket 2 items' })).toBeTruthy();
  });

  it('shows no count for an empty basket', () => {
    render(<SiteHeader logo="Talasey" basketHref="/basket" basketCount={0} />);
    expect(screen.getByRole('link', { name: 'Basket' })).toBeTruthy();
  });

  it('tabs from the logo to search to the basket', async () => {
    const user = userEvent.setup();
    render(
      <SiteHeader
        logo="Talasey"
        basketHref="/basket"
        basketCount={1}
        search={<input aria-label="Search" />}
      />,
    );
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Talasey home' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Search' }));
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Basket 1 item' }));
  });
});
