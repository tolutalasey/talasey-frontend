import type { FormState } from '@/lib/form-feedback';
import { applyPromotionCode, removePromotionCode } from '../actions';
import styles from './PromotionCodeForm.module.css';

interface Props {
  code: string | null;
  feedback?: FormState;
}

// Plain forms: nothing for the browser to download, and they work without JavaScript.
export function PromotionCodeForm({ code, feedback }: Props) {
  if (code)
    return (
      <form action={removePromotionCode} className={styles.applied}>
        <p role="status">
          Code <strong>{code}</strong> added.
        </p>
        <button type="submit" className={styles.button}>
          Remove code
        </button>
      </form>
    );
  const problem = feedback?.fieldErrors?.code;
  return (
    <form action={applyPromotionCode} className={styles.form} noValidate>
      <label htmlFor="promotion-code">Discount code</label>
      <div className={styles.row}>
        <input
          id="promotion-code"
          name="code"
          autoComplete="off"
          autoCapitalize="characters"
          defaultValue={feedback?.values?.code}
          aria-invalid={problem ? true : undefined}
          aria-describedby={problem ? 'promotion-code-problem' : undefined}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Apply
        </button>
      </div>
      {problem && (
        <p id="promotion-code-problem" role="alert" className={styles.error}>
          {problem}
        </p>
      )}
    </form>
  );
}
