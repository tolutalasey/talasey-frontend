import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Breadcrumbs';

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductPage: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Porcelain paving', href: '/porcelain-paving/' },
      { label: 'Dusk grey porcelain paving' },
    ],
  },
};

export const LongTrailOnAPhone: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Landscaping materials', href: '/landscaping/' },
      { label: 'Paving installation', href: '/paving-installation/' },
      { label: 'Pavetuf jointing compound, all-weather, grey' },
    ],
  },
  globals: { viewport: { value: 'mobile1' } },
};
