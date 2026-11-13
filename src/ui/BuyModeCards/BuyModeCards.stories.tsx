import type { Meta, StoryObj } from '@storybook/react-vite';
import { BuyModeCards } from './BuyModeCards';

const meta = {
  title: 'Product/Buy-mode cards',
  component: BuyModeCards,
  args: {
    label: 'How would you like it?',
    modes: [
      {
        id: 'buy',
        title: 'Buy now',
        description: 'Delivered on a pallet on a day you choose',
        price: '£89.99',
      },
      {
        id: 'sample',
        title: 'Order a sample',
        description: 'A cut piece, posted free in 2 working days',
        price: 'Free',
      },
      {
        id: 'quote',
        title: 'Get it laid',
        description: 'Quotes from up to 3 approved installers near you',
      },
    ],
  },
} satisfies Meta<typeof BuyModeCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BuyChosen: Story = { args: { defaultValue: 'buy' } };
export const SampleChosen: Story = { args: { defaultValue: 'sample' } };
export const NothingChosen: Story = {
  args: { isRequired: true, isInvalid: true, errorMessage: 'Choose how you would like it' },
};
