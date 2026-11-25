import { EnquiryPopup } from '@/features/contact';
import { ShareButton } from '@/ui/ShareButton/ShareButton';
import styles from './ProductActions.module.css';

interface Props {
  title: string;
  handle: string;
  path: string;
  hasSamples: boolean;
  // The product and options chosen, to start the installer form with.
  spec?: string;
}

// The row of buttons every product page has: sample, share and Find an installer, which opens
// the installer form over the page. Find a stockist is the main button on products not sold online.
export function ProductActions({ title, handle, path, hasSamples, spec }: Props) {
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
        <ShareButton title={title} path={path} className={styles.action} />
      </li>
      <li>
        <EnquiryPopup
          kind="installer"
          label="Find an installer"
          productHandle={handle}
          products={spec ?? title}
          className={styles.action}
        />
      </li>
    </ul>
  );
}
