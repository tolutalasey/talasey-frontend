import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { ErrorSummary } from './ErrorSummary';

const errors = [
  { fieldId: 'postcode', message: 'Enter a UK postcode, like M1 1AE' },
  { fieldId: 'phone', message: 'Enter a phone number so the driver can call ahead' },
];

describe('ErrorSummary', () => {
  it('has no axe violations', async () => {
    const { container } = render(<ErrorSummary errors={errors} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('takes focus and links each error to its field', () => {
    render(<ErrorSummary errors={errors} />);
    const summary = screen.getByRole('group', { name: 'There is a problem' });
    expect(document.activeElement).toBe(summary);
    expect(
      screen.getByRole('link', { name: 'Enter a UK postcode, like M1 1AE' }).getAttribute('href'),
    ).toBe('#postcode');
  });

  it('renders nothing without errors', () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container.innerHTML).toBe('');
  });
});
