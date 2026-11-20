import { PageBreadcrumbs } from '@/features/layout';
import type { FenceBuilder as Rules } from '../content';
import type { FenceCatalogue } from '../rules';
import { FenceBuilder } from './FenceBuilder';
import styles from './FenceBuilder.module.css';

interface Props {
  builder: Rules;
  catalogue: FenceCatalogue;
  range: { name: string; path: string } | null;
  path: string;
}

// A fence kit builder: the steps and the kit, then the details in plain HTML for search engines.
export function FenceBuilderPage({ builder, catalogue, range, path }: Props) {
  return (
    <article className={styles.page}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          ...(range ? [range] : []),
          { name: `${builder.name} builder`, path },
        ]}
      />
      <header className={styles.header}>
        <p className="eyebrow">Build your fence</p>
        <h1>{builder.name} kit builder</h1>
        <p className={styles.intro}>{builder.intro}</p>
      </header>
      <FenceBuilder rules={builder} catalogue={catalogue} />
      {builder.details.length > 0 && (
        <section className={`frame ${styles.details}`} aria-labelledby="fence-details">
          <h2 id="fence-details">Product details</h2>
          {builder.details.map((detail, index) => (
            <details key={detail.heading} open={index === 0}>
              <summary>{detail.heading}</summary>
              {detail.text.split(/\n\s*\n/).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </details>
          ))}
        </section>
      )}
    </article>
  );
}
