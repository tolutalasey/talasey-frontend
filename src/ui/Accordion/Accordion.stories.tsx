import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta = {
  title: 'Content/Accordion',
  component: Accordion,
  args: {
    items: [
      {
        id: 'delivery',
        title: 'Delivery',
        content: <p>Pallet delivery from £45 to most of the north west. Pick a day at checkout.</p>,
      },
      {
        id: 'care',
        title: 'Care',
        content: <p>Wash with warm soapy water. No sealer needed.</p>,
      },
      {
        id: 'returns',
        title: 'Returns',
        content: <p>Return unopened packs within 30 days.</p>,
      },
    ],
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const OneOpen: Story = { args: { defaultExpandedKeys: ['delivery'] } };
export const SeveralOpen: Story = {
  args: { allowsMultipleExpanded: true, defaultExpandedKeys: ['delivery', 'care'] },
};
