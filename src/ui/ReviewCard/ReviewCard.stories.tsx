import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReviewCard } from './ReviewCard';

const meta = {
  title: 'Content/Review card',
  component: ReviewCard,
  args: {
    rating: 5,
    title: 'Looks great after a wet winter',
    body: 'Laid in March, still no moss and the grey has not faded. Delivery booked the day I wanted and the driver rang ahead.',
    author: 'Sam from Bolton',
    date: '2026-10-02',
    dateLabel: '2 October 2026',
    verified: true,
  },
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FiveStars: Story = {};
export const Mixed: Story = {
  args: {
    rating: 3,
    title: 'Good slabs, slow delivery',
    body: 'The paving is lovely but the pallet came a day late.',
    verified: false,
  },
};
