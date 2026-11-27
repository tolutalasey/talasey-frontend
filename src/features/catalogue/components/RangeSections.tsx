import Image from 'next/image';
import NextLink from 'next/link';
import { ownRangePhoto, rangePhoto } from '../range-photos';
import { rangePath, type Range } from '../ranges';
import styles from './Listing.module.css';

// A landing page's own ranges, each a card through to its page, as on Fencing, Gates &
// Balustrades.
export interface RangeSection {
  range: Range;
  // A photo of one of its products, for ranges with no photo of their own; failing that, the
  // first photo from its page on the current site.
  productPhoto?: string | null;
}

export function RangeSections({ sections }: { sections: RangeSection[] }) {
  if (sections.length === 0) return null;
  return (
    <ul className={styles.sections}>
      {sections.map(({ range, productPhoto }) => {
        const photo =
          ownRangePhoto(range.slug) ??
          (productPhoto ? { src: productPhoto, width: 1200, height: 900 } : null) ??
          range.slides?.[0] ??
          range.photo ??
          rangePhoto(range.slug);
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
