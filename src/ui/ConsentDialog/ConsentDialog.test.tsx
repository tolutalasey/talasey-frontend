import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { ConsentDialog, type ConsentDialogProps } from './ConsentDialog';

const categories = [
  { id: 'analytics', label: 'Analytics', description: 'Counts visits so we can improve pages.' },
  { id: 'marketing', label: 'Marketing', description: 'Measures and personalises our ads.' },
];

function setup(props: Partial<ConsentDialogProps> = {}) {
  const handlers = { onAcceptAll: vi.fn(), onRejectAll: vi.fn(), onSave: vi.fn() };
  render(
    <ConsentDialog
      isOpen
      categories={categories}
      intro={<p>We use cookies to measure visits and ads.</p>}
      {...handlers}
      {...props}
    />,
  );
  return handlers;
}

describe('ConsentDialog', () => {
  it('has no axe violations', async () => {
    setup();
    expect(await axeViolations(document.body)).toEqual([]);
  });

  it('gives Accept all and Reject all the same weight', () => {
    setup();
    const accept = screen.getByRole('button', { name: 'Accept all' });
    const reject = screen.getByRole('button', { name: 'Reject all' });
    expect(accept.className).toBe(reject.className);
  });

  it('cannot be dismissed with Escape', async () => {
    const user = userEvent.setup();
    setup();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog', { name: 'Cookies on Talasey' })).toBeTruthy();
  });

  it('rejects all from the keyboard', async () => {
    const user = userEvent.setup();
    const { onRejectAll } = setup();
    screen.getByRole('button', { name: 'Reject all' }).focus();
    await user.keyboard('{Enter}');
    expect(onRejectAll).toHaveBeenCalledOnce();
  });

  it('saves the categories chosen in preferences', async () => {
    const user = userEvent.setup();
    const { onSave } = setup();
    await user.click(screen.getByRole('button', { name: 'Preferences' }));
    expect(screen.getByRole('dialog', { name: 'Cookie preferences' })).toBeTruthy();
    await user.click(screen.getByRole('checkbox', { name: /Analytics/ }));
    await user.click(screen.getByRole('button', { name: 'Save my choices' }));
    expect(onSave).toHaveBeenCalledWith({ analytics: true, marketing: false });
  });
});
