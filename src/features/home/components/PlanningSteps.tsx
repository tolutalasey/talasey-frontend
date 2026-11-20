import NextLink from 'next/link';
import type { HomeContent } from '../content';
import styles from './HomeSections.module.css';

type Props = Pick<HomeContent, 'stepsHeading' | 'stepsIntro' | 'steps'>;

export function PlanningSteps({ stepsHeading, stepsIntro, steps }: Props) {
  if (steps.length === 0) return null;
  return (
    <section className={styles.section} aria-labelledby="steps-title">
      <div className={styles.head}>
        <p className="eyebrow">Plan your garden</p>
        <h2 id="steps-title">{stepsHeading}</h2>
        {stepsIntro && <p className={styles.intro}>{stepsIntro}</p>}
      </div>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.title} className="frame">
            <span className={styles.stepNumber} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{step.title}</h3>
            <ul className={styles.stepLinks}>
              {step.links.map((link) => (
                <li key={link.href}>
                  <NextLink href={link.href} className="chip">
                    {link.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
