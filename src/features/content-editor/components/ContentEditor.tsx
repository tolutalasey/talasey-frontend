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
import { LivePreview } from './LivePreview';
import { PickPanel } from './PickPanel';
import { PickProvider } from './PickContext';

const STATUS_TEXT = {
  draft: 'Not on the site yet.',
  published: 'Live on the site, matching this draft.',
  changed: 'The site shows the last published version, not these changes.',
} as const;

interface Props {
  document: ContentDocument;
  type: ContentTypeInfo;
  releases: ContentRelease[];
  // Set when this content has a page of its own, so it can be previewed beside the form.
  preview?: { livePath: string | null };
}

function Publishing({ document, type, releases }: Omit<Props, 'preview'>) {
  const waitingIn = releases.find((release) =>
    release.items.some((item) => item.documentId === document.id),
  );
  const status = CONTENT_STATUS[document.status];
  return (
    <>
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
            <NextLink href={`/preview/${document.id}/`} target="_blank">
              <EyeIcon />
              Preview in a new tab
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
    </>
  );
}

function Main({ document, type }: Pick<Props, 'document' | 'type'>) {
  return (
    <>
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
        <PickPanel>
          <ContentFields fields={type.fields} data={document.draft} />
        </PickPanel>
      </section>

      <SaveBar saved={`Saved by ${document.updatedBy}, ${savedAt(document.updatedAt)}`}>
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
    </>
  );
}

export function ContentEditor({ document, type, releases, preview }: Props) {
  const hidden = (
    <>
      <input type="hidden" name="id" value={document.id} />
      <input type="hidden" name="type" value={type.type} />
    </>
  );

  if (preview) {
    return (
      <form
        action={saveContent}
        encType="multipart/form-data"
        className={styles.workspace}
        data-wide=""
      >
        <PickProvider>
          {hidden}
          <div className={styles.workspaceForm}>
            <details className={styles.publishing}>
              <summary>
                <span>Status, release and history</span>
                <Badge tone={CONTENT_STATUS[document.status].tone}>
                  {CONTENT_STATUS[document.status].label}
                </Badge>
              </summary>
              <div className={styles.publishingPanels}>
                <Publishing document={document} type={type} releases={releases} />
              </div>
            </details>
            <Main document={document} type={type} />
          </div>
          <div className={styles.workspacePreview}>
            <LivePreview documentId={document.id} livePath={preview.livePath} />
          </div>
        </PickProvider>
      </form>
    );
  }

  return (
    <form action={saveContent} encType="multipart/form-data" className={styles.editor}>
      {hidden}
      <div className={styles.editorMain}>
        <Main document={document} type={type} />
      </div>
      <aside className={styles.aside} aria-label="Publishing">
        <Publishing document={document} type={type} releases={releases} />
      </aside>
    </form>
  );
}
