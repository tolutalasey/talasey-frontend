import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta = {
  title: 'Actions/Link',
  component: Link,
  args: { href: '#guide', children: 'How to lay porcelain paving' },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InText: Story = {
  render: (args) => (
    <p>
      Read <Link {...args} /> before you start.
    </p>
  ),
};
export const OnItsOwn: Story = {};
