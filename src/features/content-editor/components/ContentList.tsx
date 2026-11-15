import { Button } from '@/ui/Button/Button';
import { TextField } from '@/ui/TextField/TextField';
import NextLink from 'next/link';
import {
  Badge,
  EmptyState,
  RowActions,
  staffStyles as styles,
  type BadgeTone,
} from '@/features/staff';
import { createContent, deleteContent } from '../actions';
import { typeMeta } from '../type-meta';
import type { ContentSummary, ContentTypeInfo } from '../types';

export const CONTENT_STATUS: Record<ContentSummary['status'], { label: string; tone: BadgeTone }> =
  {
    draft: { label: 'Draft', tone: 'neutral' },
    published: { label: 'Published', tone: 'good' },
    changed: { label: 'Unpublished changes', tone: 'warn' },
  };

export type ContentView = 'all' | ContentSummary['status'];

const VIEWS: Record<ContentView, string> = {
  all: 'All',
  published: 'Published',
  changed: 'Changes waiting',
  draft: 'Drafts',
};

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export const savedAt = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  }).format(new Date(iso));

export function NewContentForm({ type }: { type: ContentTypeInfo }) {
  return (
    <form action={createContent} className={styles.inlineCreate}>
      <input type="hidden" name="type" value={type.type} />
      <TextField
        label={type.singleton ? 'Its main heading' : 'Name or title'}
        name="name"
        isRequired
      />
      <Button type="submit">Start a draft</Button>
    </form>
  );
}

interface Props {
  type: ContentTypeInfo;
  documents: ContentSummary[];
  view: ContentView;
}

export function ContentList({ type, documents, view }: Props) {
  const shown = documents.filter((document) => view === 'all' || document.status === view);
  const meta = typeMeta(type.type);

  if (documents.length === 0) {
    return (
      <section className={styles.panel}>
        <EmptyState
          icon={meta.icon}
          title={
            type.singleton ? `${type.label} has no draft yet` : `No ${type.label.toLowerCase()} yet`
          }
          action={<NewContentForm type={type} />}
        >
          Start a draft. Nothing reaches the site until it is published.
        </EmptyState>
      </section>
    );
  }

  return (
    <section className={`${styles.panel} ${styles.flush}`} aria-label={type.label}>
      {!type.singleton && (
        <div className={styles.toolbar}>
          <nav aria-label="Show" className={styles.tabs}>
            {(Object.keys(VIEWS) as ContentView[]).map((key) => (
              <NextLink
                key={key}
                href={`/content/${type.type}/${key === 'all' ? '' : `?show=${key}`}`}
                aria-current={key === view ? 'page' : undefined}
              >
                {VIEWS[key]}
                <span className={styles.tabCount}>
                  {key === 'all'
                    ? documents.length
                    : documents.filter((document) => document.status === key).length}
                </span>
              </NextLink>
            ))}
          </nav>
        </div>
      )}
      {shown.length === 0 ? (
        <EmptyState icon={meta.icon} title="Nothing in this view">
          Choose All to see every entry.
        </EmptyState>
      ) : (
        <ul className={styles.list}>
          {shown.map((document) => {
            const status = CONTENT_STATUS[document.status];
            return (
              <li key={document.id} className={styles.listRow}>
                <span className={styles.docIcon} aria-hidden="true">
                  {meta.icon}
                </span>
                <span className={styles.listMain}>
                  <NextLink href={`/content/edit/${document.id}/`} className={styles.listTitle}>
                    {document.title}
                  </NextLink>
                  <span className={styles.listSub}>
                    <span className={styles.who}>
                      <span className={styles.initials} aria-hidden="true">
                        {initials(document.updatedBy)}
                      </span>
                      Saved by {document.updatedBy}, {savedAt(document.updatedAt)}
                    </span>
                  </span>
                </span>
                <span className={styles.listEnd}>
                  <Badge tone={status.tone}>{status.label}</Badge>
                  <RowActions
                    name={document.title}
                    editHref={`/content/edit/${document.id}/`}
                    remove={deleteContent}
                    fields={{ id: document.id, type: type.type }}
                    afterDelete={
                      document.status === 'draft'
                        ? 'The draft goes. You can bring it back from the change log.'
                        : 'It comes off the site. You can bring it back from the change log.'
                    }
                  />
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
