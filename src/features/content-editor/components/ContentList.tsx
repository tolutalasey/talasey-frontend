import { Button, Table, TextField } from '@/ui';
import NextLink from 'next/link';
import { staffStyles as styles } from '@/features/staff';
import { createContent } from '../actions';
import type { ContentSummary, ContentTypeInfo } from '../types';

const STATUS = {
  draft: 'Draft',
  published: 'Published',
  changed: 'Changes not published',
} as const;

export function ContentList({
  type,
  documents,
}: {
  type: ContentTypeInfo;
  documents: ContentSummary[];
}) {
  const canAdd = !type.singleton || documents.length === 0;
  return (
    <>
      {documents.length > 0 && (
        <Table caption={type.label}>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Status</th>
              <th scope="col">Last saved by</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <th scope="row">
                  <NextLink href={`/content/edit/${document.id}/`}>{document.title}</NextLink>
                </th>
                <td>{STATUS[document.status]}</td>
                <td>{document.updatedBy}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {canAdd && (
        <form action={createContent} className={`${styles.panel} ${styles.row}`}>
          <input type="hidden" name="type" value={type.type} />
          <TextField
            label={type.singleton ? 'Start it with a heading' : 'New entry: its name or title'}
            name="name"
            isRequired
          />
          <Button type="submit">Start a draft</Button>
        </form>
      )}
    </>
  );
}
