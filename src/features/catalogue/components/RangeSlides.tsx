'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { RangePhoto } from '../range-photos';
import styles from './RangeSlides.module.css';

interface Props {
  name: string;
  photos: (RangePhoto & { alt: string })[];
}

// The photos at the top of a range page, one at a time, as the current site's slider shows them.
export function RangeSlides({ name, photos }: Props) {
  const [shown, setShown] = useState(0);
  const step = (by: number) => setShown((index) => (index + by + photos.length) % photos.length);
  return (
    <div className={styles.slides} aria-roledescription="carousel" aria-label={`${name} photos`}>
      {photos.map((photo, index) => (
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 64rem) 55vw, 100vw"
          priority={index === 0}
          className={index === shown ? styles.shown : styles.hidden}
          aria-hidden={index !== shown}
        />
      ))}
      {photos.length > 1 && (
        <div className={styles.controls}>
          <button type="button" onClick={() => step(-1)} aria-label="Previous photo">
            ‹
          </button>
          <span aria-live="polite">
            {shown + 1} / {photos.length}
          </span>
          <button type="button" onClick={() => step(1)} aria-label="Next photo">
            ›
          </button>
        </div>
      )}
    </div>
  );
}
