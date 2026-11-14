import Image from 'next/image';
import NextLink from 'next/link';
import type { BrandPhoto } from '../brand';
import { madeToMeasurePhoto, samplesPhoto } from '../brand';
import styles from './HomeSections.module.css';

interface StoryProps {
  id: string;
  photo: BrandPhoto;
  eyebrow: string;
  heading: string;
  text: string;
  href: string;
  action: string;
}

function Story({ id, photo, eyebrow, heading, text, href, action }: StoryProps) {
  return (
    <article className={`frame ${styles.story}`} aria-labelledby={id} data-reveal="">
      <div className={styles.storyPhoto}>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 64rem) 50vw, 100vw"
        />
      </div>
      <div className={styles.storyText}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{heading}</h2>
        <p>{text}</p>
        <NextLink href={href} className="chip">
          {action}
        </NextLink>
      </div>
    </article>
  );
}

export function StoryPair() {
  return (
    <section
      className={`${styles.section} ${styles.pair}`}
      aria-label="Made to measure and samples"
    >
      <Story
        id="measure-title"
        photo={madeToMeasurePhoto}
        eyebrow="Made to measure"
        heading="Cut to the size your garden needs"
        text="Corten and steel planters made to your measurements. Enter the sizes on the product page and see the price straight away."
        href="/planters/"
        action="Shop planters"
      />
      <Story
        id="samples-title"
        photo={samplesPhoto}
        eyebrow="Free samples"
        heading="See it in your own garden light"
        text="Stone looks different in the morning, at midday and in the rain. Choose up to five samples and we send them to your door at no cost."
        href="/samples/"
        action="Choose your samples"
      />
    </section>
  );
}
