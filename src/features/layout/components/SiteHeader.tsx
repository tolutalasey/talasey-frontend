import Image from 'next/image';
import NextLink from 'next/link';
import { getRanges, rangePath } from '@/features/catalogue';
import { getProjectPages, projectPath } from '@/features/content';
import { SearchLauncher } from '@/features/search';
import { ChevronIcon } from '@/ui/icons';
import { MenuBehaviour } from './MenuBehaviour';
import { MenuPanel } from './MenuPanel';
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
        <NextLink href="/basket/" className={styles.basket}>
          Basket
        </NextLink>
      </div>
      <nav id="main-nav" aria-label="Main" className={`container ${styles.nav}`}>
        <MenuBehaviour navId="main-nav" />
        <details className={styles.menu} name="main-menu">
          <summary>
            Shop by product <ChevronIcon className={styles.chevron} width={14} height={14} />
          </summary>
          <MenuPanel
            title="Our ranges"
            links={ranges.map((range) => ({ label: range.name, href: rangePath(range) }))}
            feature={{
              image: '/images/brand/paving-light-grey.jpg',
              heading: 'Free samples of any paving',
              text: 'See the colour in your own garden light. Up to five, sent to your door.',
              href: '/samples/',
              action: 'Choose your samples',
            }}
          />
        </details>
        <details className={styles.menu} name="main-menu">
          <summary>
            Shop by project <ChevronIcon className={styles.chevron} width={14} height={14} />
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
              text: 'Everything a project needs, from the base to the finishing touches.',
              href: '/projects/',
              action: 'See every project',
            }}
          />
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
