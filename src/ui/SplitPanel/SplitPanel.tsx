import Image from 'next/image';
import type { ReactNode } from 'react';
import styles from './SplitPanel.module.css';

export interface SplitPanelPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

interface Props {
  id: string;
  eyebrow: string;
  heading: string;
  photo: SplitPanelPhoto;
  photoSide?: 'start' | 'end';
  children: ReactNode;
}

// The brochures' main layout: a full-height photo beside a deep aubergine panel.
export function SplitPanel({ id, eyebrow, heading, photo, photoSide = 'start', children }: Props) {
  return (
    <section className={styles.split} data-photo={photoSide} aria-labelledby={id} data-reveal="">
      <figure className={styles.photo}>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 64rem) 50vw, 100vw"
        />
        {photo.caption && <figcaption className="caption">{photo.caption}</figcaption>}
      </figure>
      <div className={styles.panel}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{heading}</h2>
        {children}
      </div>
    </section>
  );
}
