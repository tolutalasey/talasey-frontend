import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { signOut } from '../actions';
import type { Permission, StaffArea } from '../session.server';
import styles from './Staff.module.css';

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
      <header className={styles.bar}>
        <NextLink href={`/${area}/`} className={styles.title}>
          {title}
        </NextLink>
        <div className={styles.who}>
          <span>
            {me.name} <span className={styles.muted}>({me.role})</span>
          </span>
          <NextLink href="/">View the site</NextLink>
          <form action={signOut}>
            <input type="hidden" name="area" value={area} />
            <button type="submit" className={styles.signOut}>
              Sign out
            </button>
          </form>
        </div>
      </header>
      <nav aria-label={title} className={styles.nav}>
        <ul>
          {visible.map((link) => (
            <li key={link.href}>
              <NextLink href={link.href}>{link.label}</NextLink>
            </li>
          ))}
        </ul>
      </nav>
      <main id="main" className={styles.main}>
        {children}
      </main>
    </div>
  );
}
