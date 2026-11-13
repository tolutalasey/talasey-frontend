import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductCard } from './ProductCard';

const swatch = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="${fill}"/></svg>`,
  )}`;

const meta = {
  title: 'Product/Product card',
  component: ProductCard,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    href: '#dusk-grey',
    name: 'Dusk grey porcelain paving',
    image: { src: swatch('#8d8a86'), alt: 'Dusk grey slabs', width: 800, height: 600 },
    price: '£89.99',
    priceNote: 'per pack of 4',
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InStock: Story = { args: { stock: { level: 'in-stock', label: '12 in stock' } } };

export const MadeToOrder: Story = {
  args: {
    name: 'Abstract Branches decorative screen',
    image: { src: swatch('#7a4a2b'), alt: 'Corten screen', width: 800, height: 600 },
    price: '£119.99',
    priceNote: undefined,
    badge: 'Made in Britain',
    stock: { level: 'made-to-order', label: 'Made to order, 3 to 4 weeks' },
  },
};

export const NoPriceYet: Story = { args: { price: null } };
