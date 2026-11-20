import NextLink from 'next/link';
import type { ContentGroup } from '../content-search';
import styles from './ContentResults.module.css';

const MORE: Partial<
  Record<ContentGroup['kind'], (query: string) => { href: string; label: string }>
> = {
  document: (query) => ({
    href: `/knowledge-hub/?q=${encodeURIComponent(query)}`,
    label: 'See them all in the Knowledge Hub',
  }),
  video: () => ({ href: '/videos/', label: 'All videos' }),
  guide: () => ({ href: '/guides/', label: 'All articles and guides' }),
};

// Below the products: ranges, documents, videos, articles and pages that match the search.
export function ContentResults({ groups, query }: { groups: ContentGroup[]; query: string }) {
  if (groups.length === 0) return null;
  return (
    <section className={styles.content} aria-labelledby="content-results">
      <h2 id="content-results" className={styles.title}>
        Also on the site
      </h2>
      <div className={styles.groups}>
        {groups.map((group) => {
          const more = group.total > group.entries.length ? MORE[group.kind]?.(query) : undefined;
          return (
            <section
              key={group.kind}
              className={`frame ${styles.group}`}
              aria-labelledby={`content-${group.kind}`}
            >
              <h3 id={`content-${group.kind}`}>
                {group.heading} <span className={styles.count}>({group.total})</span>
              </h3>
              <ul>
                {group.entries.map((entry) => (
                  <li key={entry.href}>
                    {entry.kind === 'document' ? (
                      <a href={entry.href} target="_blank" rel="noreferrer">
                        {entry.title}
                      </a>
                    ) : (
                      <NextLink href={entry.href}>{entry.title}</NextLink>
                    )}
                    {entry.label && <span className={styles.label}>{entry.label}</span>}
                  </li>
                ))}
              </ul>
              {more && <NextLink href={more.href}>{more.label}</NextLink>}
            </section>
          );
        })}
      </div>
    </section>
  );
}
