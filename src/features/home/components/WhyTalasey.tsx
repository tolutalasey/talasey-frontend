import type { HomeContent } from '../content';
import styles from './HomeSections.module.css';

type Props = Pick<HomeContent, 'whyHeading' | 'whyPoints' | 'whyStats'>;

export function WhyTalasey({ whyHeading, whyPoints, whyStats }: Props) {
  return (
    <section className={styles.section} aria-labelledby="why-title">
      <div className={`frame ${styles.why}`}>
        <div className={styles.head}>
          <p className="eyebrow">Why Talasey</p>
          <h2 id="why-title">{whyHeading}</h2>
        </div>
        {whyPoints.length > 0 && (
          <ul className={styles.points}>
            {whyPoints.map((point) => (
              <li key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </li>
            ))}
          </ul>
        )}
        {whyStats.length > 0 && (
          <dl className={styles.stats}>
            {whyStats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
