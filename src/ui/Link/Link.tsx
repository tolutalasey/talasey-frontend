'use client';

import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components';
import styles from './Link.module.css';

export interface LinkProps extends Omit<AriaLinkProps, 'className' | 'style'> {
  href: string;
  className?: string;
}

export function Link({ className, ...props }: LinkProps) {
  return <AriaLink {...props} className={[styles.link, className].filter(Boolean).join(' ')} />;
}
