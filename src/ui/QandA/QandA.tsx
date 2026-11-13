import styles from './QandA.module.css';

export interface Answered {
  question: string;
  answer: string;
  answeredBy?: string;
}

export interface QandAProps {
  items: Answered[];
}

export function QandA({ items }: QandAProps) {
  return (
    <dl className={styles.list}>
      {items.map((item) => (
        <div key={item.question} className={styles.item}>
          <dt className={styles.question}>{item.question}</dt>
          <dd className={styles.answer}>
            {item.answer}
            {item.answeredBy && (
              <span className={styles.answeredBy}> Answered by {item.answeredBy}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
