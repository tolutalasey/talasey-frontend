import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import { guidePath, helpPath } from '../paths';
import { HELP_TOPICS, type Faq, type Guide, type HelpTopic } from '../schemas';
import { Cards } from './Cards';
import styles from './Content.module.css';
import { FaqList } from './FaqList';
import { SearchBox } from './SearchBox';

const helpCrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Help', path: '/help/' },
];

function StillStuck() {
  return (
    <p className={`${styles.note} ${styles.section}`}>
      Can&rsquo;t find what you need? <NextLink href="/contact/">Contact us</NextLink> and send a
      photo if it helps.
    </p>
  );
}

export function HelpCentre() {
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs items={helpCrumbs} />
      <header className={styles.header}>
        <h1>Help centre</h1>
        <p className={styles.intro}>
          Answers on delivery, returns, laying, care, paying and samples.
        </p>
      </header>
      <SearchBox />
      <section aria-labelledby="topics-title" className={styles.wide}>
        <h2 id="topics-title">Topics</h2>
        <Cards
          label="Help topics"
          items={HELP_TOPICS.map((topic) => ({ href: helpPath(topic), title: topic.name }))}
        />
      </section>
      <StillStuck />
    </article>
  );
}

interface HelpTopicPageProps {
  topic: HelpTopic;
  faqs: Faq[];
  guides: Guide[];
}

export function HelpTopicPage({ topic, faqs, guides }: HelpTopicPageProps) {
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs items={[...helpCrumbs, { name: topic.name, path: helpPath(topic) }]} />
      <header className={styles.header}>
        <h1>{topic.name}</h1>
      </header>
      {faqs.length === 0 && guides.length === 0 && (
        <p className={styles.note}>We&rsquo;re writing the answers for this topic now.</p>
      )}
      <FaqList faqs={faqs} heading="Common questions" />
      {guides.length > 0 && (
        <section aria-labelledby="guides-title" className={styles.wide}>
          <h2 id="guides-title">Guides</h2>
          <Cards
            label="Guides"
            items={guides.map((guide) => ({
              href: guidePath(guide),
              title: guide.title,
              text: guide.answer,
            }))}
          />
        </section>
      )}
      <StillStuck />
    </article>
  );
}
