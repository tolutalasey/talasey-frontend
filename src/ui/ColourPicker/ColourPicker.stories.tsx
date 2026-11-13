import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColourPicker } from './ColourPicker';

const meta = {
  title: 'Product/Colour picker',
  component: ColourPicker,
  args: {
    label: 'Powder coat colour',
    description: 'The colour never changes the price.',
    colours: [
      { id: 'anthracite', name: 'Anthracite grey', hex: '#383E42' },
      { id: 'jet-black', name: 'Jet black', hex: '#0A0A0A' },
      { id: 'signal-white', name: 'Signal white', hex: '#F4F4F4' },
      { id: 'moss-green', name: 'Moss green', hex: '#2F4538' },
      { id: 'cream', name: 'Cream', hex: '#E9E0C9' },
    ],
  },
} satisfies Meta<typeof ColourPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NothingChosen: Story = {};
export const Chosen: Story = { args: { defaultValue: 'moss-green' } };
export const Required: Story = {
  args: { isRequired: true, isInvalid: true, errorMessage: 'Choose a colour' },
};
