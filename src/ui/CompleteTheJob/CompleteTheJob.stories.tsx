import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CompleteTheJob } from './CompleteTheJob';

const meta = {
  title: 'Product/Complete the job',
  component: CompleteTheJob,
  args: {
    label: 'Complete the job for 18 m²',
    onAdd: fn(),
    items: [
      {
        id: 'pavetuf',
        name: 'Pavetuf jointing compound, grey',
        reason: 'About 3 tubs for 18 m² with 5 mm joints',
        price: '£119.97',
      },
      {
        id: 'primer',
        name: 'Slurry primer',
        reason: '1 bag covers 20 m²',
        price: '£24.99',
      },
      {
        id: 'cleaner',
        name: 'Porcelain cleaner',
        reason: 'Removes grout haze after laying',
        price: '£14.99',
      },
    ],
  },
} satisfies Meta<typeof CompleteTheJob>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NothingTicked: Story = {};
export const Suggested: Story = { args: { defaultSelected: ['pavetuf', 'primer'] } };
