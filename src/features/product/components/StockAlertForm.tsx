import type { FormState } from '@/lib/form-feedback';
import { askForStockAlert } from '../actions';
import styles from './StockAlertForm.module.css';

interface Props {
  variantId: string;
  feedback?: FormState;
}

// Shown when the chosen option is out of stock. A plain form: no JavaScript needed or added.
export function StockAlertForm({ variantId, feedback }: Props) {
  if (feedback?.notice)
    return (
      <p role="status" className={styles.notice}>
        {feedback.notice}
      </p>
    );
  const problem = feedback?.fieldErrors?.email;
  return (
    <form action={askForStockAlert} className={styles.form} noValidate>
      <input type="hidden" name="variantId" value={variantId} />
      <label htmlFor="stock-alert-email" className={styles.label}>
        Email me when it&apos;s back
      </label>
      {feedback?.message && (
        <p role="alert" className={styles.error}>
          {feedback.message}
        </p>
      )}
      <div className={styles.row}>
        <input
          id="stock-alert-email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={feedback?.values?.email}
          aria-invalid={problem ? true : undefined}
          aria-describedby={problem ? 'stock-alert-problem' : 'stock-alert-hint'}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Email me
        </button>
      </div>
      {problem ? (
        <p id="stock-alert-problem" className={styles.error}>
          {problem}
        </p>
      ) : (
        <p id="stock-alert-hint" className={styles.hint}>
          One email, only for this, then we forget it.
        </p>
      )}
    </form>
  );
}
