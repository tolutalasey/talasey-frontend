import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SearchField } from './SearchField';

const meta = {
  title: 'Navigation/Search with suggestions',
  component: SearchField,
  args: {
    suggestions: [
      { id: 'porcelain', label: 'Porcelain paving', hint: '86 products' },
      { id: 'grey-porcelain', label: 'Grey porcelain paving', hint: '31 products' },
      { id: 'how-to-lay', label: 'How to lay porcelain', hint: 'Guide' },
    ],
    onInputChange: fn(),
    onSelect: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { suggestions: [] } };
export const WithSuggestions: Story = { args: { defaultQuery: 'porc' } };
