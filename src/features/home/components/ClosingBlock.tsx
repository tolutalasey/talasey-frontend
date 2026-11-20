import type { HomeContent } from '../content';
import { ActionLinks } from './ActionLinks';
import styles from './HomeSections.module.css';

type Props = Pick<HomeContent, 'closingHeading' | 'closingText' | 'closingActions'>;

export function ClosingBlock({ closingHeading, closingText, closingActions }: Props) {
  return (
    <section className={styles.section} aria-labelledby="closing-title">
      <div className={`frame ${styles.closing}`}>
        <h2 id="closing-title">{closingHeading}</h2>
        {closingText && <p>{closingText}</p>}
        <ActionLinks actions={closingActions} />
      </div>
    </section>
  );
}
