import NextLink from 'next/link';
import { LOCAL_HELP, type LocalHelpKind } from '@/features/contact';
import { ShareButton } from './ShareButton';
import styles from './ProductActions.module.css';

interface Props {
  title: string;
  handle: string;
  path: string;
  hasSamples: boolean;
  // Left out when the page already leads with it, such as a product sold only through stockists.
  without?: LocalHelpKind | null;
}

const LOCAL: { kind: LocalHelpKind; label: string }[] = [
  { kind: 'stockist', label: 'Find a stockist' },
  { kind: 'installer', label: 'Find an installer' },
];

// The row of buttons every product page has, like the current site: sample, share, stockist and
// installer.
export function ProductActions({ title, handle, path, hasSamples, without = null }: Props) {
  return (
    <ul className={styles.actions} aria-label="More ways to buy">
      {hasSamples && (
        <li>
          <a href="#samples" className={styles.action}>
            Order sample
          </a>
        </li>
      )}
      <li>
        <ShareButton title={title} path={path} />
      </li>
      {LOCAL.filter(({ kind }) => kind !== without).map(({ kind, label }) => (
        <li key={kind}>
          <NextLink
            href={`${LOCAL_HELP[kind].path}?product=${encodeURIComponent(handle)}`}
            className={styles.action}
          >
            {label}
          </NextLink>
        </li>
      ))}
    </ul>
  );
}
