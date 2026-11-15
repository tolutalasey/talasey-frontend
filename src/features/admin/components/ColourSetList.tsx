import { RowActions } from '@/features/staff';
import { Table } from '@/ui/Table/Table';
import { VisuallyHidden } from '@/ui/VisuallyHidden/VisuallyHidden';
import NextLink from 'next/link';
import { deleteColourSet } from '../actions';
import type { ColourSet } from '../types';

export function ColourSetList({ sets }: { sets: ColourSet[] }) {
  return (
    <Table caption={`${sets.length} colour sets`}>
      <thead>
        <tr>
          <th scope="col">Set</th>
          <th scope="col">Colours</th>
          <th scope="col">Used by</th>
          <th scope="col">
            <VisuallyHidden>Actions</VisuallyHidden>
          </th>
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
            <td>
              <RowActions
                name={set.name}
                editHref={`/admin/colour-sets/${set.id}/`}
                remove={deleteColourSet}
                fields={{ id: set.id }}
                afterDelete={
                  set.usedBy > 0
                    ? `${set.usedBy} products use it. They lose their colour choice.`
                    : 'No products use it.'
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
