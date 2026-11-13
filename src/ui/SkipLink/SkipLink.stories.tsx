import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkipLink } from './SkipLink';

const meta = {
  title: 'Navigation/Skip link',
  component: SkipLink,
  parameters: {
    docs: {
      description: { component: 'Hidden until focused. Press Tab in the canvas to see it.' },
    },
  },
  render: (args) => (
    <>
      <SkipLink {...args} />
      <main id="main" tabIndex={-1}>
        <p>Page content</p>
      </main>
    </>
  ),
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focused: Story = {
  play: async ({ userEvent }) => {
    await userEvent.tab();
  },
};
