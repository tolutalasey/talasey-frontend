import { Button, TextField } from '@/ui';
import NextLink from 'next/link';
import { staffStyles as styles } from '@/features/staff';
import { changeRelease, createRelease, removeFromRelease } from '../actions';
import { londonLabel, toLondonTime } from '../london-time';
import type { ContentRelease } from '../types';

const STATUS = {
  open: 'Not scheduled',
  scheduled: 'Scheduled',
  published: 'Live',
  failed: 'Did not go live',
} as const;

function Release({ release, now }: { release: ContentRelease; now: Date }) {
  const live = release.status === 'published';
  const suggested = toLondonTime(new Date(now.getTime() + 24 * 60 * 60_000)).slice(0, 11) + '09:00';
  return (
    <section
      className={`${styles.panel} ${styles.stack}`}
      aria-labelledby={`release-${release.id}`}
    >
      <h2 id={`release-${release.id}`}>{release.name}</h2>
      <p>
        <span className={styles.status}>{STATUS[release.status]}</span>{' '}
        <span className={styles.muted}>
          {release.status === 'scheduled' && release.publishAt
            ? `Goes live ${londonLabel(release.publishAt)}, scheduled by ${release.scheduledBy}`
            : live && release.publishedAt
              ? `Went live ${londonLabel(release.publishedAt)}`
              : `Started by ${release.createdBy}`}
        </span>
      </p>
      {release.problems.length > 0 && (
        <div className={styles.problem}>
          <strong>Nothing in it was published, because:</strong>
          <ul>
            {release.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}
      {release.items.length === 0 ? (
        <p className={styles.muted}>
          Empty. Open a draft and choose <strong>Save and add to release</strong>.
        </p>
      ) : (
        <ul>
          {release.items.map((item) => (
            <li key={item.documentId}>
              <NextLink href={`/content/edit/${item.documentId}/`}>{item.title}</NextLink>{' '}
              <span className={styles.muted}>({item.type})</span>
              {!live && (
                <form action={removeFromRelease} className={styles.row}>
                  <input type="hidden" name="releaseId" value={release.id} />
                  <input type="hidden" name="documentId" value={item.documentId} />
                  <Button type="submit" variant="secondary">
                    Take out
                  </Button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
      {!live && (
        <form action={changeRelease} className={styles.stack}>
          <input type="hidden" name="releaseId" value={release.id} />
          {release.status !== 'scheduled' && (
            <TextField
              label="Go live at (UK time)"
              name="publishAt"
              type="datetime-local"
              defaultValue={suggested}
            />
          )}
          <div className={styles.actions}>
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
            <Button type="submit" name="intent" value="delete" variant="secondary">
              Delete release
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

export function ReleaseList({ releases, now }: { releases: ContentRelease[]; now: Date }) {
  return (
    <>
      <p>
        A release puts several changes live at the same moment, for example a sale&apos;s pages,
        banners and FAQs. Everything in it publishes together, or nothing does.
      </p>
      <form action={createRelease} className={`${styles.panel} ${styles.row}`}>
        <TextField label="New release name" name="name" isRequired />
        <Button type="submit">Start a release</Button>
      </form>
      {releases.map((release) => (
        <Release key={release.id} release={release} now={now} />
      ))}
    </>
  );
}
