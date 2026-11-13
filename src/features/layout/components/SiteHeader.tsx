import NextLink from 'next/link';
import { getRanges, rangePath } from '@/features/catalogue';
import { getProjectPages, projectPath } from '@/features/content';
import { SearchLauncher } from '@/features/search';
import styles from './SiteChrome.module.css';

export async function SiteHeader() {
  const [ranges, projects] = await Promise.all([getRanges(), getProjectPages()]);
  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <NextLink href="/" className={styles.logo}>
          Talasey
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
        <NextLink href="/contact/?topic=samples" className={styles.navLink}>
          Free samples
        </NextLink>
        <NextLink href="/help/" className={styles.navLink}>
          Help
        </NextLink>
      </nav>
    </header>
  );
}
