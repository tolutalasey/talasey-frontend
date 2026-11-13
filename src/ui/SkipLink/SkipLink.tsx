import styles from './SkipLink.module.css';

export interface SkipLinkProps {
  targetId?: string;
  children?: string;
}

export function SkipLink({ targetId = 'main', children = 'Skip to main content' }: SkipLinkProps) {
  return (
    <a className={styles.skipLink} href={`#${targetId}`}>
      {children}
    </a>
  );
}
