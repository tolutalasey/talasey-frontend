import { Button } from '@/ui/Button/Button';
import { SelectField } from '@/ui/SelectField/SelectField';
import NextLink from 'next/link';
import { staffStyles as styles } from '@/features/staff';
import { saveContent } from '../actions';
import { londonLabel } from '@/lib/london-time';
import type { ContentDocument, ContentRelease, ContentTypeInfo } from '../types';
import { ContentFields } from './ContentFields';

const STATUS = {
  draft: 'Draft: not on the site',
  published: 'Published',
  changed: 'Published, with unpublished changes',
} as const;

export function ContentEditor({
  document,
  type,
  releases,
}: {
  document: ContentDocument;
  type: ContentTypeInfo;
  releases: ContentRelease[];
}) {
  const waitingIn = releases.find((release) =>
    release.items.some((item) => item.documentId === document.id),
  );
  return (
    <form action={saveContent} encType="multipart/form-data" className={styles.stack}>
      <input type="hidden" name="id" value={document.id} />
      <input type="hidden" name="type" value={type.type} />
      <p>
        <span className={styles.status}>{STATUS[document.status]}</span>{' '}
        <span className={styles.muted}>
          Last saved by {document.updatedBy}
          {document.publishedBy && `, published by ${document.publishedBy}`}
        </span>
      </p>
      {document.problems.length > 0 && (
        <div className={styles.problem}>
          <strong>Before this can be published:</strong>
          <ul>
            {document.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}
      {waitingIn && (
        <p role="status" className={styles.notice}>
          Waiting in the release <NextLink href="/content/releases/">{waitingIn.name}</NextLink>
          {waitingIn.publishAt
            ? `, going live ${londonLabel(waitingIn.publishAt)}.`
            : ', not scheduled yet.'}{' '}
          It publishes whatever the draft says at that moment.
        </p>
      )}
      <ContentFields fields={type.fields} data={document.draft} />
      <div className={styles.actions}>
        <Button type="submit" name="intent" value="save">
          Save draft
        </Button>
        {type.canPublish ? (
          <>
            <Button type="submit" name="intent" value="publish">
              Save and publish
            </Button>
            {!waitingIn && releases.length > 0 && (
              <>
                <SelectField
                  label="Release"
                  name="releaseId"
                  options={releases.map((release) => ({ value: release.id, label: release.name }))}
                />
                <Button type="submit" name="intent" value="release" variant="secondary">
                  Save and add to release
                </Button>
              </>
            )}
            {document.published && (
              <Button type="submit" name="intent" value="unpublish" variant="secondary">
                Take off the site
              </Button>
            )}
            <Button type="submit" name="intent" value="delete" variant="secondary">
              Delete
            </Button>
          </>
        ) : (
          <span className={styles.muted}>
            {type.locked
              ? 'Only the owner publishes this wording.'
              : 'An editor publishes your draft.'}
          </span>
        )}
        <NextLink href={`/content/preview/${document.id}/`}>Preview the draft</NextLink>
        <NextLink href={`/admin/log/?subject=content&subjectId=${document.id}`}>History</NextLink>
      </div>
    </form>
  );
}
