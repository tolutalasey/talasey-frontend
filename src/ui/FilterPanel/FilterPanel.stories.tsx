import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FilterPanel, type FilterValues } from './FilterPanel';

const groups = [
  {
    id: 'colour',
    label: 'Colour',
    options: [
      { value: 'grey', label: 'Grey', count: 14 },
      { value: 'white', label: 'White', count: 6 },
      { value: 'black', label: 'Black', count: 3 },
      { value: 'wood', label: 'Wood effect', count: 5 },
    ],
  },
  {
    id: 'size',
    label: 'Slab size',
    options: [
      { value: '600x600', label: '600 × 600 mm', count: 18 },
      { value: '900x600', label: '900 × 600 mm', count: 9 },
      { value: '1200x600', label: '1200 × 600 mm', count: 4 },
    ],
  },
];

function Demo({ initial }: { initial: FilterValues }) {
  const [value, setValue] = useState(initial);
  const count = Object.values(value).flat().length === 0 ? 28 : 11;
  return (
    <FilterPanel
      groups={groups}
      value={value}
      resultCount={count}
      onChange={setValue}
      onClear={() => setValue({})}
    />
  );
}

const meta = {
  title: 'Navigation/Filter panel',
  component: Demo,
  args: { initial: {} },
} satisfies Meta<typeof Demo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NothingChosen: Story = {};
export const FiltersApplied: Story = { args: { initial: { colour: ['grey'], size: ['600x600'] } } };
