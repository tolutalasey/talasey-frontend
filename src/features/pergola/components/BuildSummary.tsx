import type { BuildSummary as Summary, PergolaRules } from '../rules';
import { pounds } from './usePergolaBuild';
import styles from './AmyBuilder.module.css';

interface Props {
  rules: PergolaRules;
  summary: Summary;
  pending: boolean;
  message: string | null;
  onAdd: () => void;
}

// Every step, including the ones left as "Not required", with what goes in the bag.
export function BuildSummary({ rules, summary, pending, message, onAdd }: Props) {
  return (
    <section className={styles.summary} aria-labelledby="build-summary">
      <h2 id="build-summary">Your build</h2>
      {summary.lines.length === 0 ? (
        <p className={styles.note}>Choose a size and fixing to see your build.</p>
      ) : (
        <table className={styles.table}>
          <caption className={styles.hidden}>
            Everything in your {rules.range} pergola build
          </caption>
          <thead>
            <tr>
              <th scope="col">Step</th>
              <th scope="col">Choice</th>
              <th scope="col">SKU</th>
              <th scope="col">Qty</th>
              <th scope="col">Price</th>
            </tr>
          </thead>
          <tbody>
            {summary.lines.map((line) =>
              line.items.length === 0 ? (
                <tr key={line.step} className={styles.quiet}>
                  <th scope="row">{line.step}</th>
                  <td colSpan={4}>{line.detail}</td>
                </tr>
              ) : (
                line.items.map((item, index) => (
                  <tr key={`${line.step}-${item.sku}`}>
                    <th scope="row">{index === 0 ? line.step : ''}</th>
                    <td>{index === 0 ? line.detail : ''}</td>
                    <td className={styles.sku}>{item.sku}</td>
                    <td>{item.quantity}</td>
                    <td>{pounds(item.pricePence * item.quantity)}</td>
                  </tr>
                ))
              ),
            )}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={4}>
                Total inc. VAT, delivery included
              </th>
              <td>{pounds(summary.totalPence)}</td>
            </tr>
          </tfoot>
        </table>
      )}
      {rules.messages.length > 0 && (
        <ul className={styles.messages}>
          {rules.messages.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      )}
      {message && (
        <p className={styles.error} role="alert">
          {message}
        </p>
      )}
      <button
        type="button"
        className={`button ${styles.add}`}
        disabled={!summary.ready || pending}
        onClick={onAdd}
      >
        {pending ? 'Adding your build…' : 'Add build to bag'}
      </button>
    </section>
  );
}
