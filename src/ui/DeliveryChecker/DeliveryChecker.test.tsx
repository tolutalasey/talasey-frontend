import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axeViolations } from '../test/axe';
import { DeliveryChecker } from './DeliveryChecker';

describe('DeliveryChecker', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <DeliveryChecker
        onCheck={vi.fn()}
        result={{ available: true, message: 'Pallet delivery from Tuesday 17 November, £45' }}
      />,
    );
    expect(await axeViolations(container)).toEqual([]);
  });

  it('checks the typed postcode when Enter is pressed', async () => {
    const user = userEvent.setup();
    const onCheck = vi.fn();
    render(<DeliveryChecker onCheck={onCheck} />);
    await user.tab();
    await user.keyboard(' M1 1AE {Enter}');
    expect(onCheck).toHaveBeenCalledWith('M1 1AE');
  });

  it('announces the answer through a status region', () => {
    render(
      <DeliveryChecker
        onCheck={vi.fn()}
        result={{ available: false, message: 'We do not deliver to BT postcodes yet' }}
      />,
    );
    expect(screen.getByRole('status').textContent).toBe('We do not deliver to BT postcodes yet');
  });
});
