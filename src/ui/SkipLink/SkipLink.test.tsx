import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  function renderPage() {
    return render(
      <>
        <SkipLink />
        <nav>
          <a href="/">Home</a>
        </nav>
        <main id="main" tabIndex={-1}>
          <h1>Page</h1>
        </main>
      </>,
    );
  }

  it('is the first thing keyboard users reach', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'Skip to main content' }));
  });

  it('points at the main landmark', () => {
    renderPage();
    expect(screen.getByRole('link', { name: 'Skip to main content' }).getAttribute('href')).toBe(
      '#main',
    );
  });

  it('has no axe violations', async () => {
    const { container } = renderPage();
    expect(await axeViolations(container)).toEqual([]);
  });
});
