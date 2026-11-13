import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gallery } from './Gallery';

const picture = (fill: string, label: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="${fill}"/><text x="40" y="560" font-family="sans-serif" font-size="40" fill="#fff">${label}</text></svg>`,
  )}`;

const meta = {
  title: 'Product/Gallery',
  component: Gallery,
  args: {
    label: 'Dusk grey porcelain paving',
    images: [
      ['dry', '#8d8a86', 'Dry, laid on a patio'],
      ['wet', '#5f5c59', 'Wet after rain'],
      ['close', '#9a958f', 'Close up of the surface'],
      ['scale', '#7d7a76', 'With a garden chair for scale'],
    ].map(([id, fill, alt]) => ({
      id: id as string,
      src: picture(fill as string, alt as string),
      alt: `Dusk grey porcelain paving, ${(alt as string).toLowerCase()}`,
      width: 800,
      height: 600,
    })),
  },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FourShots: Story = {};
export const OneShot: Story = {
  args: { images: meta.args.images.slice(0, 1) },
};
