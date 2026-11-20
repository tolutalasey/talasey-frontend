import Image from 'next/image';
import NextLink from 'next/link';
import { formatNewsDate, newsPostPath } from '../news';
import type { NewsPost } from '../schemas';
import styles from './News.module.css';

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <li className={styles.card}>
      <div className={styles.cover}>
        {post.photo && (
          <Image
            src={post.photo.src}
            alt=""
            width={post.photo.width}
            height={post.photo.height}
            sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw"
          />
        )}
      </div>
      <p className={styles.meta}>
        <time dateTime={post.publishedOn}>{formatNewsDate(post.publishedOn)}</time>
        {post.categories[0] && ` · ${post.categories[0]}`}
      </p>
      <h3 className={styles.cardTitle}>
        <NextLink href={newsPostPath(post)} className={styles.cardLink}>
          {post.title}
        </NextLink>
      </h3>
      {post.excerpt && <p className={styles.muted}>{post.excerpt}</p>}
    </li>
  );
}
