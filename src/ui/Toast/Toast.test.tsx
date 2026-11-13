import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { createToastQueue, ToastRegion } from './Toast';

describe('Toast', () => {
  it('announces the message in a named region with no axe violations', async () => {
    const queue = createToastQueue();
    render(<ToastRegion queue={queue} />);
    act(() => {
      queue.add({ title: 'Added to basket', description: '2 packs of Dusk grey paving' });
    });
    expect(screen.getByRole('region', { name: '1 notification.' })).toBeTruthy();
    expect(screen.getByRole('alertdialog', { name: /Added to basket/ })).toBeTruthy();
    expect(await axeViolations(document.body)).toEqual([]);
  });

  it('stays until closed, and closes from the keyboard', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup();
    const queue = createToastQueue();
    render(<ToastRegion queue={queue} />);
    act(() => {
      queue.add({ title: 'Delivery day held' });
    });
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByText('Delivery day held')).toBeTruthy();
    vi.useRealTimers();

    screen.getByRole('button', { name: 'Close' }).focus();
    await user.keyboard('{Enter}');
    expect(screen.queryByText('Delivery day held')).toBeNull();
  });

  it('runs its action, such as undo, and closes', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const queue = createToastQueue();
    render(<ToastRegion queue={queue} />);
    act(() => {
      queue.add({ title: 'Removed from basket', action: { label: 'Undo', onAction } });
    });
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.queryByText('Removed from basket')).toBeNull();
  });
});
