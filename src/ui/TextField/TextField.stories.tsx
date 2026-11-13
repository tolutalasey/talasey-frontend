import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'Forms/Text field',
  component: TextField,
  args: { label: 'Postcode', name: 'postcode', autoComplete: 'postal-code' },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const WithDescription: Story = {
  args: {
    label: 'Phone',
    name: 'phone',
    type: 'tel',
    autoComplete: 'tel',
    description: 'The driver calls ahead on the day',
  },
};
export const WithError: Story = {
  args: {
    defaultValue: 'M1',
    isInvalid: true,
    errorMessage: 'Enter a UK postcode, like M1 1AE',
  },
};
export const Disabled: Story = { args: { isDisabled: true, defaultValue: 'M1 1AE' } };
