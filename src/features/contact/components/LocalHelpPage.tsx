import { PageBreadcrumbs } from '@/features/layout';
import { LOCAL_HELP, type LocalHelpKind } from '../local-help';
import styles from './LocalHelp.module.css';
import { LocalHelpForm } from './LocalHelpForm';

interface Props {
  kind: LocalHelpKind;
  product: { handle: string; title: string } | null;
}

export function LocalHelpPage({ kind, product }: Props) {
  const wording = LOCAL_HELP[kind];
  return (
    <article className={`container ${styles.page}`}>
      <PageBreadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: wording.title, path: wording.path },
        ]}
      />
      <div className={styles.layout}>
        <header className={styles.intro}>
          <p className="eyebrow">Help from our team</p>
          <h1>{wording.title}</h1>
          <p>{wording.intro}</p>
        </header>
        <div className={`frame ${styles.formFrame}`}>
          {product && <p className={styles.product}>About: {product.title}</p>}
          <LocalHelpForm kind={kind} productHandle={product?.handle ?? null} />
        </div>
      </div>
    </article>
  );
}
