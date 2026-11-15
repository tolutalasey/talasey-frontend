import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { Gallery } from './Gallery';

const images = ['Dry', 'Wet', 'Close up'].map((name, index) => ({
  id: `img-${index}`,
  src: `/${name}.jpg`,
  alt: `Dusk grey paving, ${name.toLowerCase()}`,
  width: 800,
  height: 600,
}));

describe('Gallery', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Gallery label="Dusk grey porcelain paving" images={images} />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('moves through thumbnails with the arrow keys and shows the chosen image', async () => {
    const user = userEvent.setup();
    render(<Gallery label="Dusk grey porcelain paving" images={images} />);
    await user.tab();
    await user.tab();
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Show image 1: Dusk grey paving, dry',
    );
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement?.getAttribute('aria-label')).toBe(
      'Show image 2: Dusk grey paving, wet',
    );
    await user.keyboard('{Enter}');
    expect(screen.getByRole('img', { name: 'Dusk grey paving, wet' })).toBeTruthy();
    expect(screen.getByText('Image 2 of 3')).toBeTruthy();
  });

  it('shows no thumbnails for a single image', () => {
    render(<Gallery label="Sample" images={images.slice(0, 1)} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('opens the photo full screen from the zoom button', async () => {
    const user = userEvent.setup();
    render(<Gallery label="Dusk grey porcelain paving" images={images} />);
    await user.click(screen.getByRole('button', { name: 'View Dusk grey paving, dry larger' }));
    expect(screen.getByRole('dialog', { name: 'Dusk grey porcelain paving, larger' })).toBeTruthy();
  });
});
