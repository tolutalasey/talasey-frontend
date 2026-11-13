import { Button, Table } from '@/ui';
import { restoreChange } from '../actions';
import { dateText } from '../labels';
import type { AuditEntry } from '../types';

const ACTIONS = {
  create: 'Added',
  update: 'Changed',
  delete: 'Deleted',
  restore: 'Put back',
} as const;

export function ChangeLog({ entries, back }: { entries: AuditEntry[]; back: string }) {
  return (
    <Table caption={`${entries.length} most recent changes`}>
      <thead>
        <tr>
          <th scope="col">What</th>
          <th scope="col">Change</th>
          <th scope="col">Who</th>
          <th scope="col">When</th>
          <th scope="col">Undo</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id}>
            <th scope="row">{entry.label}</th>
            <td>{ACTIONS[entry.action]}</td>
            <td>{entry.actorName}</td>
            <td>{dateText(entry.createdAt)}</td>
            <td>
              <form action={restoreChange}>
                <input type="hidden" name="id" value={entry.id} />
                <input type="hidden" name="back" value={back} />
                <Button
                  type="submit"
                  variant="secondary"
                  aria-label={`Put ${entry.label} back as it was before this change`}
                >
                  Put back as before
                </Button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
