import Image from 'next/image';
import NextLink from 'next/link';
import type { RangeGalleryItem } from '../ranges';
import styles from './RangeGallery.module.css';

interface Props {
  name: string;
  items: RangeGalleryItem[];
  // A range with no products yet leads with the gallery and the ways to ask about it.
  withEnquiry: boolean;
  samples: boolean;
}

// Photos of the range, from its page in /content or else from the brochures.
export function RangeGallery({ name, items, withEnquiry, samples }: Props) {
  if (items.length === 0 && !withEnquiry) return null;
  const lower = name.toLowerCase();
  return (
    <section className={styles.gallery} aria-labelledby="range-gallery-title">
      <div className={styles.head}>
        <div>
          <p className="eyebrow">{withEnquiry ? 'Ask our team' : 'Gallery'}</p>
          <h2 id="range-gallery-title">
            {withEnquiry ? `Talk to us about ${lower}` : `${name} in real gardens`}
          </h2>
          {withEnquiry && (
            <p className={styles.text}>
              Tell us what you have in mind and we&rsquo;ll come back with sizes, finishes and
              prices.
            </p>
          )}
        </div>
        {withEnquiry && (
          <p className={styles.actions}>
            <NextLink href="/contact/" className="button">
              Ask about {lower}
            </NextLink>
            {samples && (
              <NextLink href="/samples/" className="button-secondary">
                Free samples
              </NextLink>
            )}
          </p>
        )}
      </div>
      {items.length > 0 && (
        <ul className={styles.grid}>
          {items.map((item, index) => (
            <li key={item.photo.src} className={styles.item} data-wide={index === 0 || undefined}>
              <Image
                src={item.photo.src}
                alt={item.photo.alt}
                width={item.photo.width}
                height={item.photo.height}
                sizes={
                  index === 0 ? '(min-width: 64rem) 66vw, 100vw' : '(min-width: 64rem) 33vw, 50vw'
                }
              />
              {item.caption && <span className={styles.caption}>{item.caption}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
