import type { Metadata } from 'next';
import NextLink from 'next/link';
import { CONTENT_GROUPS, typeMeta } from '@/features/content-editor';
import {
  Badge,
  ChevronRightIcon,
  PageHeader,
  RocketIcon,
  staffStyles as styles,
} from '@/features/staff';
import { contentTypes } from './types.server';

export const metadata: Metadata = { title: 'Content' };

export default async function ContentHome() {
  const types = await contentTypes();
  const canPublish = types.some((type) => type.canPublish);
  return (
    <>
      <PageHeader
        title="Content"
        description="Save drafts as you go. The site keeps showing the published version until it is published again."
        actions={
          canPublish && (
            <NextLink href="/content/releases/" className={styles.secondaryLink}>
              <RocketIcon />
              Releases
            </NextLink>
          )
        }
      />
      <div className={styles.stack}>
        {CONTENT_GROUPS.map((group) => {
          const inGroup = types.filter((type) => typeMeta(type.type).group === group);
          if (inGroup.length === 0) return null;
          return (
            <section key={group} aria-labelledby={`group-${group}`} className={styles.group}>
              <h2 id={`group-${group}`} className={styles.asideTitle}>
                {group}
              </h2>
              <ul className={styles.tiles}>
                {inGroup.map((type) => {
                  const meta = typeMeta(type.type);
                  return (
                    <li key={type.type} className={styles.tile}>
                      <span className={styles.tileIcon}>{meta.icon}</span>
                      <span className={styles.tileBody}>
                        <h3>
                          <NextLink href={`/content/${type.type}/`}>{type.label}</NextLink>
                        </h3>
                        <p>{meta.text}</p>
                        {type.locked && (
                          <span className={styles.tileBadge}>
                            <Badge tone="brand">Owner publishes</Badge>
                          </span>
                        )}
                      </span>
                      <ChevronRightIcon className={styles.arrow} />
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
