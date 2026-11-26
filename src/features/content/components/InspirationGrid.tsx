'use client';

import Image from 'next/image';
import NextLink from 'next/link';
import { useState } from 'react';
import { ZoomViewer } from '@/ui/Gallery/ZoomViewer';
import type { GalleryPhoto } from '../views.server';
import styles from './Content.module.css';

const captionOf = (item: GalleryPhoto) => (item.town ? `${item.title}, ${item.town}` : item.title);

// The gallery's photos. Click one to see it full size and step through the rest. Under each, the
// products in it link to the shop; the photo's own label stays off the page for now.
export function InspirationGrid({ items }: { items: GalleryPhoto[] }) {
  const [index, setIndex] = useState(0);
  const [viewing, setViewing] = useState(false);
  const images = items.map((item) => ({
    id: item.slug,
    ...item.photo,
    alt: captionOf(item),
  }));

  return (
    <>
      <ul className={styles.gallery}>
        {items.map((item, at) => (
          <li key={item.slug}>
            <figure>
              <button
                type="button"
                className={styles.galleryOpen}
                aria-label={`View larger: ${captionOf(item)}`}
                onClick={() => {
                  setIndex(at);
                  setViewing(true);
                }}
              >
                <Image {...item.photo} sizes="(min-width: 64rem) 33vw, 100vw" />
              </button>
              {item.productLinks.length > 0 && (
                <figcaption className={styles.galleryProducts}>
                  Products:{' '}
                  {item.productLinks.map((product, at) => (
                    <span key={product.href}>
                      {at > 0 && ', '}
                      <NextLink href={product.href}>{product.title}</NextLink>
                    </span>
                  ))}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
      <ZoomViewer
        label="Garden inspiration"
        images={images}
        index={index}
        onIndexChange={setIndex}
        isOpen={viewing}
        onOpenChange={setViewing}
      />
    </>
  );
}
