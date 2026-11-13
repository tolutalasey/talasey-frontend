'use client';

import { useEffect, useRef } from 'react';
import styles from './ErrorSummary.module.css';

export interface FieldProblem {
  fieldId: string;
  message: string;
}

export interface ErrorSummaryProps {
  errors: FieldProblem[];
  title?: string;
}

// Put it at the top of a form. When errors arrive it takes focus, so keyboard and screen reader
// users hear what went wrong and can jump to each field.
export function ErrorSummary({ errors, title = 'There is a problem' }: ErrorSummaryProps) {
  const summary = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errors.length > 0) summary.current?.focus();
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <div
      ref={summary}
      className={styles.summary}
      tabIndex={-1}
      role="group"
      aria-labelledby="error-summary-title"
    >
      <h2 id="error-summary-title" className={styles.title}>
        {title}
      </h2>
      <ul className={styles.list}>
        {errors.map((error) => (
          <li key={error.fieldId}>
            <a href={`#${error.fieldId}`}>{error.message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
