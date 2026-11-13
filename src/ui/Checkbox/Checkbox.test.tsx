import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { Checkbox, CheckboxGroup } from './Checkbox';

function Finishes({ onChange = vi.fn() }: { onChange?: (value: string[]) => void }) {
  return (
    <CheckboxGroup label="Finish" onChange={onChange}>
      <Checkbox value="corten">Weathered steel</Checkbox>
      <Checkbox value="powder">Powder coated</Checkbox>
    </CheckboxGroup>
  );
}

describe('Checkbox', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Finishes />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('toggles with Space and moves with Tab', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Finishes onChange={onChange} />);
    await user.tab();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(['corten']);
    await user.tab();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenLastCalledWith(['corten', 'powder']);
    expect(screen.getByRole('checkbox', { name: 'Powder coated' })).toHaveProperty('checked', true);
  });

  it('names the group', () => {
    render(<Finishes />);
    expect(screen.getByRole('group', { name: 'Finish' })).toBeTruthy();
  });
});
