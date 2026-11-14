import Image from 'next/image';
import NextLink from 'next/link';
import { heroPhoto } from '../brand';
import type { HomeContent } from '../content';
import styles from './HomeHero.module.css';

export function HomeHero({ content }: { content: HomeContent }) {
  const [primary, secondary] = content.heroActions;
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <figure className={styles.photo}>
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          width={heroPhoto.width}
          height={heroPhoto.height}
          sizes="100vw"
          priority
        />
        <figcaption className="caption">{heroPhoto.caption}</figcaption>
      </figure>
      <span className={`sticker ${styles.sticker}`} aria-hidden="true">
        Free samples
      </span>
      <div className={`container ${styles.inner}`}>
        <div className={styles.panel}>
          <p className="eyebrow">Paving, decking and outdoor living</p>
          <h1 id="home-title" className={styles.title}>
            {content.h1}
          </h1>
          <p className={styles.intro}>{content.intro}</p>
          <p className={styles.actions}>
            <NextLink href={primary.href} className="button-on-dark">
              {primary.label}
            </NextLink>
            <NextLink href={secondary.href} className="button-outline-on-dark">
              {secondary.label}
            </NextLink>
          </p>
        </div>
      </div>
    </section>
  );
}
