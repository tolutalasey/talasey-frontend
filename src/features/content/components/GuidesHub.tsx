import { PageBreadcrumbs } from '@/features/layout';
import { GUIDE_TOPICS, type Guide } from '../schemas';
import { guidePath } from '../paths';
import { Cards } from './Cards';
import styles from './Content.module.css';

export function GuidesHub({ guides }: { guides: Guide[] }) {
  const topics = GUIDE_TOPICS.filter((topic) => guides.some((guide) => guide.topic === topic));
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides/' },
        ]}
      />
      <header className={styles.header}>
        <h1>Guides and advice</h1>
        <p className={styles.intro}>
          Straight answers on planning, buying, laying and looking after your garden, from the
          people who make and sell the products.
        </p>
      </header>
      {topics.map((topic) => (
        <section key={topic} aria-labelledby={`topic-${topic}`} className={styles.wide}>
          <h2 id={`topic-${topic}`}>{topic}</h2>
          <Cards
            label={`${topic} guides`}
            items={guides
              .filter((guide) => guide.topic === topic)
              .map((guide) => ({ href: guidePath(guide), title: guide.title, text: guide.answer }))}
          />
        </section>
      ))}
    </article>
  );
}
