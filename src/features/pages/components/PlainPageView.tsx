import Image from 'next/image';
import NextLink from 'next/link';
import { PageBreadcrumbs } from '@/features/layout';
import { RichText } from './RichText';
import { plainPagePath, type PlainPage } from '../content';
import styles from './PlainPage.module.css';

export function PlainPageView({ page }: { page: PlainPage }) {
  return (
    <article className={styles.page}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: page.title, path: plainPagePath(page) },
        ]}
      />
      <header className={styles.header}>
        <h1>{page.title}</h1>
        {page.intro && <p className={styles.intro}>{page.intro}</p>}
      </header>
      {page.photo && (
        <Image
          className={styles.photo}
          src={page.photo.src}
          alt={page.photo.alt}
          width={page.photo.width}
          height={page.photo.height}
          sizes="(min-width: 64rem) 60rem, 100vw"
          priority
        />
      )}
      <div className={`frame ${styles.body}`}>
        <RichText text={page.body} />
        {page.actions.length > 0 && (
          <p className={styles.actions}>
            {page.actions.map((action, index) => (
              <NextLink
                key={action.href}
                href={action.href}
                className={index === 0 ? 'button' : 'button-secondary'}
              >
                {action.label}
              </NextLink>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}
