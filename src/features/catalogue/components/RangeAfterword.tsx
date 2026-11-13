import type { Range } from '../ranges';
import styles from './Listing.module.css';

// PRD section 6: the buying guide and questions sit below the products.
export function RangeAfterword({ range }: { range: Range }) {
  if (range.buyingGuide.length === 0 && range.faqs.length === 0) return null;
  return (
    <div className={styles.afterword}>
      {range.buyingGuide.length > 0 && (
        <section aria-labelledby="guide-title">
          <h2 id="guide-title">Buying {range.name.toLowerCase()}</h2>
          {range.buyingGuide.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      )}
      {range.faqs.length > 0 && (
        <section aria-labelledby="faq-title">
          <h2 id="faq-title">Questions</h2>
          <dl className={styles.faqs}>
            {range.faqs.map((faq) => (
              <div key={faq.question}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
