import { slugify } from '@/lib/slug';
import { RichText } from '@/features/pages';
import type { Faq } from '../schemas';
import styles from './Content.module.css';
import { OpenFromHash } from './OpenFromHash';

// Each question opens to its answer. The id lets a search result link straight to it.
export function FaqList({ faqs, heading = 'Questions' }: { faqs: Faq[]; heading?: string }) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby="faq-title" className={styles.section}>
      <h2 id="faq-title">{heading}</h2>
      <div className={styles.faqs}>
        {faqs.map((faq) => (
          <details key={faq.question} id={slugify(faq.question)} className={styles.faq}>
            <summary>{faq.question}</summary>
            <div className={styles.faqAnswer}>
              <RichText text={faq.answer} heading="h3" />
            </div>
          </details>
        ))}
      </div>
      <OpenFromHash />
    </section>
  );
}
