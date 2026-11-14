import Image from 'next/image';
import NextLink from 'next/link';
import { getRanges, rangePath } from '@/features/catalogue';
import { getProjectPages, projectPath } from '@/features/content';
import { SearchLauncher } from '@/features/search';
import styles from './SiteChrome.module.css';

export async function SiteHeader() {
  const [ranges, projects] = await Promise.all([getRanges(), getProjectPages()]);
  return (
    <header className={styles.header}>
      <p className={styles.promo}>
        Free samples of any paving, sent to your door.{' '}
        <NextLink href="/samples/">Order samples</NextLink>
      </p>
      <div className={`container ${styles.bar}`}>
        <NextLink href="/" className={styles.logo}>
          <Image
            src="/images/brand/talasey-logo.png"
            alt="Talasey"
            width={900}
            height={212}
            priority
          />
        </NextLink>
        <div className={styles.search}>
          <SearchLauncher />
        </div>
        <NextLink href="/basket/">Basket</NextLink>
      </div>
      <nav aria-label="Main" className={`container ${styles.nav}`}>
        <details className={styles.menu}>
          <summary>Shop by product</summary>
          <ul className={styles.menuList}>
            {ranges.map((range) => (
              <li key={range.slug}>
                <NextLink href={rangePath(range)}>{range.name}</NextLink>
              </li>
            ))}
          </ul>
        </details>
        <details className={styles.menu}>
          <summary>Shop by project</summary>
          <ul className={styles.menuList}>
            {projects.map((project) => (
              <li key={project.slug}>
                <NextLink href={projectPath(project)}>{project.name}</NextLink>
              </li>
            ))}
          </ul>
        </details>
        <NextLink href="/samples/" className={styles.navLink}>
          Free samples
        </NextLink>
        <NextLink href="/help/" className={styles.navLink}>
          Help
        </NextLink>
      </nav>
    </header>
  );
}
