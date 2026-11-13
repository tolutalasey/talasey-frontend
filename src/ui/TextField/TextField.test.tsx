import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { TextField } from './TextField';

describe('TextField', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <TextField label="Postcode" description="We deliver in Great Britain" />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('labels and describes the input', () => {
    render(<TextField label="Postcode" description="We deliver in Great Britain" />);
    const input = screen.getByRole('textbox', { name: 'Postcode' });
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
    expect(screen.getByText('We deliver in Great Britain').id).toBe(
      input.getAttribute('aria-describedby'),
    );
  });

  it('shows a server error and marks the input invalid', () => {
    render(<TextField label="Postcode" isInvalid errorMessage="Enter a UK postcode" />);
    const input = screen.getByRole('textbox', { name: 'Postcode' });
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Enter a UK postcode')).toBeTruthy();
  });

  it('submits under its name', async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <TextField label="Postcode" name="postcode" />
      </form>,
    );
    await user.type(screen.getByRole('textbox'), 'M1 1AE');
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('postcode')).toBe('M1 1AE');
  });
});
