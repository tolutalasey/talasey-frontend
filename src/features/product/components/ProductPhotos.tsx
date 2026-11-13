import { Gallery } from '@/ui';
import Image from 'next/image';
import type { ProductPhoto } from '../content';
import styles from './ProductPage.module.css';

const COMING_SOON = '/images/photo-coming-soon.svg';

export function ProductPhotos({ photos, name }: { photos: ProductPhoto[]; name: string }) {
  if (photos.length > 1) {
    return (
      <Gallery
        label={`Photos of ${name}`}
        images={photos.map((photo, index) => ({ id: `${index}-${photo.src}`, ...photo }))}
      />
    );
  }
  const [photo] = photos;
  return (
    <figure className={styles.photo}>
      <Image
        src={photo?.src ?? COMING_SOON}
        alt={photo?.alt ?? ''}
        width={photo?.width ?? 800}
        height={photo?.height ?? 600}
        sizes="(min-width: 64rem) 50vw, 100vw"
        unoptimized={!photo}
        priority
      />
      {!photo && <figcaption>Photos coming soon</figcaption>}
    </figure>
  );
}
