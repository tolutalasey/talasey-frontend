import { Button } from '@/ui/Button/Button';
import { TextField } from '@/ui/TextField/TextField';
import NextLink from 'next/link';
import {
  Badge,
  DocumentIcon,
  EmptyState,
  RocketIcon,
  staffStyles as styles,
  type BadgeTone,
} from '@/features/staff';
import { changeRelease, createRelease, removeFromRelease } from '../actions';
import { londonLabel, toLondonTime } from '@/lib/london-time';
import type { ContentRelease } from '../types';

const STATUS: Record<ContentRelease['status'], { label: string; tone: BadgeTone }> = {
  open: { label: 'Not scheduled', tone: 'neutral' },
  scheduled: { label: 'Scheduled', tone: 'info' },
  published: { label: 'Live', tone: 'good' },
  failed: { label: 'Did not go live', tone: 'bad' },
};

export function NewReleaseForm() {
  return (
    <form action={createRelease}>
      <TextField label="Release name" name="name" description="Like Spring sale" isRequired />
      <Button type="submit">Start a release</Button>
    </form>
  );
}

function Release({ release, now }: { release: ContentRelease; now: Date }) {
  const suggested = toLondonTime(new Date(now.getTime() + 24 * 60 * 60_000)).slice(0, 11) + '09:00';
  const status = STATUS[release.status];
  return (
    <section
      className={`${styles.panel} ${styles.flush}`}
      aria-labelledby={`release-${release.id}`}
    >
      <div className={styles.toolbar}>
        <div className={styles.listMain}>
          <h2 id={`release-${release.id}`} className={styles.panelTitle}>
            {release.name}
          </h2>
          <span className={styles.listSub}>
            {release.status === 'scheduled' && release.publishAt
              ? `Goes live ${londonLabel(release.publishAt)}, scheduled by ${release.scheduledBy}`
              : `Started by ${release.createdBy}`}
          </span>
        </div>
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>

      {release.problems.length > 0 && (
        <div className={`${styles.problem} ${styles.inset}`}>
          <div>
            <strong>Nothing in it was published, because:</strong>
            <ul>
              {release.problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {release.items.length === 0 ? (
        <EmptyState icon={<DocumentIcon />} title="Nothing in it yet">
          Open a draft and add it from the Release box beside the form.
        </EmptyState>
      ) : (
        <ul className={styles.list}>
          {release.items.map((item) => (
            <li key={item.documentId} className={styles.lineRow}>
              <span className={styles.docIcon} aria-hidden="true">
                <DocumentIcon />
              </span>
              <span className={styles.listMain}>
                <NextLink href={`/content/edit/${item.documentId}/`} className={styles.textLink}>
                  {item.title}
                </NextLink>
                <span className={styles.listSub}>{item.type}</span>
              </span>
              <form action={removeFromRelease}>
                <input type="hidden" name="releaseId" value={release.id} />
                <input type="hidden" name="documentId" value={item.documentId} />
                <Button type="submit" variant="secondary">
                  Take out
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <form action={changeRelease} className={`${styles.inlineCreate} ${styles.panelFoot}`}>
        <input type="hidden" name="releaseId" value={release.id} />
        {release.status !== 'scheduled' && (
          <TextField
            label="Go live at (UK time)"
            name="publishAt"
            type="datetime-local"
            defaultValue={suggested}
          />
        )}
        <div className={styles.saveActions}>
          {release.status === 'scheduled' ? (
            <Button type="submit" name="intent" value="unschedule" variant="secondary">
              Unschedule
            </Button>
          ) : (
            <Button type="submit" name="intent" value="schedule">
              Schedule
            </Button>
          )}
          <Button type="submit" name="intent" value="publish" variant="secondary">
            Publish everything now
          </Button>
          <button type="submit" name="intent" value="delete" className={styles.dangerButton}>
            Delete
          </button>
        </div>
      </form>
    </section>
  );
}

function LiveReleases({ releases }: { releases: ContentRelease[] }) {
  return (
    <section className={`${styles.panel} ${styles.flush}`} aria-labelledby="live">
      <div className={styles.toolbar}>
        <h2 id="live" className={styles.panelTitle}>
          Already live
        </h2>
        <span className={styles.count}>{releases.length}</span>
      </div>
      <ul className={styles.list}>
        {releases.map((release) => (
          <li key={release.id} className={styles.lineRow}>
            <span className={styles.docIcon} aria-hidden="true">
              <RocketIcon />
            </span>
            <span className={styles.listMain}>
              <strong>{release.name}</strong>
              <span className={styles.listSub}>
                {release.items.map((item) => item.title).join(' · ') || 'Nothing in it'}
              </span>
            </span>
            <span className={styles.listEnd}>
              {release.publishedAt && <span>{londonLabel(release.publishedAt)}</span>}
              <Badge tone="good">Live</Badge>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ReleaseList({ releases, now }: { releases: ContentRelease[]; now: Date }) {
  const upcoming = releases.filter((release) => release.status !== 'published');
  const live = releases.filter((release) => release.status === 'published');
  return (
    <div className={styles.stack}>
      {upcoming.length === 0 ? (
        <section className={styles.panel}>
          <EmptyState icon={<RocketIcon />} title="No releases waiting">
            Start one with the button at the top, then add drafts to it.
          </EmptyState>
        </section>
      ) : (
        upcoming.map((release) => <Release key={release.id} release={release} now={now} />)
      )}
      {live.length > 0 && <LiveReleases releases={live} />}
    </div>
  );
}
