import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';

const meta = {
  title: 'Content/Table',
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Specification: Story = {
  args: {
    caption: 'Specification',
    children: (
      <tbody>
        {[
          ['Size', '600 × 600 mm'],
          ['Thickness', '20 mm'],
          ['Slip rating', 'R11'],
          ['Frost resistant', 'Yes'],
          ['Coverage per pack', '1.44 m²'],
        ].map(([name, value]) => (
          <tr key={name}>
            <th scope="row">{name}</th>
            <td>{value}</td>
          </tr>
        ))}
      </tbody>
    ),
  },
};

export const PriceList: Story = {
  args: {
    caption: 'Prices by size',
    children: (
      <>
        <thead>
          <tr>
            <th scope="col">Size</th>
            <th scope="col">Weathered steel</th>
            <th scope="col">Powder coated</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['1800 × 300 mm', '£79.99', '£94.99'],
            ['1800 × 600 mm', '£119.99', '£139.99'],
          ].map(([size, steel, coated]) => (
            <tr key={size}>
              <th scope="row">{size}</th>
              <td>{steel}</td>
              <td>{coated}</td>
            </tr>
          ))}
        </tbody>
      </>
    ),
  },
};
