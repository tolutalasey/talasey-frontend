import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button';
import { axeViolations } from '../test/axe';
import { DialogTrigger, Drawer, Modal } from './Modal';

function Example({ Surface = Modal }: { Surface?: typeof Modal }) {
  return (
    <DialogTrigger>
      <Button>Size guide</Button>
      <Surface title="Size guide">
        {(close) => (
          <>
            <p>Measure the longest side first.</p>
            <Button onPress={close}>Done</Button>
          </>
        )}
      </Surface>
    </DialogTrigger>
  );
}

describe.each([
  ['Modal', Modal],
  ['Drawer', Drawer],
])('%s', (_, Surface) => {
  it('opens as a named dialog with focus inside and no axe violations', async () => {
    const user = userEvent.setup();
    render(<Example Surface={Surface} />);
    await user.click(screen.getByRole('button', { name: 'Size guide' }));
    const dialog = screen.getByRole('dialog', { name: 'Size guide' });
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(await axeViolations(document.body)).toEqual([]);
  });

  it('keeps Tab inside and closes on Escape, returning focus', async () => {
    const user = userEvent.setup();
    render(<Example Surface={Surface} />);
    const opener = screen.getByRole('button', { name: 'Size guide' });
    await user.tab();
    await user.keyboard('{Enter}');
    const dialog = screen.getByRole('dialog');
    for (let step = 0; step < 4; step++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(opener));
  });

  it('closes from its own button', async () => {
    const user = userEvent.setup();
    render(<Example Surface={Surface} />);
    await user.click(screen.getByRole('button', { name: 'Size guide' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
