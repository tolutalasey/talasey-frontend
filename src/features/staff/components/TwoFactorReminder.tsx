'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import type { StaffArea } from '../session.server';
import styles from './Shell.module.css';

// Shown on every staff page until two-factor is on, except the page where it is set up.
export function TwoFactorReminder({ area }: { area: StaffArea }) {
  const accountPath = `/${area}/account/`;
  if (usePathname() === accountPath) return null;
  return (
    <p className={styles.reminder} role="note">
      <span>
        <strong>Two-factor sign-in is off.</strong> Turn it on so nobody can sign in with just your
        password.
      </span>
      <NextLink href={accountPath}>Set it up</NextLink>
    </p>
  );
}
