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
          <p className="eyebrow">{withEnquiry ? 'Coming soon' : 'Gallery'}</p>
          <h2 id="range-gallery-title">
            {withEnquiry ? `${name}: coming soon` : `${name} in real gardens`}
          </h2>
          {withEnquiry && (
            <p className={styles.text}>
              We&rsquo;re adding {lower} to the website now. Send us a message and we&rsquo;ll tell
              you when they&rsquo;re online, or talk to us about your project today: we can already
              help with sizes, finishes and prices.
            </p>
          )}
        </div>
        {withEnquiry && (
          <p className={styles.actions}>
            <a href="#contact-form" className="button">
              Send us a message
            </a>
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
