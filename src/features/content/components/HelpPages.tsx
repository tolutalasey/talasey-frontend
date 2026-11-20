import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import { slugify } from '@/lib/slug';
import { guidePath, helpPath } from '../paths';
import type { FaqHit } from '../faq-search';
import { HELP_TOPICS, type Faq, type Guide, type HelpTopic } from '../schemas';
import { Cards } from './Cards';
import styles from './Content.module.css';
import { FaqList } from './FaqList';

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

interface HelpCentreProps {
  query: string;
  hits: FaqHit[];
  counts: Record<string, number>;
}

function FaqSearch({ query }: { query: string }) {
  return (
    <form action="/help/" method="get" role="search" className={styles.search}>
      <label>
        Search the questions
        <input type="search" name="q" defaultValue={query} autoComplete="off" />
      </label>
      <button type="submit">Search</button>
    </form>
  );
}

function SearchResults({ query, hits }: { query: string; hits: FaqHit[] }) {
  return (
    <section aria-labelledby="results-title" className={styles.section}>
      <h2 id="results-title">
        {hits.length} {hits.length === 1 ? 'answer' : 'answers'} for &ldquo;{query}&rdquo;
      </h2>
      {hits.length === 0 ? (
        <p>
          Nothing matched. Try other words, or{' '}
          <NextLink href={`/search/?q=${encodeURIComponent(query)}`}>
            search the whole site
          </NextLink>
          .
        </p>
      ) : (
        <ul className={styles.hits}>
          {hits.slice(0, 20).map(({ topic, faq }) => (
            <li key={topic.slug + faq.question}>
              <NextLink href={`${helpPath(topic)}#${slugify(faq.question)}`}>
                {faq.question}
              </NextLink>
              <span className={styles.byline}>{topic.name}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function HelpCentre({ query, hits, counts }: HelpCentreProps) {
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs items={helpCrumbs} />
      <header className={styles.header}>
        <h1>Help centre</h1>
        <p className={styles.intro}>
          Questions, answered: pick a topic or search for what you need to know.
        </p>
        <FaqSearch query={query} />
      </header>
      {query && <SearchResults query={query} hits={hits} />}
      <section aria-labelledby="topics-title" className={styles.wide}>
        <h2 id="topics-title">Topics</h2>
        <Cards
          label="Help topics"
          items={HELP_TOPICS.map((topic) => ({
            href: helpPath(topic),
            title: topic.name,
            text: counts[topic.slug]
              ? `${counts[topic.slug]} ${counts[topic.slug] === 1 ? 'question' : 'questions'}`
              : undefined,
          }))}
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
