import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { Button } from './Button';

describe('Button', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Button>Add to basket</Button>);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('is reached by Tab and shows a focus ring', async () => {
    const user = userEvent.setup();
    render(<Button>Add to basket</Button>);
    await user.tab();
    const button = screen.getByRole('button', { name: 'Add to basket' });
    expect(button).toBe(document.activeElement);
    expect(button.hasAttribute('data-focus-visible')).toBe(true);
  });

  it.each(['{Enter}', ' '])('fires onPress from the keyboard (%s)', async (key) => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Order sample</Button>);
    await user.tab();
    await user.keyboard(key);
    expect(onPress).toHaveBeenCalledOnce();
  });

  it('applies the variant class', () => {
    render(<Button variant="secondary">Compare</Button>);
    expect(screen.getByRole('button').className).toContain('secondary');
  });

  it('does not fire when disabled', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Button isDisabled onPress={onPress}>
        Unavailable
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
