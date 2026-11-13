import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DeliveryChecker } from './DeliveryChecker';

const meta = {
  title: 'Product/Delivery checker',
  component: DeliveryChecker,
  args: { onCheck: fn() },
} satisfies Meta<typeof DeliveryChecker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Checking: Story = { args: { defaultPostcode: 'M1 1AE', isPending: true } };
export const Delivers: Story = {
  args: {
    defaultPostcode: 'M1 1AE',
    result: { available: true, message: 'Pallet delivery from Tuesday 17 November, £45' },
  },
};
export const DoesNotDeliver: Story = {
  args: {
    defaultPostcode: 'BT1 1AA',
    result: { available: false, message: 'We do not deliver to Northern Ireland yet. Call us.' },
  },
};
