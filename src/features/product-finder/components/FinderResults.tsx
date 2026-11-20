import NextLink from 'next/link';
import { productCard } from '@/features/catalogue';
import { ProductCard } from '@/ui/ProductCard/ProductCard';
import type { FinderAnswers } from '../answers';
import type { FinderResults as Results } from '../loaders.server';
import { recommendedProductPath } from '../paths';
import styles from './ProductFinder.module.css';

interface Props {
  answers: FinderAnswers;
  results: Results;
}

export function FinderResults({ answers, results }: Props) {
  const { recommendations, ranges } = results;
  const summary = Object.values(answers.chosen).map((answer) => answer.label);
  if (answers.areaM2) summary.push(`${answers.areaM2} m²`);

  return (
    <section className={styles.results} aria-labelledby="finder-results">
      <header className={styles.resultsHead}>
        <h2 id="finder-results">
          {recommendations.length > 0 ? 'Our picks for you' : 'Nothing matched just yet'}
        </h2>
        <ul className={styles.chips} aria-label="Your answers">
          {summary.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
        {answers.areaM2 && recommendations.length > 0 && (
          <p className={styles.help}>
            Each product opens with {answers.areaM2} m² in its calculator, and the jointing, primer
            or fixings to add in one go where they apply.
          </p>
        )}
      </header>

      {recommendations.length > 0 ? (
        <ul className={styles.grid}>
          {recommendations.map(({ record, reasons, colour }, index) => (
            <li key={record.handle} className={styles.pick}>
              <ProductCard
                {...productCard(record)}
                href={recommendedProductPath(record.handle, colour, answers.areaM2)}
                badge={index === 0 ? 'Best match' : undefined}
                loading={index < 3 ? 'eager' : 'lazy'}
              />
              {(reasons.length > 0 || colour) && (
                <p className={styles.reasons}>
                  <span>Why it suits you:</span>{' '}
                  {[...(colour ? [`comes in ${colour}`] : []), ...reasons].join(' · ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          We don&apos;t have products online for those answers yet. Try a different project, or call
          us and we will help you choose.
        </p>
      )}

      {ranges.length > 0 && (
        <p className={styles.more}>
          {ranges.map((range) => (
            <NextLink key={range.path} href={range.path} className="button-secondary">
              Shop all {range.name.toLowerCase()}
            </NextLink>
          ))}
        </p>
      )}
    </section>
  );
}
