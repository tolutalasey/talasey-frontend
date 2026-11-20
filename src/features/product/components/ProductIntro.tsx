import styles from './ProductPage.module.css';

const paragraphsOf = (text: string | null | undefined) =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

interface Props {
  description: string | null;
  sizes: string[];
  tags: string[];
}

// Under the name, as on the current site: what the product is, then its sizes and where it sits.
export function ProductIntro({ description, sizes, tags }: Props) {
  const paragraphs = paragraphsOf(description);
  return (
    <>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={styles.description}>
          {paragraph}
        </p>
      ))}
      {(sizes.length > 0 || tags.length > 0) && (
        <p className={styles.tags}>
          {sizes.length > 0 && <span>{sizes.join(', ')}</span>}
          {tags.length > 0 && <span>{tags.join(', ')}</span>}
        </p>
      )}
    </>
  );
}
