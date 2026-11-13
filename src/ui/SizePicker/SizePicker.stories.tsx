import type { Meta, StoryObj } from '@storybook/react-vite';
import { SizePicker } from './SizePicker';

const meta = {
  title: 'Product/Size picker',
  component: SizePicker,
  args: {
    label: 'Size',
    options: [
      { id: '300', label: '1800 × 300 mm' },
      { id: '600', label: '1800 × 600 mm' },
      { id: '900', label: '1800 × 900 mm', note: 'Out of stock', isUnavailable: true },
    ],
  },
} satisfies Meta<typeof SizePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = { args: { defaultValue: '600' } };
export const Finishes: Story = {
  args: {
    label: 'Finish',
    options: [
      { id: 'C', label: 'Weathered steel' },
      { id: 'MS', label: 'Galvanised' },
      { id: 'PC', label: 'Powder coated', note: 'Made to order' },
    ],
  },
};
export const WithError: Story = {
  args: { isRequired: true, isInvalid: true, errorMessage: 'Choose a size' },
};
