import { StarIcon } from '../icons';
import styles from './ReviewCard.module.css';

export interface ReviewCardProps {
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  author: string;
  date: string;
  dateLabel: string;
  verified?: boolean;
}

const STARS = [1, 2, 3, 4, 5] as const;

export function ReviewCard({
  rating,
  title,
  body,
  author,
  date,
  dateLabel,
  verified,
}: ReviewCardProps) {
  return (
    <article className={styles.review}>
      <p className={styles.rating}>
        <span className={styles.stars} aria-hidden="true">
          {STARS.map((star) => (
            <StarIcon key={star} filled={star <= rating} />
          ))}
        </span>
        <span className={styles.ratingText}>Rated {rating} out of 5</span>
      </p>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
      <p className={styles.meta}>
        {author}, <time dateTime={date}>{dateLabel}</time>
        {verified && <span className={styles.verified}> · Verified buyer</span>}
      </p>
    </article>
  );
}
