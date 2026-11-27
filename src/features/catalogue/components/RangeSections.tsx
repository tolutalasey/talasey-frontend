import Image from 'next/image';
import NextLink from 'next/link';
import { rangePhoto } from '../range-photos';
import { rangePath, type Range } from '../ranges';
import styles from './Listing.module.css';

// A landing page's own ranges, each a card through to its page, as on Fencing, Gates &
// Balustrades.
export function RangeSections({ ranges }: { ranges: Range[] }) {
  if (ranges.length === 0) return null;
  return (
    <ul className={styles.sections}>
      {ranges.map((range) => {
        const photo = range.photo ?? rangePhoto(range.slug);
        return (
          <li key={range.slug} className={`frame ${styles.section}`}>
            <Image
              src={photo.src}
              alt=""
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 64rem) 33vw, 100vw"
            />
            <h2>
              <NextLink href={rangePath(range)} className={styles.sectionLink}>
                {range.name}
              </NextLink>
            </h2>
            <p>{range.intro}</p>
            <p className={styles.sectionAction} aria-hidden="true">
              View {range.name.toLowerCase()}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
