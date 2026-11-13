import type { Meta, StoryObj } from '@storybook/react-vite';
import { MegaMenu } from './MegaMenu';

const meta = {
  title: 'Navigation/Mega menu',
  component: MegaMenu,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 16, minHeight: 420 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    sections: [
      {
        id: 'paving',
        label: 'Paving',
        href: '#porcelain-paving',
        columns: [
          {
            heading: 'Porcelain',
            links: [
              { label: 'Grey porcelain', href: '#grey' },
              { label: 'Wood effect porcelain', href: '#wood' },
              { label: '20 mm porcelain', href: '#20mm' },
            ],
          },
          {
            heading: 'Natural stone',
            links: [
              { label: 'Indian sandstone', href: '#sandstone' },
              { label: 'Limestone', href: '#limestone' },
            ],
          },
          {
            heading: 'Laying it',
            links: [
              { label: 'Paving jointing', href: '#jointing' },
              { label: 'How to lay porcelain', href: '#guide' },
            ],
          },
        ],
      },
      {
        id: 'decking',
        label: 'Decking',
        href: '#composite-decking',
        columns: [
          { heading: 'Brands', links: [{ label: 'Piranha', href: '#piranha' }] },
          { heading: 'Plan it', links: [{ label: 'Deck calculator', href: '#calculator' }] },
        ],
      },
      {
        id: 'outdoor',
        label: 'Outdoor living',
        href: '#outdoor-living',
        columns: [
          {
            heading: 'Shop',
            links: [
              { label: 'Pergolas', href: '#pergolas' },
              { label: 'Fire pits', href: '#fire-pits' },
              { label: 'Planters', href: '#planters' },
            ],
          },
        ],
      },
    ],
  },
} satisfies Meta<typeof MegaMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const PavingOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Paving menu' }));
  },
};
