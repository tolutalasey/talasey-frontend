import Image from 'next/image';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { signOut } from '../actions';
import type { Permission, StaffArea } from '../session.server';
import styles from './Staff.module.css';
import { StaffNavLink } from './StaffNavLink';

export interface StaffLink {
  href: string;
  label: string;
  permission?: Permission;
}

interface Props {
  area: StaffArea;
  title: string;
  links: StaffLink[];
  me: { name: string; role: string; permissions: Permission[] };
  children: ReactNode;
}

export function StaffShell({ area, title, links, me, children }: Props) {
  const visible = links.filter(
    (link) => !link.permission || me.permissions.includes(link.permission),
  );
  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <NextLink href={`/${area}/`} className={styles.brand}>
          <Image
            src="/images/brand/talasey-logo-on-dark.png"
            alt="Talasey"
            width={900}
            height={212}
            priority
          />
          <span className={styles.area}>{area === 'admin' ? 'Admin' : 'Content'}</span>
        </NextLink>
        <nav aria-label={title} className={styles.nav}>
          <ul>
            {visible.map((link) => (
              <li key={link.href}>
                <StaffNavLink href={link.href}>{link.label}</StaffNavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className={styles.body}>
        <header className={styles.bar}>
          <span className={styles.title}>{title}</span>
          <div className={styles.who}>
            <NextLink href={`/${area}/account/`}>
              {me.name} <span className={styles.muted}>({me.role})</span>
            </NextLink>
            <NextLink href="/">View the site</NextLink>
            <form action={signOut}>
              <input type="hidden" name="area" value={area} />
              <button type="submit" className={styles.signOut}>
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main id="main" className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}
