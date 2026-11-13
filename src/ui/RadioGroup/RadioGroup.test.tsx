import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { Radio, RadioGroup } from './RadioGroup';

function Days() {
  return (
    <form data-testid="form">
      <RadioGroup label="Delivery day" name="date">
        <Radio value="2026-11-17" description="3 left">
          Tuesday 17 November
        </Radio>
        <Radio value="2026-11-18">Wednesday 18 November</Radio>
      </RadioGroup>
    </form>
  );
}

describe('RadioGroup', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Days />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('is one tab stop and moves between options with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Days />);
    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: /Tuesday/ }));
    await user.keyboard('{ArrowDown}');
    const wednesday = screen.getByRole('radio', { name: /Wednesday/ });
    expect(document.activeElement).toBe(wednesday);
    expect((wednesday as HTMLInputElement).checked).toBe(true);
  });

  it('submits the chosen value under its name', async () => {
    const user = userEvent.setup();
    render(<Days />);
    await user.click(screen.getByText('Wednesday 18 November'));
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('date')).toBe('2026-11-18');
  });

  it('shows a server error', () => {
    render(
      <RadioGroup label="Vehicle access" isInvalid errorMessage="Choose the largest vehicle">
        <Radio value="small">Small van</Radio>
      </RadioGroup>,
    );
    expect(screen.getByText('Choose the largest vehicle')).toBeTruthy();
  });
});
