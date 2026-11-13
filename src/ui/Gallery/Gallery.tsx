'use client';

import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup, type Key } from 'react-aria-components';
import styles from './Gallery.module.css';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface GalleryProps {
  label: string;
  images: GalleryImage[];
}

// One large image and a row of thumbnails. The thumbnails are one tab stop; arrow keys move
// between them and Enter or Space shows the image.
export function Gallery({ label, images }: GalleryProps) {
  const [selected, setSelected] = useState<Key>(images[0]?.id ?? '');
  const index = Math.max(
    images.findIndex((image) => image.id === selected),
    0,
  );
  const current = images[index];
  if (!current) return null;

  return (
    <section aria-label={label} className={styles.gallery}>
      <figure className={styles.stage}>
        <img
          className={styles.image}
          src={current.src}
          alt={current.alt}
          width={current.width}
          height={current.height}
        />
        <figcaption className={styles.caption} aria-live="polite">
          Image {index + 1} of {images.length}
        </figcaption>
      </figure>
      {images.length > 1 && (
        <ToggleButtonGroup
          aria-label={`${label} images`}
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[selected]}
          onSelectionChange={(keys) => {
            const [key] = keys;
            if (key !== undefined) setSelected(key);
          }}
          className={styles.thumbs}
        >
          {images.map((image, position) => (
            <ToggleButton
              key={image.id}
              id={image.id}
              aria-label={`Show image ${position + 1}: ${image.alt}`}
              className={styles.thumb}
            >
              <img src={image.src} alt="" width={88} height={66} loading="lazy" />
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    </section>
  );
}
