import NextLink from 'next/link';
import { Pagination } from '@/features/catalogue';
import { PageBreadcrumbs } from '@/features/layout';
import { filterNews, NEWS_PATH, newsHref, type NewsFilters } from '../news';
import { NEWS_CATEGORIES, type NewsPost } from '../schemas';
import { NewsCard } from './NewsCard';
import styles from './News.module.css';

interface Props {
  posts: NewsPost[];
  filters: NewsFilters;
}

export function NewsPage({ posts, filters }: Props) {
  const result = filterNews(posts, filters);
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'News & blogs', path: NEWS_PATH },
        ]}
      />
      <header className={styles.header}>
        <h1>News & blogs</h1>
        <p className={styles.intro}>
          Company news, awards, events, case studies and advice from the Talasey team.
        </p>
      </header>
      <section className={styles.panel} aria-labelledby="news-list-title">
        <div className={styles.headRow}>
          <h2 id="news-list-title">{filters.category ?? 'All articles'}</h2>
          <p className={styles.muted} aria-live="polite">
            {result.total} {result.total === 1 ? 'article' : 'articles'}
          </p>
        </div>
        <ul className={styles.chips} aria-label="Categories">
          <li>
            <NextLink
              href={newsHref(filters, { category: null, page: 1 })}
              aria-current={filters.category ? undefined : 'true'}
              scroll={false}
            >
              All ({posts.length})
            </NextLink>
          </li>
          {NEWS_CATEGORIES.filter((category) => result.counts[category] > 0).map((category) => (
            <li key={category}>
              <NextLink
                href={newsHref(filters, { category, page: 1 })}
                aria-current={filters.category === category ? 'true' : undefined}
                scroll={false}
              >
                {category} ({result.counts[category]})
              </NextLink>
            </li>
          ))}
        </ul>
        <ul className={styles.grid}>
          {result.shown.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </ul>
        <Pagination
          page={result.page}
          pageCount={result.pages}
          hrefFor={(page) => newsHref(filters, { page })}
          keepScroll
        />
      </section>
    </article>
  );
}
