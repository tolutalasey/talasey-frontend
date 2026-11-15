'use client';

import { useState, type PointerEvent } from 'react';
import { ToggleButton, ToggleButtonGroup, type Key } from 'react-aria-components';
import { ZoomInIcon } from '../icons';
import { ZoomViewer } from './ZoomViewer';
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

const HOVER_ZOOM = 2.2;

// One large image and a row of thumbnails. The thumbnails are one tab stop; arrow keys move
// between them and Enter or Space shows the image. With a mouse, the photo magnifies where the
// pointer rests; a click, or the zoom button, opens it full screen.
export function Gallery({ label, images }: GalleryProps) {
  const [selected, setSelected] = useState<Key>(images[0]?.id ?? '');
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const [viewing, setViewing] = useState(false);
  const index = Math.max(
    images.findIndex((image) => image.id === selected),
    0,
  );
  const current = images[index];
  if (!current) return null;

  const magnify = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    setLens({
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
    });
  };

  return (
    <section aria-label={label} className={styles.gallery}>
      <figure className={styles.stage}>
        <div
          className={styles.frame}
          data-magnified={lens ? true : undefined}
          onPointerMove={magnify}
          onPointerLeave={() => setLens(null)}
          onClick={() => setViewing(true)}
        >
          <img
            className={styles.image}
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            style={
              lens
                ? { transformOrigin: `${lens.x}% ${lens.y}%`, scale: String(HOVER_ZOOM) }
                : undefined
            }
          />
          <button
            type="button"
            className={styles.zoom}
            aria-label={`View ${current.alt || 'photo'} larger`}
            onClick={(event) => {
              event.stopPropagation();
              setViewing(true);
            }}
          >
            <ZoomInIcon />
          </button>
        </div>
        <figcaption className={styles.caption} aria-live="polite">
          <span>
            Image {index + 1} of {images.length}
          </span>
          <span className={styles.tip} aria-hidden="true">
            Hover to zoom · click to enlarge
          </span>
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
      <ZoomViewer
        label={label}
        images={images}
        index={index}
        onIndexChange={(next) => setSelected(images[next]?.id ?? selected)}
        isOpen={viewing}
        onOpenChange={setViewing}
      />
    </section>
  );
}
