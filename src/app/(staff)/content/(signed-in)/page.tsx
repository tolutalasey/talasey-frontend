import type { Metadata } from 'next';
import NextLink from 'next/link';
import { staffStyles as styles } from '@/features/staff';
import { contentTypes } from './types.server';

export const metadata: Metadata = { title: 'Content' };

export default async function ContentHome() {
  const types = await contentTypes();
  return (
    <>
      <h1>Content</h1>
      <p>
        Save drafts as you go; the site keeps showing the published version until an editor
        publishes the new one.
      </p>
      <ul className={styles.grid}>
        {types.map((type) => (
          <li key={type.type} className={styles.panel}>
            <NextLink href={`/content/${type.type}/`}>{type.label}</NextLink>
            {type.locked && (
              <p className={styles.muted}>Approved wording: the owner publishes it.</p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
