import Image from 'next/image';
import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import { RichText } from '@/features/pages';
import { formatNewsDate, NEWS_PATH, newsHref, newsPostPath, parseNewsFilters } from '../news';
import type { NewsPost } from '../schemas';
import { NewsCard } from './NewsCard';
import styles from './News.module.css';

interface Props {
  post: NewsPost;
  related: NewsPost[];
}

export function NewsArticle({ post, related }: Props) {
  const noFilters = parseNewsFilters({});
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'News & blogs', path: NEWS_PATH },
          { name: post.title, path: newsPostPath(post) },
        ]}
      />
      <header className={styles.header}>
        <p className={styles.meta}>
          <time dateTime={post.publishedOn}>{formatNewsDate(post.publishedOn)}</time>
        </p>
        <h1>{post.title}</h1>
        {post.categories.length > 0 && (
          <ul className={styles.chips} aria-label="Categories">
            {post.categories.map((category) => (
              <li key={category}>
                <NextLink href={newsHref(noFilters, { category })}>{category}</NextLink>
              </li>
            ))}
          </ul>
        )}
      </header>
      <div className={`${styles.panel} ${styles.story}`}>
        {post.photo && (
          <Image
            className={styles.hero}
            src={post.photo.src}
            alt={post.photo.alt || post.title}
            width={post.photo.width}
            height={post.photo.height}
            sizes="(min-width: 48rem) 46rem, 100vw"
            priority
          />
        )}
        <RichText text={post.body} />
      </div>
      {related.length > 0 && (
        <section className={styles.panel} aria-labelledby="related-title">
          <div className={styles.headRow}>
            <h2 id="related-title">More from the blog</h2>
            <NextLink href={NEWS_PATH} className="chip">
              All articles
            </NextLink>
          </div>
          <ul className={styles.grid}>
            {related.map((other) => (
              <NewsCard key={other.slug} post={other} />
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
