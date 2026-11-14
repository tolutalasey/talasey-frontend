import Image from 'next/image';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { signOut } from '../actions';
import type { Permission, StaffArea } from '../session.server';
import { ExternalIcon, SignOutIcon } from './icons';
import { ShellFrame } from './ShellFrame';
import styles from './Shell.module.css';
import { StaffBreadcrumbs } from './StaffBreadcrumbs';
import { StaffNavLink } from './StaffNavLink';

export interface StaffLink {
  href: string;
  label: string;
  icon: ReactNode;
  permission?: Permission;
}

export interface StaffNavGroup {
  label?: string;
  links: StaffLink[];
}

interface Props {
  area: StaffArea;
  groups: StaffNavGroup[];
  me: { name: string; role: string; permissions: Permission[] };
  children: ReactNode;
}

const AREAS: { area: StaffArea; href: string; label: string; permission?: Permission }[] = [
  { area: 'admin', href: '/admin/', label: 'Shop' },
  { area: 'content', href: '/content/', label: 'Content', permission: 'content.edit' },
];

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

export function StaffShell({ area, groups, me, children }: Props) {
  const allowed = (permission?: Permission) => !permission || me.permissions.includes(permission);
  const visibleGroups = groups
    .map((group) => ({ ...group, links: group.links.filter((link) => allowed(link.permission)) }))
    .filter((group) => group.links.length > 0);
  const areas = AREAS.filter((entry) => allowed(entry.permission));
  const crumbs = [
    { href: `/${area}/`, label: area === 'admin' ? 'Shop' : 'Content' },
    ...visibleGroups.flatMap((group) => group.links),
  ].map(({ href, label }) => ({ href, label }));

  const sidebar = (
    <>
      <NextLink href={`/${area}/`} className={styles.brand}>
        <Image
          src="/images/brand/talasey-logo-on-dark.png"
          alt="Talasey"
          width={900}
          height={212}
          priority
        />
      </NextLink>

      {areas.length > 1 && (
        <nav aria-label="Workspace" className={styles.switcher}>
          {areas.map((entry) => (
            <NextLink
              key={entry.area}
              href={entry.href}
              aria-current={entry.area === area ? 'true' : undefined}
            >
              {entry.label}
            </NextLink>
          ))}
        </nav>
      )}

      <nav aria-label={area === 'admin' ? 'Shop admin' : 'Content'} className={styles.nav}>
        {visibleGroups.map((group, index) => (
          <div key={group.label ?? index} className={styles.group}>
            {group.label && <p className={styles.groupLabel}>{group.label}</p>}
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <StaffNavLink href={link.href}>
                    <span className={styles.navIcon}>{link.icon}</span>
                    {link.label}
                  </StaffNavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.me}>
        <NextLink href={`/${area}/account/`} className={styles.meLink}>
          <span className={styles.avatar} aria-hidden="true">
            {initials(me.name)}
          </span>
          <span className={styles.meText}>
            <span className={styles.meName}>{me.name}</span>
            <span className={styles.meRole}>{me.role}</span>
          </span>
        </NextLink>
        <form action={signOut}>
          <input type="hidden" name="area" value={area} />
          <button type="submit" className={styles.signOut} title="Sign out">
            <SignOutIcon />
            <span className={styles.hidden}>Sign out</span>
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className={styles.shell} data-staff="">
      <ShellFrame
        sidebar={sidebar}
        bar={
          <>
            <StaffBreadcrumbs links={crumbs} />
            <NextLink href="/" className={styles.viewSite} target="_blank" rel="noreferrer">
              <span className={styles.viewSiteText}>View the shop</span>
              <ExternalIcon />
            </NextLink>
          </>
        }
      >
        <main id="main" className={styles.main}>
          {children}
        </main>
      </ShellFrame>
    </div>
  );
}
