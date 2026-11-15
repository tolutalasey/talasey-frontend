'use client';

import { useState, type PointerEvent } from 'react';
import { Button, Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { ArrowIcon, CloseIcon, ZoomInIcon, ZoomOutIcon } from '../icons';
import type { GalleryImage } from './Gallery';
import styles from './ZoomViewer.module.css';

const ZOOM = 2.5;

interface Props {
  label: string;
  images: GalleryImage[];
  index: number;
  onIndexChange: (index: number) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const pointIn = (event: PointerEvent<HTMLElement>) => {
  const box = event.currentTarget.getBoundingClientRect();
  return {
    x: ((event.clientX - box.left) / box.width) * 100,
    y: ((event.clientY - box.top) / box.height) * 100,
  };
};

// The photo on its own, as big as the screen allows. Click or tap to zoom in at that spot;
// move the mouse or drag a finger to look around.
export function ZoomViewer({ label, images, index, onIndexChange, isOpen, onOpenChange }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const current = images[index];
  if (!current) return null;

  const go = (step: number) => {
    setZoomed(false);
    onIndexChange((index + step + images.length) % images.length);
  };

  const look = (event: PointerEvent<HTMLElement>) => {
    if (!zoomed) return;
    if (event.pointerType !== 'mouse' && event.buttons === 0) return;
    setOrigin(pointIn(event));
  };

  return (
    <ModalOverlay
      isDismissable
      isOpen={isOpen}
      onOpenChange={(open) => {
        setZoomed(false);
        onOpenChange(open);
      }}
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <Dialog className={styles.dialog} aria-label={`${label}, larger`}>
          {({ close }) => (
            <>
              <header className={styles.bar}>
                <Heading slot="title" className={styles.title}>
                  {current.alt || label}
                </Heading>
                <span className={styles.count}>
                  {index + 1} / {images.length}
                </span>
                <Button
                  className={styles.tool}
                  aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
                  onPress={() => setZoomed((on) => !on)}
                >
                  {zoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
                </Button>
                <Button className={styles.tool} aria-label="Close" onPress={close}>
                  <CloseIcon />
                </Button>
              </header>
              <div
                className={styles.stage}
                data-zoomed={zoomed || undefined}
                onPointerDown={(event) => {
                  if (!zoomed) {
                    setOrigin(pointIn(event));
                    setZoomed(true);
                  } else if (event.pointerType === 'mouse') {
                    setZoomed(false);
                  }
                }}
                onPointerMove={look}
                onDoubleClick={() => setZoomed(false)}
              >
                <img
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  className={styles.image}
                  draggable={false}
                  style={{
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                    scale: zoomed ? String(ZOOM) : '1',
                  }}
                />
              </div>
              {images.length > 1 && (
                <>
                  <Button
                    className={`${styles.step} ${styles.previous}`}
                    aria-label="Previous photo"
                    onPress={() => go(-1)}
                  >
                    <ArrowIcon />
                  </Button>
                  <Button
                    className={`${styles.step} ${styles.next}`}
                    aria-label="Next photo"
                    onPress={() => go(1)}
                  >
                    <ArrowIcon />
                  </Button>
                </>
              )}
              <p className={styles.hint}>
                {zoomed ? 'Move to look around. Click to zoom out.' : 'Click or tap to zoom in.'}
              </p>
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
