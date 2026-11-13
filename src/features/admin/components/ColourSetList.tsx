import { Table } from '@/ui';
import NextLink from 'next/link';
import type { ColourSet } from '../types';

export function ColourSetList({ sets }: { sets: ColourSet[] }) {
  return (
    <Table caption={`${sets.length} colour sets`}>
      <thead>
        <tr>
          <th scope="col">Set</th>
          <th scope="col">Colours</th>
          <th scope="col">Used by</th>
        </tr>
      </thead>
      <tbody>
        {sets.map((set) => (
          <tr key={set.id}>
            <th scope="row">
              <NextLink href={`/admin/colour-sets/${set.id}/`}>{set.name}</NextLink>
            </th>
            <td>{set.colours.map((colour) => colour.name).join(', ')}</td>
            <td>{set.usedBy} products</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
