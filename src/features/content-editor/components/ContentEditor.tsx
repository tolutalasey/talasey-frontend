import { Button } from '@/ui/Button/Button';
import { SelectField } from '@/ui/SelectField/SelectField';
import NextLink from 'next/link';
import {
  Badge,
  EyeIcon,
  HistoryIcon,
  RocketIcon,
  SaveBar,
  staffStyles as styles,
  TrashIcon,
} from '@/features/staff';
import { londonLabel } from '@/lib/london-time';
import { saveContent } from '../actions';
import type { ContentDocument, ContentRelease, ContentTypeInfo } from '../types';
import { ContentFields } from './ContentFields';
import { CONTENT_STATUS, savedAt } from './ContentList';

const STATUS_TEXT = {
  draft: 'Not on the site yet.',
  published: 'Live on the site, matching this draft.',
  changed: 'The site shows the last published version, not these changes.',
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
  const status = CONTENT_STATUS[document.status];

  return (
    <form action={saveContent} encType="multipart/form-data" className={styles.editor}>
      <input type="hidden" name="id" value={document.id} />
      <input type="hidden" name="type" value={type.type} />

      <div className={styles.editorMain}>
        {document.problems.length > 0 && (
          <div className={styles.problem}>
            <div>
              <strong>Before this can be published</strong>
              <ul>
                {document.problems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <section className={styles.panel} aria-label="Content">
          <ContentFields fields={type.fields} data={document.draft} />
        </section>

        <SaveBar saved={`Saved by ${document.updatedBy}, ${savedAt(document.updatedAt)}`}>
          <NextLink
            href={`/content/preview/${document.id}/`}
            className={styles.secondaryLink}
            target="_blank"
          >
            <EyeIcon />
            Preview
          </NextLink>
          <Button
            type="submit"
            name="intent"
            value="save"
            variant={type.canPublish ? 'secondary' : 'primary'}
          >
            Save draft
          </Button>
          {type.canPublish && (
            <Button type="submit" name="intent" value="publish">
              Save and publish
            </Button>
          )}
        </SaveBar>
      </div>

      <aside className={styles.aside} aria-label="Publishing">
        <section className={styles.panel}>
          <h2 className={styles.asideTitle}>Status</h2>
          <div className={styles.stack}>
            <div>
              <Badge tone={status.tone}>{status.label}</Badge>
              <p className={`${styles.muted} ${styles.small}`}>{STATUS_TEXT[document.status]}</p>
            </div>
            <dl className={styles.facts}>
              <div>
                <dt>Last saved</dt>
                <dd>{savedAt(document.updatedAt)}</dd>
              </div>
              <div>
                <dt>By</dt>
                <dd>{document.updatedBy}</dd>
              </div>
              {document.publishedAt && (
                <div>
                  <dt>Published</dt>
                  <dd>{savedAt(document.publishedAt)}</dd>
                </div>
              )}
              {document.publishedBy && (
                <div>
                  <dt>By</dt>
                  <dd>{document.publishedBy}</dd>
                </div>
              )}
            </dl>
            {!type.canPublish && (
              <p className={`${styles.muted} ${styles.small}`}>
                {type.locked
                  ? 'Only the owner publishes this wording.'
                  : 'An editor publishes your draft.'}
              </p>
            )}
          </div>
        </section>

        {type.canPublish && (waitingIn || releases.length > 0) && (
          <section className={styles.panel}>
            <h2 className={styles.asideTitle}>Release</h2>
            {waitingIn ? (
              <p className={styles.small}>
                <RocketIcon className={styles.inlineIcon} />
                Waiting in{' '}
                <NextLink href="/content/releases/" className={styles.textLink}>
                  {waitingIn.name}
                </NextLink>
                {waitingIn.publishAt
                  ? `, going live ${londonLabel(waitingIn.publishAt)}.`
                  : ', not scheduled yet.'}{' '}
                <span className={styles.muted}>
                  It publishes whatever the draft says at that moment.
                </span>
              </p>
            ) : (
              <div className={styles.stack}>
                <SelectField
                  label="Add to a release"
                  name="releaseId"
                  options={releases.map((release) => ({ value: release.id, label: release.name }))}
                />
                <Button type="submit" name="intent" value="release" variant="secondary">
                  Save and add
                </Button>
              </div>
            )}
          </section>
        )}

        <section className={styles.panel}>
          <h2 className={styles.asideTitle}>More</h2>
          <ul className={styles.linkList}>
            <li>
              <NextLink href={`/content/preview/${document.id}/`} target="_blank">
                <EyeIcon />
                Preview the draft
              </NextLink>
            </li>
            <li>
              <NextLink href={`/admin/log/?subject=content&subjectId=${document.id}`}>
                <HistoryIcon />
                History of changes
              </NextLink>
            </li>
          </ul>
        </section>

        {type.canPublish && (
          <section className={`${styles.panel} ${styles.danger}`}>
            <h2 className={styles.asideTitle}>Remove</h2>
            <div className={styles.stack}>
              {document.published && (
                <Button type="submit" name="intent" value="unpublish" variant="secondary">
                  Take off the site
                </Button>
              )}
              <button type="submit" name="intent" value="delete" className={styles.dangerButton}>
                <TrashIcon />
                Delete
              </button>
            </div>
          </section>
        )}
      </aside>
    </form>
  );
}
