import { PageBreadcrumbs } from '@/features/layout';
import { hasAnswers, type FinderAnswers } from '../answers';
import type { ProductFinder } from '../finder';
import type { FinderResults as Results } from '../loaders.server';
import { PRODUCT_FINDER_PATH } from '../paths';
import { FinderForm } from './FinderForm';
import { FinderResults } from './FinderResults';
import styles from './ProductFinder.module.css';

interface Props {
  finder: ProductFinder;
  answers: FinderAnswers;
  results: Results | null;
}

const valuesOf = (answers: FinderAnswers) =>
  Object.fromEntries(Object.entries(answers.chosen).map(([key, answer]) => [key, answer.value]));

// The questions first; once answered, the picks with the answers tucked away to change.
export function ProductFinderPage({ finder, answers, results }: Props) {
  const answered = hasAnswers(answers) && results;
  const form = (
    <FinderForm
      questions={finder.questions}
      values={valuesOf(answers)}
      area={answers.areaM2 ? String(answers.areaM2) : ''}
      stepped={!answered}
    />
  );

  return (
    <article className={styles.page}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Product finder', path: PRODUCT_FINDER_PATH },
        ]}
      />
      <header className={styles.header}>
        <p className="eyebrow">Product finder</p>
        <h1>{finder.heading}</h1>
        <p className={styles.intro}>{finder.intro}</p>
      </header>
      {answered ? (
        <>
          <FinderResults answers={answers} results={results} />
          <details className={`frame ${styles.change}`}>
            <summary>Change your answers</summary>
            {form}
          </details>
        </>
      ) : (
        form
      )}
    </article>
  );
}
