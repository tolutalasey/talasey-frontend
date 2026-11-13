import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { children: 'Add to basket', onPress: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', children: 'Order a sample' } };
export const Pending: Story = { args: { isPending: true, children: 'Adding…' } };
export const Disabled: Story = { args: { isDisabled: true, children: 'Out of stock' } };
