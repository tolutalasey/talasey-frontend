import NextLink from 'next/link';
import { Pagination } from '@/features/catalogue';
import { PageBreadcrumbs } from '@/features/layout';
import { filterDocuments, hubHref, type HubFilters } from '../filters';
import { DOCUMENT_KINDS, DOCUMENT_RANGES, type HubDocument, type Video } from '../schemas';
import { DocumentCard } from './DocumentCard';
import styles from './KnowledgeHub.module.css';
import { VideoCard } from './VideoCard';

interface Props {
  documents: HubDocument[];
  videos: Video[];
  filters: HubFilters;
}

interface Choice {
  label: string;
  count: number;
  selected: boolean;
  href: string;
}

function FilterGroup({ id, label, choices }: { id: string; label: string; choices: Choice[] }) {
  return (
    <div className={styles.filterGroup}>
      <p id={id}>{label}</p>
      <ul className={styles.chips} aria-labelledby={id}>
        {choices.map((choice) => (
          <li key={choice.label}>
            <NextLink
              href={choice.href}
              aria-current={choice.selected ? 'true' : undefined}
              scroll={false}
            >
              {choice.label} ({choice.count})
            </NextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KnowledgeHub({ documents, videos, filters }: Props) {
  const result = filterDocuments(documents, filters);
  const countWith = (change: Partial<HubFilters>) =>
    filterDocuments(documents, { ...filters, ...change, page: 1 }).total;
  const ranges = DOCUMENT_RANGES.map((range) => ({
    label: range,
    count: countWith({ range }),
    selected: filters.range === range,
    href: hubHref(filters, { range: filters.range === range ? null : range, page: 1 }),
  })).filter((choice) => choice.count > 0 || choice.selected);
  const kinds = DOCUMENT_KINDS.map((kind) => ({
    label: kind,
    count: countWith({ kind }),
    selected: filters.kind === kind,
    href: hubHref(filters, { kind: filters.kind === kind ? null : kind, page: 1 }),
  })).filter((choice) => choice.count > 0 || choice.selected);
  const filtered = Boolean(filters.range || filters.kind || filters.query);

  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Knowledge Hub', path: '/knowledge-hub/' },
        ]}
      />
      <header className={styles.header}>
        <h1>Knowledge Hub</h1>
        <p className={styles.intro}>
          Product documents, installation guides, technical information and videos to help you
          specify, install and look after Talasey products with confidence.
        </p>
      </header>

      <section className={styles.panel} aria-labelledby="finder-title">
        <h2 id="finder-title">Find a document</h2>
        <form action="/knowledge-hub/" className={styles.search} role="search">
          {filters.range && <input type="hidden" name="range" value={filters.range} />}
          {filters.kind && <input type="hidden" name="type" value={filters.kind} />}
          <label>
            Search by name
            <input type="search" name="q" defaultValue={filters.query} placeholder="Pavetuf" />
          </label>
          <button type="submit">Search</button>
        </form>
        <FilterGroup id="filter-range" label="Product range" choices={ranges} />
        <FilterGroup id="filter-type" label="Document type" choices={kinds} />
        {filtered && (
          <NextLink href="/knowledge-hub/" scroll={false}>
            Clear filters
          </NextLink>
        )}
      </section>

      <section className={styles.panel} aria-labelledby="results-title">
        <div className={styles.headRow}>
          <h2 id="results-title">{filtered ? 'Matching documents' : 'All documents'}</h2>
          <p className={styles.muted} aria-live="polite">
            {result.total} {result.total === 1 ? 'document' : 'documents'}
          </p>
        </div>
        {result.documents.length === 0 ? (
          <p>
            Nothing matches that. Try fewer filters, or{' '}
            <NextLink href="/contact/">ask our team</NextLink> for the document you need.
          </p>
        ) : (
          <ul className={styles.documents}>
            {result.documents.map((entry) => (
              <DocumentCard key={entry.slug} document={entry} />
            ))}
          </ul>
        )}
        <Pagination
          page={result.page}
          pageCount={result.pages}
          hrefFor={(page) => hubHref(filters, { page })}
        />
      </section>

      {videos.length > 0 && (
        <section className={styles.panel} aria-labelledby="videos-title">
          <div className={styles.headRow}>
            <h2 id="videos-title">Watch, read and stay ahead</h2>
            <NextLink href="/videos/" className="chip">
              All {videos.length} videos
            </NextLink>
          </div>
          <p className={styles.muted}>Practical walkthroughs from our technical trainers.</p>
          <ul className={styles.videos}>
            {videos.slice(0, 4).map((video) => (
              <VideoCard key={video.slug} video={video} />
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
