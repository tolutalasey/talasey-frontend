import type { Meta, StoryObj } from '@storybook/react-vite';
import { QandA } from './QandA';

const meta = {
  title: 'Content/Q&A',
  component: QandA,
} satisfies Meta<typeof QandA>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductQuestions: Story = {
  args: {
    items: [
      {
        question: 'Can I lay it on sand?',
        answer:
          'No. Lay porcelain on a full mortar bed with a priming slurry on the back of each slab.',
        answeredBy: 'Talasey technical team',
      },
      {
        question: 'Is it frost proof?',
        answer: 'Yes. It absorbs less than 0.5% water, so frost cannot split it.',
      },
    ],
  },
};
