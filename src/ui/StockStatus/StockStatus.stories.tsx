import type { Meta, StoryObj } from '@storybook/react-vite';
import { StockStatus } from './StockStatus';

const meta = {
  title: 'Product/Stock status',
  component: StockStatus,
} satisfies Meta<typeof StockStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InStock: Story = { args: { level: 'in-stock', label: '12 in stock' } };
export const LowStock: Story = { args: { level: 'low-stock', label: 'Only 3 left' } };
export const OutOfStock: Story = { args: { level: 'out-of-stock', label: 'Out of stock' } };
export const MadeToOrder: Story = {
  args: { level: 'made-to-order', label: 'Made to order, 3 to 4 weeks' },
};
