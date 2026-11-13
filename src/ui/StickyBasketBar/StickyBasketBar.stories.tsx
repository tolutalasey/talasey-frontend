import type { Meta, StoryObj } from '@storybook/react-vite';
import { StickyBasketBar } from './StickyBasketBar';

const meta = {
  title: 'Basket/Sticky basket bar',
  component: StickyBasketBar,
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'mobile1' } },
  args: { summary: '3 items', total: '£269.97', actionLabel: 'View basket', href: '#basket' },
} satisfies Meta<typeof StickyBasketBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnAPhone: Story = {};
export const ReadyToCheckout: Story = {
  args: { summary: '1 pallet', total: '£1,664.60', actionLabel: 'Checkout' },
};
