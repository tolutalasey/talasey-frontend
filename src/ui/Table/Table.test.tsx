import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axeViolations } from '../test/axe';
import { Table } from './Table';

function Spec() {
  return (
    <Table caption="Specification">
      <tbody>
        <tr>
          <th scope="row">Thickness</th>
          <td>20 mm</td>
        </tr>
        <tr>
          <th scope="row">Slip rating</th>
          <td>R11</td>
        </tr>
      </tbody>
    </Table>
  );
}

describe('Table', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Spec />);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('is named by its caption and reads rows by their header', () => {
    render(<Spec />);
    const table = screen.getByRole('table', { name: 'Specification' });
    expect(table).toBeTruthy();
    expect(screen.getByRole('rowheader', { name: 'Slip rating' })).toBeTruthy();
  });
});
