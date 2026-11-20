import Image from 'next/image';
import NextLink from 'next/link';
import { Fragment } from 'react';
import { PageBreadcrumbs } from '@/features/layout';
import { plainPagePath, type PlainPage } from '../content';
import { blocks, type Inline } from '../text';
import styles from './PlainPage.module.css';

function Text({ parts }: { parts: Inline[] }) {
  return parts.map((part, index) => (
    <Fragment key={index}>
      {part.kind === 'link' ? (
        <NextLink href={part.href}>{part.text}</NextLink>
      ) : part.kind === 'bold' ? (
        <strong>{part.text}</strong>
      ) : (
        part.text
      )}
    </Fragment>
  ));
}

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
        {blocks(page.body).map((block, index) =>
          block.kind === 'heading' ? (
            <h2 key={index}>{block.text}</h2>
          ) : block.kind === 'list' ? (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Text parts={item} />
                </li>
              ))}
            </ul>
          ) : (
            <p key={index}>
              <Text parts={block.parts} />
            </p>
          ),
        )}
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
