import NextLink from 'next/link';
import styles from './HomeSections.module.css';

export interface NewsItem {
  title: string;
  topic: string;
  summary: string;
  href: string;
}

interface Props {
  heading: string;
  intro: string;
  items: NewsItem[];
}

export function LatestNews({ heading, intro, items }: Props) {
  if (items.length === 0) return null;
  return (
    <section className={styles.section} aria-labelledby="news-title">
      <div className={styles.headRow}>
        <div className={styles.head}>
          <p className="eyebrow">Inspiration hub</p>
          <h2 id="news-title">{heading}</h2>
          {intro && <p className={styles.intro}>{intro}</p>}
        </div>
        <NextLink href="/news/" className="chip">
          See all articles
        </NextLink>
      </div>
      <ul className={styles.news}>
        {items.map((item) => (
          <li key={item.href} className={`frame ${styles.newsCard}`}>
            <p className="eyebrow">{item.topic}</p>
            <h3>
              <NextLink href={item.href} className={styles.tileLink}>
                {item.title}
              </NextLink>
            </h3>
            <p>{item.summary}</p>
            <span className={styles.readMore} aria-hidden="true">
              Read article
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
