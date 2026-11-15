import Image from 'next/image';
import NextLink from 'next/link';
import { MotionToggle } from '@/ui/MotionToggle/MotionToggle';
import { heroScenes } from '../brand';
import type { HomeContent } from '../content';
import styles from './HomeHero.module.css';

interface Props {
  content: HomeContent;
  rangeNames: string[];
}

export function HomeHero({ content, rangeNames }: Props) {
  const [primary, secondary] = content.heroActions;
  const scenes = content.heroScenes.length > 0 ? content.heroScenes : heroScenes;
  return (
    <section className={styles.hero} aria-labelledby="home-title" data-motion="">
      <div className={styles.frame}>
        <div className={styles.scenes}>
          {scenes.map((scene, index) => (
            <div key={scene.href} className={styles.scene}>
              <Image
                src={scene.photo.src}
                alt={scene.photo.alt}
                fill
                sizes="100vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        <span className={`sticker ${styles.sticker}`} aria-hidden="true">
          Free samples
        </span>
        <MotionToggle label="Pause the photos" tone="dark" className={styles.toggle} />
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
        <ul className={styles.tabs} aria-label="In the photos">
          {scenes.map((scene, index) => (
            <li key={scene.href}>
              <NextLink href={scene.href} className={styles.tab}>
                <span className={styles.line} aria-hidden="true" />
                <span className={styles.topic}>
                  {String(index + 1).padStart(2, '0')} · {scene.topic}
                </span>
                <span className={styles.tabTitle}>{scene.title}</span>
              </NextLink>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.ribbon} aria-hidden="true">
        <div className={styles.track}>
          {[...rangeNames, ...rangeNames].map((name, index) => (
            <span key={index}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
