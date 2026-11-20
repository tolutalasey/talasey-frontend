import Image from 'next/image';
import { CheckIcon } from '@/ui/icons';
import { samplesPhoto } from '../brand';
import type { HomeContent } from '../content';
import { ActionLinks } from './ActionLinks';
import styles from './HomeSections.module.css';

type Props = Pick<
  HomeContent,
  'samplesHeading' | 'samplesText' | 'samplesPoints' | 'samplesActions'
>;

export function SamplesBlock({
  samplesHeading,
  samplesText,
  samplesPoints,
  samplesActions,
}: Props) {
  return (
    <section className={styles.section} aria-labelledby="samples-title">
      <article className={`frame ${styles.story} ${styles.samples}`}>
        <div className={styles.storyPhoto}>
          <Image
            src={samplesPhoto.src}
            alt={samplesPhoto.alt}
            width={samplesPhoto.width}
            height={samplesPhoto.height}
            sizes="(min-width: 64rem) 50vw, 100vw"
          />
        </div>
        <div className={styles.storyText}>
          <p className="eyebrow">Samples and brochures</p>
          <h2 id="samples-title">{samplesHeading}</h2>
          {samplesText && <p>{samplesText}</p>}
          {samplesPoints.length > 0 && (
            <ul className={styles.ticks}>
              {samplesPoints.map((point) => (
                <li key={point}>
                  <CheckIcon width={16} height={16} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          )}
          <ActionLinks actions={samplesActions} />
        </div>
      </article>
    </section>
  );
}
