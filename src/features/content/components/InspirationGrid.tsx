'use client';

import Image from 'next/image';
import NextLink from 'next/link';
import { useState } from 'react';
import { ZoomViewer } from '@/ui/Gallery/ZoomViewer';
import type { Inspiration } from '../schemas';
import styles from './Content.module.css';

const captionOf = (item: Inspiration) => (item.town ? `${item.title}, ${item.town}` : item.title);

const productHref = (name: string) => `/search/?q=${encodeURIComponent(name)}`;

// The gallery's photos. Click one to see it full size and step through the rest; each card names
// the products in the photo, linked to the shop.
export function InspirationGrid({ items }: { items: Inspiration[] }) {
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
              <figcaption>
                {captionOf(item)}
                {item.products.length > 0 && (
                  <span className={styles.galleryProducts}>
                    Products:{' '}
                    {item.products.map((name, at) => (
                      <span key={name}>
                        {at > 0 && ', '}
                        <NextLink href={productHref(name)}>{name}</NextLink>
                      </span>
                    ))}
                  </span>
                )}
              </figcaption>
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
