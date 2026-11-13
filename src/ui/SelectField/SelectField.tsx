import { useId } from 'react';
import styles from '../field.module.css';

export interface SelectFieldProps {
  label: string;
  name: string;
  options: readonly (string | { value: string; label: string })[];
  defaultValue?: string;
  description?: string;
  // Adds an empty first choice, for values that can be left unset.
  emptyLabel?: string;
}

// A native select: it works without JavaScript and every screen reader knows it.
export function SelectField({
  label,
  name,
  options,
  defaultValue,
  description,
  emptyLabel,
}: SelectFieldProps) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {description && (
        <span id={`${id}-description`} className={styles.description}>
          {description}
        </span>
      )}
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? ''}
        className={styles.input}
        aria-describedby={description ? `${id}-description` : undefined}
      >
        {emptyLabel !== undefined && <option value="">{emptyLabel}</option>}
        {options.map((option) => {
          const { value, label: text } =
            typeof option === 'string' ? { value: option, label: option } : option;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </div>
  );
}
