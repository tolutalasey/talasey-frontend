import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { MegaMenu } from '../MegaMenu/MegaMenu';
import { SearchField } from '../SearchField/SearchField';
import { SiteHeader } from './SiteHeader';

const meta = {
  title: 'Navigation/Header',
  component: SiteHeader,
  parameters: { layout: 'fullscreen' },
  args: {
    logo: 'Talasey',
    basketHref: '#basket',
    basketCount: 2,
    topBar: (
      <p style={{ margin: 0 }}>
        Free samples, posted in 2 days. <a href="#samples">Order samples</a>
      </p>
    ),
    search: <SearchField suggestions={[]} onInputChange={fn()} onSelect={fn()} onSubmit={fn()} />,
    navigation: (
      <MegaMenu
        sections={[
          {
            id: 'paving',
            label: 'Paving',
            href: '#paving',
            columns: [{ heading: 'Porcelain', links: [{ label: 'Grey porcelain', href: '#g' }] }],
          },
          {
            id: 'decking',
            label: 'Decking',
            href: '#decking',
            columns: [{ heading: 'Brands', links: [{ label: 'Piranha', href: '#p' }] }],
          },
        ]}
      />
    ),
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};
export const EmptyBasket: Story = { args: { basketCount: 0 } };
export const OnAPhone: Story = { globals: { viewport: { value: 'mobile1' } } };
