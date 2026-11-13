import type { Faq } from '../schemas';
import styles from './Content.module.css';

export function FaqList({ faqs, heading = 'Questions' }: { faqs: Faq[]; heading?: string }) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="faq-title" className={styles.section}>
      <h2 id="faq-title">{heading}</h2>
      <dl className={styles.faqs}>
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt>{faq.question}</dt>
            <dd>{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
