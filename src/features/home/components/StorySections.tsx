import { SplitPanel } from '@/ui/SplitPanel/SplitPanel';
import Image from 'next/image';
import NextLink from 'next/link';
import { brochures, brochuresPage, madeToMeasurePhoto, samplesPhoto } from '../brand';
import styles from './HomeSections.module.css';

export function MadeToMeasure() {
  return (
    <SplitPanel
      id="measure-title"
      eyebrow="Made to measure"
      heading="Cut to the size your garden needs"
      photo={madeToMeasurePhoto}
      photoSide="end"
    >
      <p>
        Corten and steel planters made to your measurements. Enter the sizes on the product page and
        see the price straight away.
      </p>
      <p>
        <NextLink href="/planters/" className="button-on-dark">
          Shop planters
        </NextLink>
      </p>
    </SplitPanel>
  );
}

export function SamplesBand() {
  return (
    <section className={styles.samples} aria-labelledby="samples-title">
      <div className={`container ${styles.samplesInner}`}>
        <figure className={styles.samplesPhoto} data-reveal="">
          <Image
            src={samplesPhoto.src}
            alt={samplesPhoto.alt}
            width={samplesPhoto.width}
            height={samplesPhoto.height}
            sizes="(min-width: 64rem) 50vw, 100vw"
          />
          <span className={`sticker ${styles.samplesSticker}`} aria-hidden="true">
            Up to five free
          </span>
        </figure>
        <div className={styles.samplesText}>
          <p className="eyebrow">Free samples</p>
          <h2 id="samples-title">See it in your own garden light</h2>
          <p>
            Stone looks different in the morning, at midday and in the rain. Choose up to five
            samples and we send them to your door at no cost.
          </p>
          <p>
            <NextLink href="/samples/" className="button">
              Choose your samples
            </NextLink>
          </p>
        </div>
      </div>
    </section>
  );
}

export function BrochureRow() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="brochures-title">
      <div className={styles.headingRow}>
        <div className={styles.heading}>
          <p className="eyebrow">Free to view and download</p>
          <h2 id="brochures-title">Our brochures</h2>
        </div>
        <a href={brochuresPage}>See all eleven</a>
      </div>
      <ul className={styles.brochures}>
        {brochures.map((brochure) => (
          <li key={brochure.edition} data-reveal="">
            <a href={brochure.href} className={styles.brochure}>
              <Image
                src={brochure.image.src}
                alt=""
                width={brochure.image.width}
                height={brochure.image.height}
                sizes="(min-width: 64rem) 25vw, 50vw"
              />
              <span className={styles.brochureTitle}>
                <span className={styles.brochureEdition}>Edition {brochure.edition}</span>
                {brochure.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
