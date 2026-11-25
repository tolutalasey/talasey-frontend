import Image from 'next/image';
import NextLink from 'next/link';
import styles from './ProductPage.module.css';

export interface ColourSwatch {
  name: string;
  image: string | null;
  href: string;
}

// The product's colours as photo swatches; each one opens that colour.
export function ColourSwitch({ colours, current }: { colours: ColourSwatch[]; current?: string }) {
  if (colours.length === 0) return null;
  return (
    <div role="group" aria-labelledby="colour-switch-label" className={styles.switch}>
      <p id="colour-switch-label" className={styles.pickerLabel}>
        Colour: <span className={styles.chosen}>{current ?? 'choose one'}</span>
      </p>
      <ul className={styles.switchList}>
        {colours.map((colour) => (
          <li key={colour.name}>
            <NextLink
              href={colour.href}
              scroll={false}
              aria-current={colour.name === current ? 'true' : undefined}
              className={styles.switchItem}
            >
              <span className={styles.switchPhoto}>
                {colour.image && <Image src={colour.image} alt="" width={56} height={56} />}
              </span>
              {colour.name}
            </NextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
