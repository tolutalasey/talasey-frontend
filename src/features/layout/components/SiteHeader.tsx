import Image from 'next/image';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { getRanges, rangePath } from '@/features/catalogue';
import { getProjectPages, projectPath } from '@/features/content';
import { SearchLauncher } from '@/features/search';
import { ChevronIcon } from '@/ui/icons';
import { MenuBehaviour } from './MenuBehaviour';
import { MenuPanel } from './MenuPanel';
import styles from './SiteChrome.module.css';

// `bag` is the header's bag link with its count, passed in by the app so the header stays
// cached while the count, which reads the visitor's cookie, streams in.
export async function SiteHeader({ bag }: { bag: ReactNode }) {
  const [ranges, projects] = await Promise.all([getRanges(), getProjectPages()]);
  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <div className={styles.search}>
          <SearchLauncher />
        </div>
        <NextLink href="/" className={styles.logo}>
          <Image
            src="/images/brand/talasey-logo.png"
            alt="Talasey"
            width={900}
            height={212}
            priority
          />
        </NextLink>
        <div className={styles.actions}>
          <NextLink href="/samples/" className={styles.action}>
            Free samples
          </NextLink>
          <NextLink href="/help/" className={styles.action}>
            Help
          </NextLink>
          {bag}
        </div>
      </div>
      <nav id="main-nav" aria-label="Main" className={styles.nav}>
        <MenuBehaviour navId="main-nav" />
        <details className={styles.menu} name="main-menu">
          <summary>
            Shop by product <ChevronIcon className={styles.chevron} width={12} height={12} />
          </summary>
          <MenuPanel
            title="Our ranges"
            links={ranges.map((range) => ({ label: range.name, href: rangePath(range) }))}
            feature={{
              image: '/images/brand/samples-mixed.jpg',
              heading: 'See it in your own garden light',
              href: '/samples/',
              action: 'Order free samples',
            }}
          />
        </details>
        <details className={styles.menu} name="main-menu">
          <summary>
            Shop by project <ChevronIcon className={styles.chevron} width={12} height={12} />
          </summary>
          <MenuPanel
            title="Garden projects"
            links={projects.map((project) => ({
              label: project.name,
              href: projectPath(project),
            }))}
            feature={{
              image: '/images/brand/project-pergola.jpg',
              heading: 'Plan the whole garden',
              href: '/projects/',
              action: 'See every project',
            }}
          />
        </details>
        <NextLink href="/inspiration/" className={styles.navLink}>
          Inspiration
        </NextLink>
        <NextLink href="/guides/" className={styles.navLink}>
          Guides
        </NextLink>
      </nav>
    </header>
  );
}
