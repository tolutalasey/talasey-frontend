import { AlertCircleIcon, CheckCircleIcon } from './icons';
import styles from './Staff.module.css';

interface Props {
  message?: string | string[];
  error?: string | string[];
}

const list = (value?: string | string[]) =>
  (Array.isArray(value) ? value : value ? [value] : []).flatMap((entry) => entry.split('\n'));

// What happened after a save, read from the address so it works without JavaScript.
export function Notice({ message, error }: Props) {
  const problems = list(error);
  return (
    <>
      {list(message).map((text) => (
        <div key={text} role="status" className={styles.notice}>
          <CheckCircleIcon />
          <p>{text}</p>
        </div>
      ))}
      {problems.length > 0 && (
        <div role="alert" className={styles.problem}>
          <AlertCircleIcon />
          <div>
            <strong>{problems.length === 1 ? 'Fix this first' : 'Fix these first'}</strong>
            <ul>
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
