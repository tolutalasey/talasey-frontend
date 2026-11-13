import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('keeps the text in the accessible name', () => {
    render(
      <button type="button">
        <span aria-hidden="true">×</span>
        <VisuallyHidden>Close basket</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole('button', { name: 'Close basket' })).toBeTruthy();
  });

  it('renders the element it is given', () => {
    render(<VisuallyHidden as="h2">Filters</VisuallyHidden>);
    expect(screen.getByRole('heading', { level: 2, name: 'Filters' })).toBeTruthy();
  });
});
