import NextLink from 'next/link';
import type { LocalHelpContent } from '../local-help-content';
import styles from './LocalHelp.module.css';

// The current site's sections under the form: why, how it works, coverage and questions.
export function LocalHelpSections({ content }: { content: LocalHelpContent }) {
  return (
    <>
      {content.sections.map((section) => (
        <section key={section.heading} className={`frame ${styles.section}`}>
          {section.eyebrow && <p className="eyebrow">{section.eyebrow}</p>}
          <h2>{section.heading}</h2>
          {section.text && <p className={styles.sectionText}>{section.text}</p>}
          {section.steps && (
            <ol className={styles.steps}>
              {section.steps.map((step) => (
                <li key={step.title}>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          )}
          {section.points && (
            <ul className={styles.points}>
              {section.points.map((point) => (
                <li key={point.title}>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </li>
              ))}
            </ul>
          )}
          {section.counts && (
            <ul className={styles.counts}>
              {section.counts.map((region) => (
                <li key={region.label}>
                  <strong>{region.count}</strong> {region.label}
                </li>
              ))}
            </ul>
          )}
          {section.list && (
            <ul className={styles.list}>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.action && (
            <p>
              <NextLink href={section.action.href} className="button">
                {section.action.label}
              </NextLink>
            </p>
          )}
        </section>
      ))}
      {content.faqs.length > 0 && (
        <section className={`frame ${styles.section}`} aria-labelledby="local-questions">
          <p className="eyebrow">Good to know</p>
          <h2 id="local-questions">Questions, answered</h2>
          <div className={styles.faqs}>
            {content.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
